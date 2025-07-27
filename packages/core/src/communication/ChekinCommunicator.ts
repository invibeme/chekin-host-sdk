import { ChekinMessage, ChekinEventCallback, ChekinSDKConfig } from '../types/index.js';
import { ChekinLogger } from '../utils/ChekinLogger.js';

export class ChekinCommunicator {
  private iframe: HTMLIFrameElement;
  private eventListeners: Map<string, ChekinEventCallback[]> = new Map();
  private config: ChekinSDKConfig;
  private logger: ChekinLogger;

  constructor(iframe: HTMLIFrameElement, config: ChekinSDKConfig, logger: ChekinLogger) {
    this.iframe = iframe;
    this.config = config;
    this.logger = logger;
    window.addEventListener('message', this.handleMessage.bind(this));
    this.logger.debug('ChekinCommunicator initialized', undefined, 'COMMUNICATION');
  }

  private handleMessage(event: MessageEvent<ChekinMessage>) {
    // Security check: ensure message is from our iframe
    if (event.source !== this.iframe.contentWindow) return;

    this.logger.logCommunicationEvent(event.data.type, event.data.payload);
    
    const listeners = this.eventListeners.get(event.data.type) || [];
    listeners.forEach(listener => {
      try {
        listener(event.data.payload);
      } catch (error) {
        this.logger.error('Error in Chekin event listener', { error, eventType: event.data.type }, 'COMMUNICATION');
      }
    });
  }

  public on(
    type: string,
    callback: ChekinEventCallback
  ): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    this.eventListeners.get(type)!.push(callback);
    this.logger.debug(`Event listener added for: ${type}`, undefined, 'COMMUNICATION');
  }

  public off(
    type: string,
    callback: ChekinEventCallback
  ): void {
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
        this.logger.debug(`Event listener removed for: ${type}`, undefined, 'COMMUNICATION');
      }
    }
  }

  public send(message: ChekinMessage): void {
    if (this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(message, '*');
      this.logger.debug(`Message sent to iframe: ${message.type}`, message.payload, 'COMMUNICATION');
    } else {
      this.logger.warn('Cannot send message: iframe contentWindow is not available', { messageType: message.type }, 'COMMUNICATION');
    }
  }

  public destroy(): void {
    window.removeEventListener('message', this.handleMessage.bind(this));
    this.eventListeners.clear();
    this.logger.debug('ChekinCommunicator destroyed', undefined, 'COMMUNICATION');
  }
}