import { ChekinSDKConfig } from '../types/index.js';

export function formatChekinUrl(config: ChekinSDKConfig): string {
  const version = config.version || 'latest';
  const baseUrl = config.baseUrl || `https://sdk.chekin.com/${version}/`;
  
  const url = new URL(baseUrl);
  url.searchParams.set("apiKey", config.apiKey);

  if (config.features?.length) {
    url.searchParams.set("features", config.features.join(","));
  }
  
  if (config.housingId) {
    url.searchParams.set("housingId", config.housingId);
  }

  if (config.externalHousingId) {
    url.searchParams.set("externalHousingId", config.externalHousingId);
  }

  if (config.reservationId) {
    url.searchParams.set("reservationId", config.reservationId);
  }

  if (config.defaultLanguage) {
    url.searchParams.set("lang", config.defaultLanguage);
  }
  
  if (config.stylesLink) {
    url.searchParams.set("stylesLink", encodeURIComponent(config.stylesLink));
  }

  if (config.styles) {
    const stylesParam = Object.entries(config.styles)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
    url.searchParams.set("customStyles", encodeURIComponent(stylesParam));
  }

  if (config.hiddenFormFields) {
    url.searchParams.set("hiddenFormFields", encodeURIComponent(JSON.stringify(config.hiddenFormFields)));
  }

  if (config.hiddenSections?.length) {
    url.searchParams.set("hiddenSections", config.hiddenSections.join(","));
  }

  if (config.payServicesConfig) {
    url.searchParams.set("payServicesConfig", encodeURIComponent(JSON.stringify(config.payServicesConfig)));
  }

  return url.toString();
}