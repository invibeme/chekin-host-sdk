import { CHEKIN_EVENTS } from '../constants';

export interface ChekinSDKConfig {
  apiKey: string;
  baseUrl?: string;
  version?: string;
  features?: string[];
  housingId?: string;
  externalHousingId?: string;
  reservationId?: string;
  defaultLanguage?: string;
  styles?: string;
  stylesLink?: string;
  autoHeight?: boolean;
  disableLogging?: boolean; // Disabled by default (logging enabled)
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
  type: keyof typeof CHEKIN_EVENTS | string;
  payload: any;
}

export interface ChekinEventType {
  [CHEKIN_EVENTS.HEIGHT_CHANGED]: number;
  [CHEKIN_EVENTS.ERROR]: { message: string; code?: string };
  [CHEKIN_EVENTS.CONNECTION_ERROR]: any;
  [CHEKIN_EVENTS.POLICE_ACCOUNT_CONNECTION]: any;
  [CHEKIN_EVENTS.STAT_ACCOUNT_CONNECTION]: any;
}

export type ChekinEventCallback<T = any> = (payload: T) => void;