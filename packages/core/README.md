# @chekin/host-sdk (Core Package)

The core framework-agnostic SDK package for integrating Chekin's host management platform into web applications through secure iframe embedding.

## Overview

This package provides the foundational `ChekinHostSDK` class that can be used in any JavaScript/TypeScript environment, regardless of framework. It handles iframe creation, secure communication via postMessage, configuration validation, and comprehensive logging.

## Key Features

- **Framework Agnostic** - Works with vanilla JS, React, Vue, Angular, Svelte, or any web framework
- **Secure Iframe Embedding** - Proper sandboxing and CSP compliance
- **Smart URL Management** - Handles query parameter limits with postMessage fallback
- **Type-Safe Configuration** - Full TypeScript support with runtime validation
- **Event System** - Comprehensive event handling for iframe communication
- **Logging & Debugging** - Built-in logger with remote log shipping capabilities
- **Route Synchronization** - Optional URL sync between parent and iframe

## Installation

```bash
npm install @chekin/host-sdk
```

## Quick Start

```javascript
import {ChekinHostSDK} from '@chekin/host-sdk';

const sdk = new ChekinHostSDK({
  apiKey: 'your-api-key',
  features: ['reservations', 'guests'],
  autoHeight: true,
  onHeightChanged: height => console.log(`Height: ${height}px`),
});

// Render into a DOM element
await sdk.render('container-element-id');
// or
await sdk.render(document.getElementById('container'));
```

## Core Architecture

### ChekinHostSDK Class (`src/ChekinHostSDK.ts`)

Main SDK class providing:

- Iframe lifecycle management (creation, loading, destruction)
- Configuration validation and error handling
- Event system with type-safe callbacks
- Route synchronization capabilities
- Logger integration

### Communication Layer (`src/communication/`)

- **ChekinCommunicator** - Handles bidirectional postMessage communication
- Message validation and origin checking
- Event dispatching and listener management

### Utilities (`src/utils/`)

- **formatChekinUrl.ts** - Smart URL building with parameter limit handling
- **validation.ts** - Configuration validation with detailed error reporting
- **ChekinLogger.ts** - Comprehensive logging system with levels and remote shipping
- **packageInfo.ts** - Package metadata utilities

### Types (`src/types/`)

- Complete TypeScript definitions for all SDK interfaces
- Event type definitions and callback signatures
- Configuration interfaces with JSDoc documentation

## API Reference

### Constructor

```typescript
new ChekinHostSDK(config: ChekinSDKConfig & { logger?: ChekinLoggerConfig })
```

### Methods

#### Complete Methods Reference

| Method                      | Parameters                                     | Returns                      | Description                                                                                               |
| --------------------------- | ---------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| **render**                  | `container: string \| HTMLElement`             | `Promise<HTMLIFrameElement>` | Renders the SDK iframe into the specified container. Accepts element ID (string) or HTMLElement reference |
| **destroy**                 | -                                              | `void`                       | Destroys the SDK instance, removes iframe from DOM, and cleans up event listeners                         |
| **updateConfig**            | `newConfig: Partial<ChekinSDKConfig>`          | `void`                       | Updates SDK configuration and sends changes to iframe. Validates new config before applying               |
| **on**                      | `event: string, callback: ChekinEventCallback` | `void`                       | Adds event listener for SDK events. Supports all SDK event types with type-safe callbacks                 |
| **off**                     | `event: string, callback: ChekinEventCallback` | `void`                       | Removes specific event listener. Must pass same callback reference used in `on()`                         |
| **navigate**                | `path: string`                                 | `void`                       | Navigates to specific path within iframe application (e.g., '/reservations/new')                          |
| **enableRouteSync**         | `options?: { hashPrefix?: string }`            | `void`                       | Enables URL synchronization between parent window and iframe with optional hash prefix                    |
| **disableRouteSync**        | -                                              | `void`                       | Disables route synchronization, stopping URL sync between parent and iframe                               |
| **getCurrentRoute**         | -                                              | `string`                     | Returns current route path from iframe application                                                        |
| **getLogger**               | -                                              | `ChekinLogger`               | Returns logger instance for custom logging operations with levels (debug, info, warn, error)              |
| **sendLogs**                | `endpoint?: string`                            | `Promise<void>`              | Sends collected logs to remote endpoint. Uses default endpoint if none provided                           |
| **getValidationResult**     | -                                              | `ValidationResult`           | Returns current configuration validation result with errors and warnings                                  |
| **validateConfig** (static) | `config: ChekinSDKConfig`                      | `ValidationResult`           | Static method to validate configuration without creating SDK instance                                     |

#### Method Categories

**Core Methods**

- `render(container: string | HTMLElement): Promise<HTMLIFrameElement>`
- `destroy(): void`
- `updateConfig(newConfig: Partial<ChekinSDKConfig>): void`

**Event Management**

