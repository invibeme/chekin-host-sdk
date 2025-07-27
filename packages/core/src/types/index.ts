export interface ChekinSDKConfig {
  apiKey: string;
  baseUrl?: string;
  version?: string;
  features?: string[];
  housingId?: string;
  externalHousingId?: string;
  reservationId?: string;
  defaultLanguage?: string;
  styles?: Record<string, string>;
  stylesLink?: string;
  autoHeight?: boolean;
  hiddenFormFields?: {
    housingInfo?: string[];
    housingPolice?: string[];
    housingStat?: string[];
    guestbookGeneration?: string[];
  };
  hiddenSections?: string[];
  payServicesConfig?: {
    currency?: string;
    liveness?: {
      price?: number;
    };
  };
  onHeightChanged?: (height: number) => void;
  onError?: (error: { message: string; code?: string }) => void;
  onConnectionError?: (error: any) => void;
  onPoliceAccountConnection?: (data: any) => void;
  onStatAccountConnection?: (data: any) => void;
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