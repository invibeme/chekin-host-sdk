export const CHEKIN_ROOT_IFRAME_ID = 'chekin-host-sdk-iframe';
export const CHEKIN_IFRAME_TITLE = 'Chekin Host SDK';
export const CHEKIN_IFRAME_NAME = 'chekin-host-sdk-frame';

export const CHEKIN_EVENTS = {
  HANDSHAKE: 'chekin:handshake',
  HEIGHT_CHANGED: 'chekin:height-changed',
  ERROR: 'chekin:error',
  CONNECTION_ERROR: 'chekin:connection-error',
  POLICE_ACCOUNT_CONNECTION: 'chekin:police-account-connection',
  STAT_ACCOUNT_CONNECTION: 'chekin:stat-account-connection',
  CONFIG_UPDATE: 'chekin:config-update',
  ROUTE_CHANGED: 'chekin:route-changed',
  INIT_ROUTE: 'chekin:init-route',
  READY: 'chekin:ready',
} as const;

export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export type ChekinEventType = keyof typeof CHEKIN_EVENTS;
export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];
