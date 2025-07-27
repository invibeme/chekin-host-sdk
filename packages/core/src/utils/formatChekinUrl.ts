import { ChekinUrlConfig } from '../types/index.js';

export function formatChekinUrl(config: ChekinUrlConfig): string {
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

  if (config.reservationId) {
    url.searchParams.set("reservationId", config.reservationId);
  }

  if (config.defaultLanguage) {
    url.searchParams.set("lang", config.defaultLanguage);
  }
  
  if (config.stylesLink) {
    url.searchParams.set("stylesLink", encodeURIComponent(config.stylesLink));
  }

  if (config.customStyles) {
    const stylesParam = Object.entries(config.customStyles)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
    url.searchParams.set("customStyles", encodeURIComponent(stylesParam));
  }

  return url.toString();
}