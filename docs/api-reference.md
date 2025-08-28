# API Reference

## Core SDK (`@chekin/host-sdk`)

### ChekinHostSDK Class

The main SDK class for framework-agnostic integration.

```typescript
import { ChekinHostSDK } from '@chekin/host-sdk';

const sdk = new ChekinHostSDK(config);
```

#### Constructor

```typescript
constructor(config: ChekinSDKConfig & { logger?: ChekinLoggerConfig })
```

#### Methods

##### `render(container: string | HTMLElement): Promise<HTMLIFrameElement>`

Renders the SDK iframe into the specified container.

**Parameters:**
- `container` - DOM element ID (string) or HTMLElement reference

**Returns:** Promise that resolves with the iframe element when loaded

**Example:**
```typescript
await sdk.render('my-container');
// or
await sdk.render(document.getElementById('my-container'));
```

##### `destroy(): void`

Destroys the SDK instance and removes the iframe from the DOM.

```typescript
sdk.destroy();
```

##### `on(event: string, callback: ChekinEventCallback): void`

Adds an event listener for SDK events.

**Parameters:**
- `event` - Event name
- `callback` - Event handler function

**Example:**
```typescript
sdk.on('height-changed', (height) => {
  console.log('New height:', height);
});
```

##### `off(event: string, callback: ChekinEventCallback): void`

Removes an event listener.

##### `initialize(config: ChekinSDKConfig): void`

Initializes the SDK with a new configuration.

##### `updateConfig(newConfig: Partial<ChekinSDKConfig>): void`

Updates the SDK configuration and sends the update to the iframe.

##### `navigate(path: string): void`

Navigates to a specific path within the iframe application.

##### `enableRouteSync(options?: { hashPrefix?: string }): void`

Enables route synchronization between the parent window and iframe.

##### `disableRouteSync(): void`

Disables route synchronization.

##### `getCurrentRoute(): string`

Returns the current route path from the iframe.

##### `getLogger(): ChekinLogger`

Returns the logger instance for advanced logging operations.

##### `sendLogs(endpoint?: string): Promise<void>`

Sends collected logs to a remote endpoint.

##### `static validateConfig(config: ChekinSDKConfig): ValidationResult`

Static method to validate configuration without creating an instance.

##### `getValidationResult(): ValidationResult`

Returns the current validation result for the instance configuration.

### Configuration Interface

```typescript
interface ChekinSDKConfig {
  baseUrl?: string;              // Custom base URL (default: https://cdn.chekin.com/housings-sdk/)
  apiKey: string;                // Required API key
  version?: string;              // SDK version (default: 'latest')
  features?: string[];           // Enabled features
  housingId?: string;            // Housing ID
  externalHousingId?: string;    // External housing ID
  reservationId?: string;        // Reservation ID  
  defaultLanguage?: string;      // Default language (default: 'en')
  styles?: string;               // Custom CSS styles as string
  stylesLink?: string;           // External CSS stylesheet URL
  autoHeight?: boolean;          // Auto-adjust iframe height
  disableLogging?: boolean;      // Disable SDK logging (default: false)
  hiddenFormFields?: {           // Hide specific form fields
    housingInfo?: string[];
    housingPolice?: string[];
    housingStat?: string[];
    guestbookGeneration?: string[];
  };
  hiddenSections?: string[];     // Hide entire sections
  payServicesConfig?: {          // Payment services configuration
    currency?: string;
    liveness?: {
      price?: number;
    };
  };
  // Event callbacks
  onHeightChanged?: (height: number) => void;
  onError?: (error: { message: string; code?: string }) => void;
  onConnectionError?: (error: any) => void;
  onPoliceAccountConnection?: (data: any) => void;
  onStatAccountConnection?: (data: any) => void;
}
```

### Events

The SDK emits the following events:

#### `height-changed`
Fired when the iframe content height changes.
**Payload:** `number` - New height in pixels

#### `modal-open`
Fired when a modal is opened within the iframe.
**Payload:** `{ title?: string; content?: string }`

#### `toast-show`
Fired when a toast notification is shown.
**Payload:** `{ message: string; type: 'success' | 'error' | 'info' }`

#### `error`
Fired when an error occurs.
**Payload:** `{ message: string; code?: string }`

#### `handshake`
Fired when the SDK establishes communication with the iframe.
**Payload:** None

#### `connection-error`
Fired when there's a connection error.
**Payload:** `any`

#### `police-account-connection`
Fired when police account connection status changes.
**Payload:** `any`

#### `stat-account-connection`
Fired when statistics account connection status changes.
**Payload:** `any`

