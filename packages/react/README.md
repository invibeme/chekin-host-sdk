# chekin-host-sdk-react

React components and hooks for integrating Chekin's host management platform into React applications. Built on top of the core `chekin-host-sdk` package.

## Overview

This package provides React-specific components and hooks that make it easy to integrate the Chekin Host SDK into React applications. It handles component lifecycle, event management, and provides a clean React API.

## Key Features

- **ChekinHostSDKView Component** - Drop-in React component with full SDK integration
- **useHostSDKEventListener Hook** - Event listener hook with automatic cleanup
- **TypeScript Support** - Full type safety with comprehensive interfaces
- **Ref Support** - Direct access to the underlying SDK instance
- **Automatic Lifecycle Management** - Handles SDK creation and cleanup automatically

## Installation

```bash
npm install chekin-host-sdk-react
```

**Note**: This package has peer dependencies on `react` and `react-dom` (>=16.8.0), and automatically includes the core `chekin-host-sdk` package.

## Quick Start

### Basic Component Usage

```jsx
import {ChekinHostSDKView} from 'chekin-host-sdk-react';

function MyComponent() {
  return (
    <ChekinHostSDKView
      apiKey="your-api-key"
      features={['reservations', 'guests']}
      autoHeight={true}
      onHeightChanged={height => console.log('Height:', height)}
      onError={error => console.error('SDK Error:', error)}
    />
  );
}
```

### Using with Ref

```jsx
import { useRef } from 'react';
import { ChekinHostSDKView } from 'chekin-host-sdk-react';
import type { ChekinHostSDKViewHandle } from 'chekin-host-sdk-react';

function MyComponent() {
  const sdkRef = useRef<ChekinHostSDKViewHandle>(null);

  const handleButtonClick = () => {
    // Access the underlying SDK instance
    const sdk = sdkRef.current?.sdk;
    if (sdk) {
      sdk.updateConfig({ features: ['reservations', 'guests', 'payments'] });
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Update Config</button>
      <ChekinHostSDKView
        ref={sdkRef}
        apiKey="your-api-key"
        features={['reservations']}
        className="my-sdk-container"
        style={{ minHeight: '400px', border: '1px solid #ccc' }}
      />
    </div>
  );
}
```

### Using Event Listener Hook

```jsx
import {ChekinHostSDKView, useHostSDKEventListener} from 'chekin-host-sdk-react';

function MyComponent() {
  useHostSDKEventListener({
    onHeightChanged: height => {
      console.log('Height changed:', height);
      // Update your layout or trigger animations
    },
    onError: error => {
      console.error('SDK Error:', error.message);
      // Handle errors, show notifications, etc.
    },
    onConnectionError: error => {
      console.error('Connection Error:', error);
      // Handle network issues
    },
    onPoliceAccountConnection: data => {
      console.log('Police account connected:', data);
    },
    onStatAccountConnection: data => {
      console.log('Statistics account connected:', data);
    },
  });

  return (
    <ChekinHostSDKView apiKey="your-api-key" features={['reservations', 'guests']} />
  );
}
```

## API Reference

### ChekinHostSDKView Component

The main React component for embedding the Chekin Host SDK.

#### Props

