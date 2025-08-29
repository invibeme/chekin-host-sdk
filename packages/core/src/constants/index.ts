export const CHEKIN_ROOT_IFRAME_ID = 'chekin-sdk-iframe';
export const CHEKIN_IFRAME_TITLE = 'Chekin SDK';
export const CHEKIN_IFRAME_NAME = 'chekin-sdk-frame';

export const CHEKIN_EVENTS = {
  HANDSHAKE: 'handshake',
  HEIGHT_CHANGED: 'height-changed',
  ERROR: 'error',
  CONNECTION_ERROR: 'connection-error',
  POLICE_ACCOUNT_CONNECTION: 'police-account-connection',
  STAT_ACCOUNT_CONNECTION: 'stat-account-connection',
  CONFIG_UPDATE: 'config-update',
  NAVIGATE: 'navigate',
  ROUTE_CHANGED: 'route-changed',
} as const;

export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export type ChekinEventType = keyof typeof CHEKIN_EVENTS;
export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];