- `on(event: string, callback: ChekinEventCallback): void`
- `off(event: string, callback: ChekinEventCallback): void`

**Navigation & Routes**

- `navigate(path: string): void`
- `enableRouteSync(options?: { hashPrefix?: string }): void`
- `disableRouteSync(): void`
- `getCurrentRoute(): string`

**Utilities & Debugging**

- `getLogger(): ChekinLogger`
- `sendLogs(endpoint?: string): Promise<void>`
- `getValidationResult(): ValidationResult`
- `static validateConfig(config: ChekinSDKConfig): ValidationResult`

### Configuration

#### Complete Parameters Table

| Parameter                                | Type       | Required | Default                              | Description                                                                                              |
| ---------------------------------------- | ---------- | -------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **apiKey**                               | `string`   | ✅       | -                                    | API key created in the Chekin dashboard. Use `pk_test_...` for development, `pk_live_...` for production |
| **baseUrl**                              | `string`   | ❌       | `'https://cdn.chekin.com/host-sdk/'` | Custom base URL for SDK hosting. Override for self-hosted or custom deployments                          |
| **version**                              | `string`   | ❌       | `'latest'`                           | Pin to specific SDK version for stability. Use semver format (e.g., '1.6.2')                             |
| **features**                             | `string[]` | ❌       | `[]`                                 | Enable specific SDK features: `['reservations', 'guests', 'documents', 'payments', 'messaging']`         |
| **housingId**                            | `string`   | ❌       | -                                    | ID of the particular housing/property to pre-select                                                      |
| **externalHousingId**                    | `string`   | ❌       | -                                    | External housing ID for PMS integrations and third-party systems                                         |
| **reservationId**                        | `string`   | ❌       | -                                    | ID of specific reservation to pre-load in the SDK                                                        |
| **defaultLanguage**                      | `string`   | ❌       | `'en'`                               | Default interface language. Supported: `'en', 'es', 'it', 'pt', 'de', 'fr'`                              |
| **styles**                               | `string`   | ❌       | -                                    | CSS styles injected into the SDK iframe for custom theming                                               |
| **stylesLink**                           | `string`   | ❌       | -                                    | URL to external CSS stylesheet for advanced customization                                                |
| **autoHeight**                           | `boolean`  | ❌       | `true`                               | Automatically adjust iframe height based on content                                                      |
| **disableLogging**                       | `boolean`  | ❌       | `false`                              | Disable SDK internal logging (logs are enabled by default)                                               |
| **hiddenSections**                       | `string[]` | ❌       | `[]`                                 | Hide entire sections by name (e.g., `['payments', 'documents']`)                                         |
| **hiddenFormFields**                     | `object`   | ❌       | `{}`                                 | Hide specific form fields by section                                                                     |
| **hiddenFormFields.housingInfo**         | `string[]` | ❌       | `[]`                                 | Hide housing information form fields                                                                     |
| **hiddenFormFields.housingPolice**       | `string[]` | ❌       | `[]`                                 | Hide police registration form fields                                                                     |
| **hiddenFormFields.housingStat**         | `string[]` | ❌       | `[]`                                 | Hide statistics form fields                                                                              |
| **hiddenFormFields.guestbookGeneration** | `string[]` | ❌       | `[]`                                 | Hide guestbook generation form fields                                                                    |
| **payServicesConfig**                    | `object`   | ❌       | `{}`                                 | Payment services configuration                                                                           |
| **payServicesConfig.currency**           | `string`   | ❌       | -                                    | Currency code for payment services (e.g., 'EUR', 'USD')                                                  |
| **payServicesConfig.liveness**           | `object`   | ❌       | `{}`                                 | Liveness detection configuration                                                                         |
| **payServicesConfig.liveness.price**     | `number`   | ❌       | -                                    | Price for liveness detection service                                                                     |
| **onHeightChanged**                      | `function` | ❌       | -                                    | Callback when iframe height changes. Receives `(height: number)`                                         |
| **onError**                              | `function` | ❌       | -                                    | Error callback. Receives `(error: { message: string; code?: string })`                                   |
| **onConnectionError**                    | `function` | ❌       | -                                    | Connection/network error callback. Receives `(error: any)`                                               |
| **onPoliceAccountConnection**            | `function` | ❌       | -                                    | Police account connection status callback. Receives `(data: any)`                                        |
| **onStatAccountConnection**              | `function` | ❌       | -                                    | Statistics account connection status callback. Receives `(data: any)`                                    |

#### Configuration Interface

