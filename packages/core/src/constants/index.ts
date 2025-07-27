export const CHEKIN_ROOT_IFRAME_ID = 'chekin-sdk-iframe';

export const CHEKIN_EVENTS = {
  HEIGHT_CHANGED: 'height-changed',
  MODAL_OPEN: 'modal-open',
  TOAST_SHOW: 'toast-show',
  ERROR: 'error',
  CONNECTION_ERROR: 'connection-error',
  POLICE_ACCOUNT_CONNECTION: 'police-account-connection',
  STAT_ACCOUNT_CONNECTION: 'stat-account-connection',
  CONFIG_UPDATE: 'config-update',
  NAVIGATE: 'navigate',
} as const;

export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export type ChekinEventType = keyof typeof CHEKIN_EVENTS;
export type LogLevel = typeof LOG_LEVELS[keyof typeof LOG_LEVELS];