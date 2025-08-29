import {CHEKIN_EVENTS} from '../constants';

type ConnectionState =
  | 'CONNECTION_VALIDATION_FAILED'
  | 'CONNECTION_ERROR'
  | 'DISCONNECTION_ERROR'
  | 'CONNECTED'
  | 'DISCONNECTED';

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
  routeSync?: boolean; // Route synchronization enabled by default
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
  onError?: (error: {message: string; code?: string}) => void;
  onConnectionError?: (error: unknown) => void;
  onPoliceAccountConnection?: (data: {state: ConnectionState}) => void;
  onStatAccountConnection?: (data: {state: ConnectionState}) => void;
}

export interface ChekinMessage {
  type: keyof typeof CHEKIN_EVENTS | string;
  payload: unknown;
}

export interface ChekinEventType {
  [CHEKIN_EVENTS.HEIGHT_CHANGED]: number;
  [CHEKIN_EVENTS.ERROR]: {message: string; code?: string};
  [CHEKIN_EVENTS.CONNECTION_ERROR]: unknown;
  [CHEKIN_EVENTS.POLICE_ACCOUNT_CONNECTION]: unknown;
  [CHEKIN_EVENTS.STAT_ACCOUNT_CONNECTION]: unknown;
}

export type ChekinEventCallback<T = unknown> = (payload: T) => void;