```typescript
interface ChekinSDKConfig {
  // Required
  apiKey: string;

  // Optional Core Settings
  baseUrl?: string;
  version?: string;
  features?: string[];

  // Context
  housingId?: string;
  externalHousingId?: string;
  reservationId?: string;
  defaultLanguage?: string;

  // UI Customization
  styles?: string;
  stylesLink?: string;
  autoHeight?: boolean;
  hiddenSections?: string[];
  hiddenFormFields?: {
    housingInfo?: string[];
    housingPolice?: string[];
    housingStat?: string[];
    guestbookGeneration?: string[];
  };

  // Advanced
  disableLogging?: boolean;
  payServicesConfig?: {
    currency?: string;
    liveness?: {price?: number};
  };

  // Event Callbacks
  onHeightChanged?: (height: number) => void;
  onError?: (error: {message: string; code?: string}) => void;
  onConnectionError?: (error: any) => void;
  onPoliceAccountConnection?: (data: any) => void;
  onStatAccountConnection?: (data: any) => void;
}
```

#### Configuration Examples

**Basic Configuration:**

```javascript
{
  apiKey: 'pk_live_your_api_key',
  features: ['reservations', 'guests'],
  housingId: 'housing-123',
  defaultLanguage: 'en'
}
```

**Advanced Configuration:**

```javascript
{
  apiKey: 'pk_live_your_api_key',
  version: '1.6.2',
  features: ['reservations', 'guests', 'payments'],
  housingId: 'housing-123',
  externalHousingId: 'pms-property-456',
  defaultLanguage: 'es',
  styles: `
    .primary-button { background: #007cba; }
    .container { max-width: 800px; }
  `,
  autoHeight: true,
  hiddenSections: ['documents'],
  hiddenFormFields: {
    housingInfo: ['optional-field-1'],
    housingPolice: ['non-required-field']
  },
  payServicesConfig: {
    currency: 'EUR',
    liveness: { price: 5.00 }
  },
  onHeightChanged: (height) => console.log(`Height: ${height}px`),
  onError: (error) => console.error('SDK Error:', error)
}
```

### Events

The SDK emits the following events:

- `height-changed` - Iframe content height changes
- `error` - Error occurs in SDK or iframe
- `handshake` - Initial communication established
- `connection-error` - Network or communication error
- `police-account-connection` - Police account status change
- `stat-account-connection` - Statistics account status change
- `config-update` - Configuration updated
- `navigate` - Navigation within iframe

## Advanced Usage

### Custom Event Handling

```javascript
sdk.on('height-changed', height => {
  document.getElementById('container').style.height = `${height}px`;
});

sdk.on('error', error => {
  console.error('SDK Error:', error.message);
  // Handle error appropriately
});
```

### Route Synchronization

```javascript
// Enable route sync with hash prefix
sdk.enableRouteSync({hashPrefix: 'chekin'});

// Navigate programmatically
sdk.navigate('/reservations/new');

// Get current route
const currentRoute = sdk.getCurrentRoute();
```

### Logging

```javascript
const logger = sdk.getLogger();
logger.info('Custom log message');
logger.warn('Warning message');
logger.error('Error message');

// Send logs to remote endpoint
await sdk.sendLogs('https://your-log-endpoint.com/api/logs');
```

### Configuration Updates

```javascript
// Update configuration after initialization
sdk.updateConfig({
  features: ['reservations', 'guests', 'payments'],
  styles: 'body { background: #f5f5f5; }',
});
```

## Framework Integration Examples

### Vanilla JavaScript

```html
<div id="chekin-container"></div>
<script>
  const sdk = new ChekinHostSDK({apiKey: 'your-key'});
  sdk.render('chekin-container');
</script>
```

### Vue.js

```vue
<template>
  <div ref="container" class="chekin-container"></div>
</template>

<script>
import {ChekinHostSDK} from '@chekin/host-sdk';

export default {
  mounted() {
    this.sdk = new ChekinHostSDK({apiKey: 'your-key'});
    this.sdk.render(this.$refs.container);
  },
  beforeUnmount() {
    this.sdk?.destroy();
  },
};
</script>
```

### Angular

```typescript
import {Component, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {ChekinHostSDK} from '@chekin/host-sdk';

@Component({
  template: '<div #container class="chekin-container"></div>',
})
export class ChekinComponent implements OnInit, OnDestroy {
  @ViewChild('container', {static: true}) container!: ElementRef;
  private sdk!: ChekinHostSDK;

  ngOnInit() {
    this.sdk = new ChekinHostSDK({apiKey: 'your-key'});
    this.sdk.render(this.container.nativeElement);
  }

  ngOnDestroy() {
    this.sdk?.destroy();
  }
}
```

## Development

### Building

```bash
# Build the package
npm run build

# Development mode with watching
npm run dev
```

### Testing

The core package includes comprehensive tests for all functionality. Use the sandbox.html file for manual testing during development.

## Security

- All iframe communication uses secure postMessage protocol
- Origin validation ensures communication only with trusted domains
- API keys are validated but never logged in plain text
- CSP-compliant iframe sandboxing prevents malicious code execution

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- No Internet Explorer support

## Related Packages

- **[@chekin/host-sdk-react](../react/README.md)** - React components and hooks built on this core package _(in development)_
