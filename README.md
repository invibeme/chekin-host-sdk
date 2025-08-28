# Chekin Host SDK

A modern, framework-agnostic SDK for integrating Chekin's host management platform into your applications. Built with TypeScript and designed for security, performance, and developer experience.

## Features

- 🚀 **Framework Agnostic** - Works with vanilla JavaScript, React, Vue, Angular, and more
- 🔒 **Secure by Default** - Proper iframe sandboxing and CSP compliance
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🎨 **Customizable** - Flexible styling and configuration options
- 🌍 **CDN Distributed** - Fast global delivery with version management
- 📦 **Tree Shakeable** - Import only what you need
- 🔧 **TypeScript First** - Full type safety and IntelliSense support

## Quick Start

### Installation

```bash
# For vanilla JavaScript/TypeScript
npm install @chekin/sdk

# For React applications
npm install @chekin/sdk-react
```

### Basic Usage

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

#### React Modal
```jsx
import { PopupButton } from '@chekin/sdk-react';

<PopupButton
  apiKey="your-api-key"
  features={['reservations']}
>
  Open Chekin SDK
</PopupButton>
```

## Package Structure

This repository contains multiple packages:

- **`@chekin/sdk`** - Core framework-agnostic SDK
- **`@chekin/sdk-react`** - React components and hooks
- **`apps/host-sdk`** - Iframe application (deployed to CDN)

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Your App      │    │   NPM Package    │    │  Iframe App     │
│                 │    │                  │    │                 │
│  ┌───────────┐  │    │  ┌────────────┐  │    │  ┌───────────┐  │
│  │Integration│  │◄──►│  │ ChekinSDK  │  │◄──►│  │ Host UI   │  │
│  │Component  │  │    │  │            │  │    │  │ (React)   │  │
│  └───────────┘  │    │  └────────────┘  │    │  └───────────┘  │
│                 │    │        │         │    │                 │
└─────────────────┘    │  ┌────────────┐  │    └─────────────────┘
                       │  │postMessage │  │            ▲
                       │  │Communication│  │            │
                       │  └────────────┘  │            │
                       └──────────────────┘            │
                                                       │
                          CDN: https://sdk.chekin.com/
```

## Configuration

### Basic Configuration
```javascript
{
  apiKey: 'your-api-key',          // Required: Your Chekin API key
  features: ['reservations'],      // Optional: Enabled features
  housingId: 'housing-123',        // Optional: Pre-select housing
  reservationId: 'res-456',        // Optional: Pre-load reservation
  defaultLanguage: 'en'            // Optional: Default language
}
```

### Advanced Configuration
```javascript
{
  version: '1.6.2',                // Pin to specific version
  baseUrl: 'https://custom.com/',  // Custom hosting URL
  styles: {                  // Custom CSS styles
    primaryColor: '#007cba',
    fontFamily: 'Arial, sans-serif'
  },
  stylesLink: 'https://yoursite.com/custom.css'  // External stylesheet
}
```

## Event Handling

Listen to SDK events for better integration:

```javascript
sdk.on('height-changed', (height) => {
  console.log(`SDK height: ${height}px`);
});

sdk.on('error', (error) => {
  console.error('SDK Error:', error.message);
});

sdk.on('ready', () => {
  console.log('SDK is ready');
});
```

## React Components

### InlineWidget
Embed the SDK directly in your React component:

```jsx
<InlineWidget
  apiKey="your-api-key"
  features={['reservations', 'guests']}
  autoHeight={true}
  onHeightChanged={(height) => console.log(height)}
  onError={(error) => console.error(error)}
  className="my-sdk-container"
/>
```

### PopupWidget
Display the SDK in a modal overlay:

```jsx
import { PopupWidget, useChekinModal } from '@chekin/sdk-react';

function MyComponent() {
  const { isOpen, open, close } = useChekinModal();

  return (
    <>
      <button onClick={open}>Open SDK</button>
      <PopupWidget
        isOpen={isOpen}
        onClose={close}
        apiKey="your-api-key"
      />
    </>
  );
}
```

### PopupButton
One-click button to open SDK in popup:

```jsx
<PopupButton
  apiKey="your-api-key"
  features={['reservations']}
  onOpen={() => console.log('opened')}
  onClose={() => console.log('closed')}
>
  Manage Reservations
</PopupButton>
```

## React Hooks

### useChekinModal
```jsx
const { isOpen, open, close, toggle } = useChekinModal();
```

### useChekinToast
```jsx
const { toasts, showToast, removeToast, clearToasts } = useChekinToast();

showToast('Success!', 'success', 5000);
```

### useChekinEventListener
```jsx
useChekinEventListener(sdk, 'height-changed', (height) => {
  console.log('Height changed:', height);
});
```

## Security

### Content Security Policy
Add to your CSP headers:
```
frame-src https://sdk.chekin.com;
connect-src https://api.chekin.com;
```

### API Key Management
- Use test keys (`pk_test_...`) for development
- Store production keys securely
- Never expose keys in client-side code
- Rotate keys regularly

## Development

### Prerequisites
- Node.js 18+
- npm or pnpm

### Setup
```bash
git clone https://github.com/chekin/chekin-host-sdk.git
cd chekin-host-sdk
npm install
```

### Build
```bash
# Build all packages
npm run build

# Build specific package
npm run build:core
npm run build:react
npm run build:host-sdk
```

### Development
```bash
# Start all dev servers
npm run dev

# Start specific package
nx dev core
nx dev react
nx serve host-sdk
```

### Testing
```bash
npm run test
npm run lint
npm run typecheck
```

## Examples

See the `examples/` directory for complete integration examples:

- **`vanilla-js/`** - Pure JavaScript integration
- **`react/`** - React component examples
- **`typescript/`** - TypeScript integration with full type safety

## Documentation

- **[API Reference](./docs/api-reference.md)** - Complete API documentation
- **[Integration Guide](./docs/integration-guide.md)** - Detailed integration instructions
- **[Migration Guide](./docs/integration-guide.md#migration-guide)** - Migrating from legacy SDK

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Support

- 📧 Email: support@chekin.com
- 📖 Documentation: https://docs.chekin.com
- 🐛 Issues: https://github.com/chekin/chekin-host-sdk/issues