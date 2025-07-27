# API Reference

## Core SDK (`@chekin/sdk`)

### ChekinSDK Class

The main SDK class for framework-agnostic integration.

```typescript
import { ChekinSDK } from '@chekin/sdk';

const sdk = new ChekinSDK(config);
```

#### Constructor

```typescript
constructor(config: ChekinUrlConfig)
```

#### Methods

##### `render(container: string | HTMLElement): Promise<void>`

Renders the SDK iframe into the specified container.

**Parameters:**
- `container` - DOM element ID (string) or HTMLElement reference

**Returns:** Promise that resolves when the iframe is loaded

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

##### `updateConfig(newConfig: Partial<ChekinUrlConfig>): void`

Updates the SDK configuration and sends the update to the iframe.

##### `navigate(path: string): void`

Navigates to a specific path within the iframe application.

### Configuration Interface

```typescript
interface ChekinUrlConfig {
  baseUrl?: string;              // Custom base URL (default: https://sdk.chekin.com)
  apiKey: string;                // Required API key
  version?: string;              // SDK version (default: 'latest')
  features?: string[];           // Enabled features
  housingId?: string;            // Housing ID
  reservationId?: string;        // Reservation ID  
  defaultLanguage?: string;      // Default language (default: 'en')
  customStyles?: Record<string, string>;  // Custom CSS styles
  stylesLink?: string;           // External CSS stylesheet URL
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

#### `ready`
Fired when the iframe application is ready.
**Payload:** `{ timestamp: number; url: string }`

### Utility Functions

#### `formatChekinUrl(config: ChekinUrlConfig): string`

Formats a configuration object into a complete URL for the iframe.

```typescript
import { formatChekinUrl } from '@chekin/sdk';

const url = formatChekinUrl({
  apiKey: 'your-api-key',
  features: ['reservations'],
  housingId: 'housing-123'
});
```

## React Components (`@chekin/sdk-react`)

### InlineWidget

A React component that embeds the SDK directly into your application.

```typescript
import { InlineWidget } from '@chekin/sdk-react';

<InlineWidget
  apiKey="your-api-key"
  features={['reservations', 'guests']}
  onHeightChanged={(height) => console.log(height)}
  onError={(error) => console.error(error)}
/>
```

#### Props

Extends `ChekinUrlConfig` with additional React-specific props:

- `autoHeight?: boolean` - Auto-adjust iframe height (default: true)
- `onHeightChanged?: (height: number) => void` - Height change callback
- `onError?: (error: Error) => void` - Error callback
- `className?: string` - CSS class name
- `style?: React.CSSProperties` - Inline styles

### PopupWidget

A modal popup component that displays the SDK in an overlay.

```typescript
import { PopupWidget } from '@chekin/sdk-react';

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
import { PopupButton } from '@chekin/sdk-react';

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
import { useChekinModal } from '@chekin/sdk-react';

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
import { useChekinToast } from '@chekin/sdk-react';

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
import { useChekinEventListener } from '@chekin/sdk-react';

useChekinEventListener(sdk, 'height-changed', (height) => {
  console.log('Height changed:', height);
});
```

## TypeScript Support

All packages include full TypeScript definitions. Import types as needed:

```typescript
import type {
  ChekinUrlConfig,
  ChekinMessage,
  ChekinEventType,
  ChekinEventCallback
} from '@chekin/sdk';

import type {
  InlineWidgetProps,
  PopupWidgetProps,
  PopupButtonProps
} from '@chekin/sdk-react';
```