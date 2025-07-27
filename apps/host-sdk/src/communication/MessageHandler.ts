export class MessageHandler {
  private parentOrigin: string;

  constructor() {
    this.parentOrigin = document.referrer ? new URL(document.referrer).origin : '*';
    window.addEventListener('message', this.handleParentMessage.bind(this));
  }

  private handleParentMessage(event: MessageEvent) {
    // Security check: verify origin if known
    if (this.parentOrigin !== '*' && event.origin !== this.parentOrigin) {
      return;
    }

    // Handle messages from parent
    switch (event.data.type) {
      case 'config-update':
        this.updateConfig(event.data.payload);
        break;
      case 'navigate':
        this.navigate(event.data.payload.path);
        break;
      default:
        console.warn('Unknown message type:', event.data.type);
    }
  }

  public sendToParent(type: string, payload: any) {
    window.parent.postMessage({ type, payload }, this.parentOrigin);
  }

  private updateConfig(config: any) {
    // Update SDK configuration
    console.log('Config updated:', config);
    // TODO: Implement config update logic
  }

  private navigate(path: string) {
    // Handle navigation within iframe
    console.log('Navigate to:', path);
    // TODO: Implement navigation logic
  }

  public destroy() {
    window.removeEventListener('message', this.handleParentMessage.bind(this));
  }
}