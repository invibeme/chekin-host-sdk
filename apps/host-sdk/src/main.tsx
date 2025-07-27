import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { MessageHandler } from './communication/MessageHandler';
import { HeightObserver } from './communication/HeightObserver';

// Initialize parent communication
const messageHandler = new MessageHandler();
const heightObserver = new HeightObserver(messageHandler);

// Send initial ready signal
messageHandler.sendToParent('ready', {
  timestamp: Date.now(),
  url: window.location.href
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  heightObserver.disconnect();
  messageHandler.destroy();
});
