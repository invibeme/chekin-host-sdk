import { ChekinUrlConfig, ChekinEventCallback } from './types/index.js';
import { ChekinCommunicator } from './communication/ChekinCommunicator.js';
import { formatChekinUrl } from './utils/formatChekinUrl.js';

export class ChekinHostSDK {
  private iframe: HTMLIFrameElement | null = null;
  private communicator: ChekinCommunicator | null = null;
  private config: ChekinUrlConfig;
  
  constructor(config: ChekinUrlConfig) {
    this.config = config;
  }
  
  // Framework-agnostic render method
  public render(container: string | HTMLElement): Promise<void> {
    const targetElement = typeof container === 'string' 
      ? document.getElementById(container)
      : container;
      
    if (!targetElement) {
      throw new Error(`Container not found: ${container}`);
    }
    
    return this.createIframe(targetElement);
  }
  
  private createIframe(container: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
      this.iframe = document.createElement('iframe');
      this.iframe.src = formatChekinUrl(this.config);
      this.iframe.style.cssText = 'width: 100%; border: none;';
      
      // Set iframe sandbox for security
      this.iframe.sandbox.add('allow-scripts', 'allow-same-origin', 'allow-forms');
      
      this.iframe.onload = () => {
        if (this.iframe) {
          this.communicator = new ChekinCommunicator(this.iframe, this.config);
          resolve();
        }
      };
      
      this.iframe.onerror = reject;
      container.appendChild(this.iframe);
    });
  }
  
  public destroy(): void {
    if (this.iframe?.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
    this.communicator?.destroy();
    this.iframe = null;
    this.communicator = null;
  }
  
  // Event handling
  public on(event: string, callback: ChekinEventCallback): void {
    this.communicator?.on(event, callback);
  }
  
  public off(event: string, callback: ChekinEventCallback): void {
    this.communicator?.off(event, callback);
  }

  // Update configuration
  public updateConfig(newConfig: Partial<ChekinUrlConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.communicator?.send({
      type: 'config-update',
      payload: this.config
    });
  }

  // Navigate within iframe
  public navigate(path: string): void {
    this.communicator?.send({
      type: 'navigate',
      payload: { path }
    });
  }
}