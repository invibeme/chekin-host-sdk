import { MessageHandler } from './MessageHandler';

export class HeightObserver {
  private messageHandler: MessageHandler;
  private observer: ResizeObserver;
  private lastHeight = 0;

  constructor(messageHandler: MessageHandler) {
    this.messageHandler = messageHandler;
    this.observer = new ResizeObserver(this.handleResize.bind(this));
    this.observer.observe(document.body);
    
    // Initial height report
    this.reportHeight();
  }

  private handleResize(entries: ResizeObserverEntry[]) {
    const height = Math.ceil(entries[0].contentRect.height);
    
    // Only send if height changed significantly (avoid spam)
    if (Math.abs(height - this.lastHeight) > 5) {
      this.lastHeight = height;
      this.messageHandler.sendToParent('height-changed', height);
    }
  }

  private reportHeight() {
    const height = Math.ceil(document.body.scrollHeight);
    this.lastHeight = height;
    this.messageHandler.sendToParent('height-changed', height);
  }

  public disconnect() {
    this.observer.disconnect();
  }
}