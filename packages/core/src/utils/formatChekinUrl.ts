import { ChekinSDKConfig } from '../types/index.js';

const getBaseUrl = (version = 'latest') => {
    const normalizedVersion = version === 'latest' ? version :
        (version.startsWith('v') ? version : `v${version}`);
    return `https://cdn.chekin.com/housings-sdk/${normalizedVersion}/`
}

const URL_LENGTH_LIMITS = {
  IE: 2083,
  SAFE_LIMIT: 2000,
  EXTENDED_LIMIT: 8192
} as const;

export interface UrlConfigResult {
  url: string;
  postMessageConfig?: Partial<ChekinSDKConfig>;
  isLengthLimited: boolean;
}

export function formatChekinUrl(config: ChekinSDKConfig): UrlConfigResult {
  const version = config.version || 'latest';
  const baseUrl = config.baseUrl || getBaseUrl(version)
  
  const url = new URL(baseUrl);
  
  const essentialParams = {
    apiKey: config.apiKey,
    features: config.features,
    housingId: config.housingId,
    externalHousingId: config.externalHousingId,
    reservationId: config.reservationId,
    lang: config.defaultLanguage,
  };


  // Add essential parameters to URL
  Object.entries(essentialParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          url.searchParams.set(key, value.join(","));
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  });

  let postMessageConfig: Partial<ChekinSDKConfig> = {};
  let isLengthLimited = false;

  if (config.stylesLink && config.stylesLink.length < 500) {
    url.searchParams.set("stylesLink", encodeURIComponent(config.stylesLink));
  } else if (config.stylesLink) {
    postMessageConfig = { ...postMessageConfig, stylesLink: config.stylesLink };
    isLengthLimited = true;
  }

  if (config.styles) {
    const stylesParam = Object.entries(config.styles)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
    const encodedStyles = encodeURIComponent(stylesParam);
    
    if (encodedStyles.length < 500) {
      url.searchParams.set("customStyles", encodedStyles);
    } else {
      postMessageConfig = { ...postMessageConfig, styles: config.styles };
      isLengthLimited = true;
    }
  }

  // Check if we can add hiddenSections to URL
  if (config.hiddenSections?.length) {
    const sectionsParam = config.hiddenSections.join(",");
    if (sectionsParam.length < 200) {
      url.searchParams.set("hiddenSections", sectionsParam);
    } else {
      postMessageConfig = { ...postMessageConfig, hiddenSections: config.hiddenSections };
      isLengthLimited = true;
    }
  }

  // Large JSON objects always go via postMessage
  if (config.hiddenFormFields) {
    postMessageConfig = { ...postMessageConfig, hiddenFormFields: config.hiddenFormFields };
    isLengthLimited = true;
  }

  if (config.payServicesConfig) {
    postMessageConfig = { ...postMessageConfig, payServicesConfig: config.payServicesConfig };
    isLengthLimited = true;
  }

  const finalUrl = url.toString();

  if (finalUrl.length > URL_LENGTH_LIMITS.SAFE_LIMIT) {
    const minimalUrl = new URL(baseUrl);
    minimalUrl.searchParams.set("apiKey", config.apiKey);
    
    if (config.housingId) {
      minimalUrl.searchParams.set("housingId", config.housingId);
    }
    
    if (config.externalHousingId) {
      minimalUrl.searchParams.set("externalHousingId", config.externalHousingId);
    }

    postMessageConfig = {
      ...postMessageConfig,
      features: config.features,
      reservationId: config.reservationId,
      defaultLanguage: config.defaultLanguage,
    };

    return {
      url: minimalUrl.toString(),
      postMessageConfig,
      isLengthLimited: true
    };
  }

  return {
    url: finalUrl,
    postMessageConfig: Object.keys(postMessageConfig).length > 0 ? postMessageConfig : undefined,
    isLengthLimited
  };
}