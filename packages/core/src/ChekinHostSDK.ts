import { ChekinSDKConfig, ChekinEventCallback } from './types/index.js';
import { ChekinCommunicator } from './communication/ChekinCommunicator.js';
import { formatChekinUrl } from './utils/formatChekinUrl.js';

export class ChekinSDK {
  private iframe: HTMLIFrameElement | null = null;
  private communicator: ChekinCommunicator | null = null;
  private config: ChekinSDKConfig;
  private observer: MutationObserver | null = null;
  
  constructor(config: ChekinSDKConfig) {
    this.config = config;
    this.validateConfig();
  }
  
  private validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error('apiKey is required');
    }
  }
  
  // Initialize SDK (similar to your original initialize method)
  public initialize(config: ChekinSDKConfig): void {
    this.config = { ...this.config, ...config };
    this.validateConfig();
  }
  
  // Framework-agnostic render method (similar to your renderApp)
  public render(container: string | HTMLElement): Promise<HTMLIFrameElement> {
    const targetElement = typeof container === 'string' 
      ? document.getElementById(container)
      : container;
      
    if (!targetElement) {
      throw new Error(`Container element not found: ${container}`);
    }
    
    if (!this.config.apiKey) {
      throw new Error('SDK must be initialized with apiKey before rendering');
    }
    
    return this.createIframe(targetElement);
  }
  
  private createIframe(container: HTMLElement): Promise<HTMLIFrameElement> {
    return new Promise((resolve, reject) => {
      if (this.iframe) {
        container.appendChild(this.iframe);
        resolve(this.iframe);
        return;
      }

      this.iframe = document.createElement('iframe');
      this.iframe.src = formatChekinUrl(this.config);
      this.iframe.style.cssText = `
        width: 100%; 
        border: none; 
        overflow: ${this.config.autoHeight ? 'hidden' : 'initial'};
      `;
      this.iframe.title = 'Chekin SDK';
      this.iframe.name = 'chekin-sdk-frame';
      this.iframe.role = 'application';
      this.iframe.id = CHEKIN_ROOT_IFRAME_ID;

      // Set iframe sandbox for security (similar to your commented sandbox)
      this.iframe.setAttribute('sandbox', 'allow-modals allow-forms allow-popups allow-scripts allow-same-origin');
      
      this.iframe.onload = () => {
        if (this.iframe) {
          this.communicator = new ChekinCommunicator(this.iframe, this.config);
          this.setupEventListeners();
          resolve(this.iframe);
        }
      };
      
      this.iframe.onerror = reject;
      container.appendChild(this.iframe);
      this.observeContainerRemoval(container);
    });
  }

  private observeContainerRemoval(container: HTMLElement): void {
    this.observer?.disconnect();
    this.observer = new MutationObserver(() => {
      if (!document.getElementById(container.id)) {
        this.destroy();
      }
    });

    this.observer.observe(container.ownerDocument || document, {
      childList: true,
      subtree: true,
    });
  }

  private setupEventListeners(): void {
    if (!this.communicator) return;

    // Set up event callbacks from config
    if (this.config.onHeightChanged) {
      this.communicator.on('height-changed', this.config.onHeightChanged);
    }
    if (this.config.onError) {
      this.communicator.on('error', this.config.onError);
    }
    if (this.config.onConnectionError) {
      this.communicator.on('connection-error', this.config.onConnectionError);
    }
    if (this.config.onPoliceAccountConnection) {
      this.communicator.on('police-account-connection', this.config.onPoliceAccountConnection);
    }
    if (this.config.onStatAccountConnection) {
      this.communicator.on('stat-account-connection', this.config.onStatAccountConnection);
    }
  }
  
  public destroy(): void {
    if (this.iframe?.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
    this.communicator?.destroy();
    this.observer?.disconnect();
    this.iframe = null;
    this.communicator = null;
    this.observer = null;
  }
  
  // Event handling
  public on(event: string, callback: ChekinEventCallback): void {
    this.communicator?.on(event, callback);
  }
  
  public off(event: string, callback: ChekinEventCallback): void {
    this.communicator?.off(event, callback);
  }

  // Update configuration
  public updateConfig(newConfig: Partial<ChekinSDKConfig>): void {
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