#### `config-update`
Fired when configuration is updated.
**Payload:** `Partial<ChekinSDKConfig>`

#### `navigate`
Fired when navigation occurs within the iframe.
**Payload:** `{ path: string }`

### Utility Functions

#### `formatChekinUrl(config: ChekinSDKConfig): UrlConfigResult`

Formats a configuration object into a URL with smart parameter handling.

```typescript
import { formatChekinUrl } from '@chekin/host-sdk';

const result = formatChekinUrl({
  apiKey: 'your-api-key',
  features: ['reservations'],
  housingId: 'housing-123'
});

// result.url - The formatted URL
// result.postMessageConfig - Config that will be sent via postMessage
// result.isLengthLimited - Whether URL length limits were reached
```

**Returns:**
```typescript
interface UrlConfigResult {
  url: string;
  postMessageConfig?: Partial<ChekinSDKConfig>;
  isLengthLimited: boolean;
}
```

## React Components (`@chekin/host-sdk-react`)

### InlineWidget

A React component that embeds the SDK directly into your application.

```typescript
import { InlineWidget } from '@chekin/host-sdk-react';

<InlineWidget
  apiKey="your-api-key"
  features={['reservations', 'guests']}
  onHeightChanged={(height) => console.log(height)}
  onError={(error) => console.error(error)}
/>
```

#### Props

Extends `ChekinSDKConfig` with additional React-specific props:

- `autoHeight?: boolean` - Auto-adjust iframe height (default: true)
- `onHeightChanged?: (height: number) => void` - Height change callback
- `onError?: (error: Error) => void` - Error callback
- `className?: string` - CSS class name
- `style?: React.CSSProperties` - Inline styles

### PopupWidget

A modal popup component that displays the SDK in an overlay.

```typescript
import { PopupWidget } from '@chekin/host-sdk-react';

<PopupWidget
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  apiKey="your-api-key"
/>
```

#### Props

Extends `InlineWidgetProps` (excluding `style` and `className`) with:

- `isOpen: boolean` - Whether the popup is open
- `onClose: () => void` - Close callback
- `rootElement?: HTMLElement` - Portal root element (default: document.body)
- `overlayClassName?: string` - Overlay CSS class
- `modalClassName?: string` - Modal CSS class

### PopupButton

A button component that opens the SDK in a popup when clicked.

```typescript
import { PopupButton } from '@chekin/host-sdk-react';

<PopupButton
  apiKey="your-api-key"
  onOpen={() => console.log('opened')}
  onClose={() => console.log('closed')}
>
  Open Chekin SDK
</PopupButton>
```

#### Props

Extends `PopupWidgetProps` (excluding `isOpen` and `onClose`) with:

- `children: React.ReactNode` - Button content
- `buttonClassName?: string` - Button CSS class
- `buttonStyle?: React.CSSProperties` - Button inline styles
- `onOpen?: () => void` - Open callback
- `onClose?: () => void` - Close callback

### Hooks

#### `useChekinModal(initialState?: boolean)`

Hook for managing modal state.

```typescript
import { useChekinModal } from '@chekin/host-sdk-react';

const { isOpen, open, close, toggle } = useChekinModal();
```

**Returns:**
- `isOpen: boolean` - Current modal state
- `open: () => void` - Open modal function
- `close: () => void` - Close modal function  
- `toggle: () => void` - Toggle modal function

#### `useChekinToast()`

Hook for managing toast notifications.

```typescript
import { useChekinToast } from '@chekin/host-sdk-react';

const { toasts, showToast, removeToast, clearToasts } = useChekinToast();
```

**Returns:**
- `toasts: ToastMessage[]` - Current toast messages
- `showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void`
- `removeToast: (id: string) => void` - Remove specific toast
- `clearToasts: () => void` - Remove all toasts

#### `useChekinEventListener(sdk, eventType, callback)`

Hook for listening to SDK events with automatic cleanup.

```typescript
import { useChekinEventListener } from '@chekin/host-sdk-react';

useChekinEventListener(sdk, 'height-changed', (height) => {
  console.log('Height changed:', height);
});
```

## TypeScript Support

All packages include full TypeScript definitions. Import types as needed:

```typescript
import type {
  ChekinSDKConfig,
  ChekinMessage,
  ChekinEventType,
  ChekinEventCallback,
  UrlConfigResult
} from '@chekin/host-sdk';

import type {
  InlineWidgetProps,
  PopupWidgetProps,
  PopupButtonProps
} from '@chekin/host-sdk-react';
```