For a complete list of all configuration parameters with detailed descriptions, see the [Complete Parameters Table](../core/README.md#complete-parameters-table) in the core SDK documentation.

The component accepts all configuration options from the core SDK plus additional React-specific props:

| Prop          | Type            | Required | Description                            |
| ------------- | --------------- | -------- | -------------------------------------- |
| `apiKey`      | `string`        | ✅       | Your Chekin API key                    |
| `className`   | `string`        | ❌       | CSS class for the container div        |
| `style`       | `CSSProperties` | ❌       | Inline styles for the container div    |
| ...SDK config | Various         | ❌       | All other props from `ChekinSDKConfig` |

**Core SDK Configuration Props:**

- `baseUrl` - Custom base URL for SDK hosting
- `version` - Pin to specific SDK version
- `features` - Array of enabled features
- `housingId` - Pre-select specific housing
- `externalHousingId` - External housing ID for PMS integrations
- `reservationId` - Pre-load specific reservation
- `defaultLanguage` - Default interface language
- `styles` - Custom CSS styles as string
- `stylesLink` - URL to external stylesheet
- `autoHeight` - Auto-adjust iframe height
- `enableLogging` - Enable SDK logging
- `hiddenSections` - Hide specific sections
- `hiddenFormFields` - Hide specific form fields
- `payServicesConfig` - Payment services configuration

**Event Callbacks:**

- `onHeightChanged` - Callback for height changes
- `onError` - Error callback
- `onConnectionError` - Connection error callback
- `onPoliceAccountConnection` - Police account connection callback
- `onStatAccountConnection` - Statistics account connection callback

#### ChekinHostSDKViewHandle

When using a ref, you get access to:

```typescript
interface ChekinHostSDKViewHandle {
  sdk: ChekinHostSDK | null; // Direct access to the SDK instance
  container: HTMLDivElement | null; // The container DOM element
}
```

### useHostSDKEventListener Hook

A React hook for listening to SDK events with automatic cleanup.

#### Parameters

```typescript
interface HostSDKEventCallbacks {
  onHeightChanged?: (height: number) => void;
  onError?: (error: {message: string; code?: string}) => void;
  onConnectionError?: (error: any) => void;
  onPoliceAccountConnection?: (data: any) => void;
  onStatAccountConnection?: (data: any) => void;
}
```

#### Usage

```jsx
useHostSDKEventListener({
  onHeightChanged: height => {
    // Handle height changes
  },
  onError: error => {
    // Handle errors
  },
  // ... other callbacks
});
```

**Note:** The hook automatically adds event listeners when the component mounts and removes them when it unmounts.

## Advanced Examples

### Custom Styling

```jsx
import {ChekinHostSDKView} from 'chekin-host-sdk-react';

function StyledSDK() {
  const customStyles = `
    .primary-button {
      background-color: #007cba;
      border-radius: 8px;
      font-weight: 600;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
  `;

  return (
    <ChekinHostSDKView
      apiKey="your-api-key"
      features={['reservations', 'guests']}
      styles={customStyles}
      className="custom-sdk-wrapper"
      style={{
        border: '1px solid #e1e5e9',
        borderRadius: '12px',
        overflow: 'hidden',
        minHeight: '500px',
      }}
    />
  );
}
```

### Dynamic Configuration Updates

```jsx
import { useState, useRef } from 'react';
import { ChekinHostSDKView } from 'chekin-host-sdk-react';
import type { ChekinHostSDKViewHandle } from 'chekin-host-sdk-react';

function DynamicSDK() {
  const [selectedFeatures, setSelectedFeatures] = useState(['reservations']);
  const [currentHousing, setCurrentHousing] = useState('');
  const sdkRef = useRef<ChekinHostSDKViewHandle>(null);

  const updateFeatures = (features: string[]) => {
    setSelectedFeatures(features);
    // Update the SDK configuration
    sdkRef.current?.sdk?.updateConfig({ features });
  };

  const selectHousing = (housingId: string) => {
    setCurrentHousing(housingId);
    sdkRef.current?.sdk?.updateConfig({ housingId });
  };

  return (
    <div>
      <div className="controls">
        <button onClick={() => updateFeatures(['reservations', 'guests'])}>
          Enable Guests
        </button>
        <button onClick={() => updateFeatures(['reservations', 'payments'])}>
          Enable Payments
        </button>
        <button onClick={() => selectHousing('housing-123')}>
          Select Housing
        </button>
      </div>

      <ChekinHostSDKView
        ref={sdkRef}
        apiKey="your-api-key"
        features={selectedFeatures}
        housingId={currentHousing}
        autoHeight={true}
      />
    </div>
  );
}
```

### Error Handling

```jsx
import {useState} from 'react';
import {ChekinHostSDKView, useHostSDKEventListener} from 'chekin-host-sdk-react';

function SDKWithErrorHandling() {
  const [error, setError] = (useState < string) | (null > null);
  const [isConnected, setIsConnected] = useState(true);

  useHostSDKEventListener({
    onError: error => {
      setError(error.message);
      console.error('SDK Error:', error);
    },
    onConnectionError: error => {
      setIsConnected(false);
      console.error('Connection Error:', error);
    },
  });

  if (error) {
    return (
      <div className="error-container">
        <h3>SDK Error</h3>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="offline-container">
        <h3>Connection Lost</h3>
        <p>Please check your internet connection and try again.</p>
        <button onClick={() => setIsConnected(true)}>Retry</button>
      </div>
    );
  }

  return (
    <ChekinHostSDKView apiKey="your-api-key" features={['reservations', 'guests']} />
  );
}
```

## TypeScript Support

This package is built with TypeScript and provides comprehensive type definitions:

```typescript
import type {
  ChekinHostSDKViewProps,
  ChekinHostSDKViewHandle,
  HostSDKEventCallbacks,
} from 'chekin-host-sdk-react';

// All core SDK types are also re-exported
import type {ChekinSDKConfig} from 'chekin-host-sdk-react';
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- React 16.8+ (hooks support required)

## Development

### Building

```bash
# Build the React package
npm run build

# Development mode with watching
npm run dev
```

### Peer Dependencies

This package requires:

- `react` >= 16.8.0
- `react-dom` >= 16.8.0

## Related Packages

- **[chekin-host-sdk](../core/README.md)** - Core framework-agnostic SDK that this package is built on

## License

MIT License - see [LICENSE](../../LICENSE) file for details.
