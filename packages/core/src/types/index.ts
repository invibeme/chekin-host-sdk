export interface ChekinUrlConfig {
  baseUrl?: string;
  apiKey: string;
  version?: string;              // Optional version pinning
  features?: string[];
  housingId?: string;
  reservationId?: string;
  defaultLanguage?: string;
  customStyles?: Record<string, string>;
  stylesLink?: string;           // External CSS
}

export interface ChekinMessage {
  type: 'height-changed' | 'modal-open' | 'toast-show' | 'error' | 'config-update' | 'navigate';
  payload: any;
}

export interface ChekinEventType {
  'height-changed': number;
  'modal-open': { title?: string; content?: string };
  'toast-show': { message: string; type: 'success' | 'error' | 'info' };
  'error': { message: string; code?: string };
}

export type ChekinEventCallback<T = any> = (payload: T) => void;