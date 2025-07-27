# Integration Guide

## Quick Start

### 1. Installation

#### Vanilla JavaScript / TypeScript
```bash
npm install @chekin/sdk
```

#### React Applications  
```bash
npm install @chekin/sdk-react
```

### 2. Basic Usage

#### Vanilla JavaScript
```javascript
import { ChekinSDK } from '@chekin/sdk';

const sdk = new ChekinSDK({
  apiKey: 'your-api-key',
  features: ['reservations', 'guests']
});

sdk.render('chekin-container').then(() => {
  console.log('SDK loaded successfully');
});
```

#### React
```jsx
import { InlineWidget } from '@chekin/sdk-react';

function MyComponent() {
  return (
    <InlineWidget
      apiKey="your-api-key"
      features={['reservations', 'guests']}
      onHeightChanged={(height) => console.log(height)}
    />
  );
}
```

## Configuration Options

### API Key
Your API key is required for all SDK integrations. Get your API key from the Chekin dashboard.

```javascript
{
  apiKey: 'pk_live_...' // or 'pk_test_...' for testing
}
```

### Features
Control which features are enabled in the SDK:

```javascript
{
  features: [
    'reservations',    // Reservation management
    'guests',          // Guest information
    'documents',       // Document upload/verification
    'payments',        // Payment processing
    'messaging'        // Guest messaging
  ]
}
```

### Versioning
Pin to a specific SDK version for stability:

```javascript
{
  version: '1.6.2'      // Pin to specific version
  // version: 'latest'  // Always use latest (default)
}
```

### Styling
Customize the SDK appearance:

```javascript
{
  customStyles: {
    primaryColor: '#007cba',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px'
  },
  stylesLink: 'https://yoursite.com/chekin-custom.css'
}
```

### Context
Provide context for better user experience:

```javascript
{
  housingId: 'housing-123',        // Pre-select housing
  reservationId: 'res-456',       // Pre-load reservation
  defaultLanguage: 'en'           // Set default language
}
```

## Integration Patterns

### 1. Inline Embedding
Embed the SDK directly in your page:

```html
<div id="chekin-sdk" style="min-height: 400px;"></div>
```

```javascript
const sdk = new ChekinSDK({
  apiKey: 'your-api-key'
});

sdk.render('chekin-sdk');
```

### 2. Modal/Popup Integration
Show the SDK in a modal overlay:

#### Vanilla JavaScript
```javascript
const sdk = new ChekinSDK({
  apiKey: 'your-api-key'
});

// Create modal
const modal = document.createElement('div');
modal.className = 'modal-overlay';
modal.innerHTML = `
  <div class="modal-content">
    <button class="close-btn">×</button>
    <div id="chekin-modal-content"></div>
  </div>
`;

document.body.appendChild(modal);
sdk.render('chekin-modal-content');
```

#### React
```jsx
import { PopupWidget, useChekinModal } from '@chekin/sdk-react';

function MyComponent() {
  const { isOpen, open, close } = useChekinModal();

  return (
    <>
      <button onClick={open}>Open Chekin</button>
      <PopupWidget
        isOpen={isOpen}
        onClose={close}
        apiKey="your-api-key"
      />
    </>
  );
}
```

### 3. Button Trigger
Use a button to trigger the SDK:

```jsx
import { PopupButton } from '@chekin/sdk-react';

<PopupButton
  apiKey="your-api-key"
  features={['reservations']}
>
  Manage Reservations
</PopupButton>
```

## Event Handling

### Height Changes
The SDK automatically adjusts its height. Listen for changes:

```javascript
sdk.on('height-changed', (height) => {
  console.log(`SDK height is now: ${height}px`);
});
```

### Error Handling
Handle errors gracefully:

```javascript
sdk.on('error', (error) => {
  console.error('SDK Error:', error.message);
  // Show user-friendly error message
});
```

### User Actions
Listen for user interactions:

```javascript
sdk.on('modal-open', (data) => {
  console.log('Modal opened:', data.title);
});

sdk.on('toast-show', (data) => {
  console.log('Toast:', data.message);
});
```

## Security Considerations

### Content Security Policy (CSP)
Add the following to your CSP headers:

```
frame-src https://sdk.chekin.com;
connect-src https://api.chekin.com;
```

### API Key Security
- Use environment variables for API keys
- Never expose live API keys in client-side code
- Use test keys (`pk_test_...`) for development
- Rotate keys regularly

### Iframe Sandboxing
The SDK uses secure iframe sandboxing:

```javascript
// Automatically applied
sandbox="allow-scripts allow-same-origin allow-forms"
```

## Performance Optimization

### Lazy Loading
Load the SDK only when needed:

```javascript
async function loadChekinSDK() {
  const { ChekinSDK } = await import('@chekin/sdk');
  return new ChekinSDK(config);
}

// Load on user interaction
button.addEventListener('click', async () => {
  const sdk = await loadChekinSDK();
  sdk.render('container');
});
```

### Preloading
Preload the SDK iframe for faster loading:

```html
<link rel="preload" href="https://sdk.chekin.com/latest/" as="document">
```

### Caching
The SDK is served via CDN with aggressive caching:
- Static assets: 1 year cache
- HTML: 1 hour cache
- Versioned URLs: Immutable cache

## Responsive Design

### Mobile Optimization
The SDK is mobile-responsive by default:

```css
.chekin-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
```

### Custom Breakpoints
Adjust behavior for different screen sizes:

```javascript
const isMobile = window.innerWidth < 768;

const sdk = new ChekinSDK({
  apiKey: 'your-api-key',
  customStyles: {
    fontSize: isMobile ? '14px' : '16px',
    padding: isMobile ? '10px' : '20px'
  }
});
```

## Testing

### Test Environment
Use test API keys for development:

```javascript
const sdk = new ChekinSDK({
  apiKey: 'pk_test_your_test_key',
  baseUrl: 'https://sdk-sandbox.chekin.com/' // Test environment
});
```

### Development Mode
Run the SDK locally during development:

```javascript
const sdk = new ChekinSDK({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:5173/' // Local development
});
```

## Troubleshooting

### Common Issues

#### SDK Not Loading
1. Check API key validity
2. Verify network connectivity
3. Check browser console for errors
4. Ensure container element exists

#### Height Issues
1. Ensure `autoHeight` is enabled
2. Check for CSS conflicts
3. Listen for `height-changed` events

#### CSP Blocking
1. Add required CSP directives
2. Check browser security headers
3. Verify iframe source is allowed

### Debug Mode
Enable verbose logging:

```javascript
const sdk = new ChekinSDK({
  apiKey: 'your-api-key',
  debug: true // Enable debug logging
});
```

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- No IE support

## Migration Guide

### From Legacy SDK
If migrating from the legacy same-domain iframe SDK:

1. Update initialization:
```javascript
// Old
const sdk = new ChekinHousingsSDK();
sdk.initialize(config);
sdk.renderApp({ targetNode: element });

// New
const sdk = new ChekinSDK(config);
sdk.render(element);
```

2. Update event handling:
```javascript
// Old
sdk.on('heightChanged', callback);

// New  
sdk.on('height-changed', callback);
```

3. Update configuration:
```javascript
// Old
{ apiKey, housingsId, features }

// New
{ apiKey, housingId, features }
```