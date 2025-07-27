import { ChekinMessage, ChekinEventCallback, ChekinSDKConfig } from '../types';

export class ChekinCommunicator {
  private iframe: HTMLIFrameElement;
  private eventListeners: Map<string, ChekinEventCallback[]> = new Map();
  private config: ChekinSDKConfig;

  constructor(iframe: HTMLIFrameElement, config: ChekinSDKConfig) {
    this.iframe = iframe;
    this.config = config;
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  private handleMessage(event: MessageEvent<ChekinMessage>) {
    // Security check: ensure message is from our iframe
    if (event.source !== this.iframe.contentWindow) return;

    const listeners = this.eventListeners.get(event.data.type) || [];
    listeners.forEach(listener => {
      try {
        listener(event.data.payload);
      } catch (error) {
        console.error('Error in Chekin event listener:', error);
      }
    });
  }

  public on<K extends keyof typeof this.eventListeners>(
    type: K,
    callback: ChekinEventCallback
  ): void {
    if (!this.eventListeners.has(type as string)) {
      this.eventListeners.set(type as string, []);
    }
    this.eventListeners.get(type as string)!.push(callback);
  }

  public off<K extends keyof typeof this.eventListeners>(
    type: K,
    callback: ChekinEventCallback
  ): void {
    const listeners = this.eventListeners.get(type as string);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  public send(message: ChekinMessage): void {
    if (this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(message, '*');
    }
  }

  public destroy(): void {
    window.removeEventListener('message', this.handleMessage.bind(this));
    this.eventListeners.clear();
  }
}