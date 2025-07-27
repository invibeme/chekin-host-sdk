import { 
  ChekinSDK, 
  ChekinUrlConfig, 
  ChekinEventCallback,
  formatChekinUrl 
} from '@chekin/sdk';

// Define strongly typed configuration
const config: ChekinUrlConfig = {
  apiKey: 'demo-api-key',
  features: ['reservations', 'guests'],
  housingId: 'demo-housing-123',
  reservationId: 'res-456',
  defaultLanguage: 'en',
  customStyles: {
    primaryColor: '#007cba',
    fontFamily: 'Arial, sans-serif'
  }
};

// Type-safe event handlers
const onHeightChanged: ChekinEventCallback<number> = (height: number) => {
  console.log(`Height changed to: ${height}px`);
  updateHeightDisplay(height);
};

const onError: ChekinEventCallback<{ message: string; code?: string }> = (error) => {
  console.error('SDK Error:', error);
  showErrorMessage(error.message);
};

const onReady: ChekinEventCallback<{ timestamp: number; url: string }> = (data) => {
  console.log('SDK Ready:', data);
  showSuccessMessage('SDK loaded successfully');
};

// SDK Management Class
class ChekinSDKManager {
  private sdk: ChekinSDK | null = null;
  private container: HTMLElement | null = null;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
  }

  async initialize(config: ChekinUrlConfig): Promise<void> {
    try {
      this.sdk = new ChekinSDK(config);
      
      // Set up event listeners
      this.sdk.on('height-changed', onHeightChanged);
      this.sdk.on('error', onError);
      this.sdk.on('ready', onReady);

      // Render the SDK
      await this.sdk.render(this.container!);
      
      logEvent('SDK Initialized', 'SDK loaded and event listeners attached');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logEvent('Initialization Error', message);
      throw error;
    }
  }

  updateConfiguration(newConfig: Partial<ChekinUrlConfig>): void {
    if (!this.sdk) {
      throw new Error('SDK not initialized');
    }

    this.sdk.updateConfig(newConfig);
    logEvent('Config Updated', JSON.stringify(newConfig, null, 2));
  }

  navigate(path: string): void {
    if (!this.sdk) {
      throw new Error('SDK not initialized');
    }

    this.sdk.navigate(path);
    logEvent('Navigation', `Navigated to: ${path}`);
  }

  destroy(): void {
    if (this.sdk) {
      this.sdk.destroy();
      this.sdk = null;
      logEvent('SDK Destroyed', 'SDK instance cleaned up');
    }
  }

  // Utility method to get formatted URL
  getFormattedUrl(config: ChekinUrlConfig): string {
    return formatChekinUrl(config);
  }
}

// UI Helper Functions
function updateHeightDisplay(height: number): void {
  const heightDisplay = document.getElementById('height-display');
  if (heightDisplay) {
    heightDisplay.textContent = `${height}px`;
  }
}

function showErrorMessage(message: string): void {
  showNotification(message, 'error');
}

function showSuccessMessage(message: string): void {
  showNotification(message, 'success');
}

function showNotification(message: string, type: 'error' | 'success' | 'info'): void {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  const container = document.getElementById('notifications');
  if (container) {
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
}

function logEvent(type: string, message: string): void {
  const logContainer = document.getElementById('event-log');
  if (logContainer) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `<strong>[${timestamp}] ${type}:</strong> ${message}`;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
  }
}

// Main Application
class ChekinApp {
  private sdkManager: ChekinSDKManager;

  constructor() {
    this.sdkManager = new ChekinSDKManager('chekin-container');
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Load SDK button
    const loadButton = document.getElementById('load-sdk');
    loadButton?.addEventListener('click', () => {
      this.loadSDK();
    });

    // Destroy SDK button
    const destroyButton = document.getElementById('destroy-sdk');
    destroyButton?.addEventListener('click', () => {
      this.destroySDK();
    });

    // Update config button
    const updateButton = document.getElementById('update-config');
    updateButton?.addEventListener('click', () => {
      this.updateConfig();
    });

    // Navigate button
    const navigateButton = document.getElementById('navigate');
    navigateButton?.addEventListener('click', () => {
      this.navigate('/reservations');
    });
  }

  private async loadSDK(): Promise<void> {
    try {
      await this.sdkManager.initialize(config);
      
      // Display formatted URL
      const urlDisplay = document.getElementById('formatted-url');
      if (urlDisplay) {
        urlDisplay.textContent = this.sdkManager.getFormattedUrl(config);
      }
    } catch (error) {
      console.error('Failed to load SDK:', error);
    }
  }

  private destroySDK(): void {
    this.sdkManager.destroy();
    
    // Clear displays
    const heightDisplay = document.getElementById('height-display');
    const urlDisplay = document.getElementById('formatted-url');
    
    if (heightDisplay) heightDisplay.textContent = 'N/A';
    if (urlDisplay) urlDisplay.textContent = 'N/A';
  }

  private updateConfig(): void {
    try {
      this.sdkManager.updateConfiguration({
        features: ['reservations', 'guests', 'documents'],
        defaultLanguage: 'es'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      showErrorMessage(message);
    }
  }

  private navigate(path: string): void {
    try {
      this.sdkManager.navigate(path);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      showErrorMessage(message);
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ChekinApp();
  logEvent('Application', 'TypeScript example application initialized');
});