import { ChekinSDKConfig, ChekinEventCallback } from './types';
import { ChekinCommunicator } from './communication/ChekinCommunicator.js';
import { formatChekinUrl } from './utils/formatChekinUrl.js';
import { ChekinLogger, type ChekinLoggerConfig } from './utils/ChekinLogger.js';
import { CHEKIN_ROOT_IFRAME_ID, CHEKIN_EVENTS, CHEKIN_IFRAME_TITLE, CHEKIN_IFRAME_NAME } from './constants';

export class ChekinSDK {
  private iframe: HTMLIFrameElement | null = null;
  private communicator: ChekinCommunicator | null = null;
  private config: ChekinSDKConfig;
  private observer: MutationObserver | null = null;
  private readonly logger: ChekinLogger;
  private pendingPostMessageConfig?: Partial<ChekinSDKConfig>;
  
  constructor(config: ChekinSDKConfig & { logger?: ChekinLoggerConfig } = {} as any) {
    this.config = config;
    this.logger = new ChekinLogger(config.logger);
    this.validateConfig();
    this.logger.info('ChekinSDK instance created', { apiKey: config.apiKey ? '[REDACTED]' : 'missing' });
  }
  
  private validateConfig(): void {
    if (!this.config.apiKey) {
      const error = new Error('apiKey is required');
      this.logger.error('SDK validation failed: apiKey is required');
      throw error;
    }
    this.logger.debug('SDK configuration validated successfully');
  }
  
  // Initialize SDK (similar to your original initialize method)
  public initialize(config: ChekinSDKConfig): void {
    this.logger.info('Initializing SDK with new configuration');
    this.config = { ...this.config, ...config };
    this.validateConfig();
    this.logger.logConfigUpdate(config);
  }
  
  // Framework-agnostic render method (similar to your renderApp)
  public render(container: string | HTMLElement): Promise<HTMLIFrameElement> {
    const containerId = typeof container === 'string' ? container : container.id || 'unknown';
    this.logger.info(`Starting render process for container: ${containerId}`);
    
    const targetElement = typeof container === 'string' 
      ? document.getElementById(container)
      : container;
      
    if (!targetElement) {
      const error = new Error(`Container element not found: ${container}`);
      this.logger.error('Container element not found', { container });
      throw error;
    }
    
    if (!this.config.apiKey) {
      const error = new Error('SDK must be initialized with apiKey before rendering');
      this.logger.error('Render failed: SDK not initialized with apiKey');
      throw error;
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
      
      // Use new URL formatting to handle length limits
      const urlResult = formatChekinUrl(this.config);
      this.iframe.src = urlResult.url;
      this.pendingPostMessageConfig = urlResult.postMessageConfig;
      
      if (urlResult.isLengthLimited) {
        this.logger.warn('URL length exceeded safe limits, some config will be sent via postMessage', {
          urlLength: urlResult.url.length,
          hasPostMessageConfig: !!urlResult.postMessageConfig
        });
      }
      
      this.iframe.style.cssText = `
        width: 100%; 
        border: none; 
        overflow: ${this.config.autoHeight ? 'hidden' : 'initial'};
      `;
      this.iframe.title = CHEKIN_IFRAME_TITLE;
      this.iframe.name = CHEKIN_IFRAME_NAME;
      this.iframe.role = 'application';
      this.iframe.id = CHEKIN_ROOT_IFRAME_ID;

      this.iframe.setAttribute('sandbox', 'allow-modals allow-forms allow-popups allow-scripts allow-same-origin');
      
      this.iframe.onload = () => {
        if (this.iframe) {
          this.logger.logIframeLoad(this.iframe.src);
          this.communicator = new ChekinCommunicator(this.iframe, this.config, this.logger);
          this.setupEventListeners();
          
          if (this.pendingPostMessageConfig) {
            this.sendPostMessageConfig();
          }
          
          this.logger.logMount(container.id || 'unknown', this.config);
          resolve(this.iframe);
        }
      };
      
      this.iframe.onerror = (error) => {
        this.logger.logIframeError(error, this.iframe?.src);
        reject(error);
      };
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

  private sendPostMessageConfig(): void {
    if (!this.communicator || !this.pendingPostMessageConfig) return;
    
    this.logger.debug('Sending additional config via postMessage', this.pendingPostMessageConfig);
    
    this.communicator.send({
      type: CHEKIN_EVENTS.CONFIG_UPDATE,
      payload: this.pendingPostMessageConfig
    });
    
    this.pendingPostMessageConfig = undefined;
  }

  private setupEventListeners(): void {
    if (!this.communicator) return;

    // Set up event callbacks from config
    if (this.config.onHeightChanged) {
      this.communicator.on(CHEKIN_EVENTS.HEIGHT_CHANGED, this.config.onHeightChanged);
    }
    if (this.config.onError) {
      this.communicator.on(CHEKIN_EVENTS.ERROR, this.config.onError);
    }
    if (this.config.onConnectionError) {
      this.communicator.on(CHEKIN_EVENTS.CONNECTION_ERROR, this.config.onConnectionError);
    }
    if (this.config.onPoliceAccountConnection) {
      this.communicator.on(CHEKIN_EVENTS.POLICE_ACCOUNT_CONNECTION, this.config.onPoliceAccountConnection);
    }
    if (this.config.onStatAccountConnection) {
      this.communicator.on(CHEKIN_EVENTS.STAT_ACCOUNT_CONNECTION, this.config.onStatAccountConnection);
    }
  }
  
  public destroy(): void {
    this.logger.info('Destroying SDK instance');
    if (this.iframe?.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
    this.communicator?.destroy();
    this.observer?.disconnect();
    this.iframe = null;
    this.communicator = null;
    this.observer = null;
    this.logger.logUnmount('SDK destroyed');
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
    this.logger.info('Updating SDK configuration', newConfig);
    this.config = { ...this.config, ...newConfig };
    this.communicator?.send({
      type: CHEKIN_EVENTS.CONFIG_UPDATE,
      payload: this.config
    });
    this.logger.logConfigUpdate(newConfig);
  }

  public navigate(path: string): void {
    this.logger.info(`Navigating to path: ${path}`);
    this.communicator?.send({
      type: CHEKIN_EVENTS.NAVIGATE,
      payload: { path }
    });
  }

  public getLogger(): ChekinLogger {
    return this.logger;
  }

  public async sendLogs(endpoint?: string): Promise<void> {
    await this.logger.sendLogs(endpoint);
  }
}