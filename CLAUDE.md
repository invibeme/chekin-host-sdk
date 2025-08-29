# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Chekin Host SDK** repository - a framework-agnostic monorepo for integrating Chekin's host management platform into web applications through secure iframe embedding.

### Architecture

The project is a **Nx-based monorepo** with the following structure:

```
chekin-host-sdk/
├── packages/
│   ├── core/                    # chekin-host-sdk (vanilla JS/TS, framework-agnostic)
│   │   ├── src/
│   │   │   ├── ChekinHostSDK.ts        # Main SDK class
│   │   │   ├── communication/          # postMessage handling
│   │   │   ├── utils/                  # Utilities (URL formatting, logging, validation)
│   │   │   └── types/                  # TypeScript definitions
│   │   └── sandbox.html               # Development sandbox
│   └── react/                   # chekin-host-sdk-react (React components)
│       ├── src/components/             # ChekinHostSDKView
│       └── src/hooks/                  # useHostSDKEventListener
├── docs/                        # API documentation
├── dist/                        # Build outputs
└── nx.json                     # Nx workspace configuration
```

### Key Implemented Features

- **ChekinHostSDK**: Main vanilla JS/TS class with iframe management, validation, logging
- **Communication Layer**: postMessage-based parent-iframe communication with event handling
- **URL Management**: Smart URL formatting with length limits and postMessage fallback
- **React Components**: ChekinHostSDKView with ref support and event handling hooks
- **Security**: Proper iframe sandboxing with CSP compliance
- **Logging & Validation**: Comprehensive error handling and configuration validation

## Development Commands

**Setup:**

- `npm install` - Install dependencies
- `nx reset` - Reset Nx cache

**Build Commands:**

- `npm run build` - Build all packages (uses Nx)
- `npm run build:core` - Build core SDK only
- `npm run build:react` - Build React package only
- `npm run build:host-sdk` - Build host SDK app

**Development:**

- `npm run dev` - Start all development servers in parallel
- `nx dev core` - Start core package development
- `nx dev react` - Start React package development

**Quality Assurance:**

- `npm run test` - Run all tests
- `npm run lint` - Lint all packages
- `npm run typecheck` - TypeScript type checking across all packages

## Core SDK Architecture

### ChekinHostSDK Class (`packages/core/src/ChekinHostSDK.ts`)

Main SDK class providing:

- **Iframe Management**: Creation, sandboxing, lifecycle management
- **Configuration Validation**: Runtime validation with detailed error reporting
- **Event System**: postMessage-based communication with type-safe event handling
- **Route Synchronization**: URL sync between parent and iframe
- **Logging**: Comprehensive logging system with remote log shipping

### Communication Layer (`packages/core/src/communication/`)

- **ChekinCommunicator**: Handles postMessage protocol between parent and iframe
- **Event Types**: Defined in constants (HEIGHT_CHANGED, ERROR, CONFIG_UPDATE, etc.)
- **Security**: Origin validation and message sanitization

### URL Management (`packages/core/src/utils/formatChekinUrl.ts`)

- **Smart URL Building**: Handles query parameter limits (2048 chars)
- **PostMessage Fallback**: Large configs sent via postMessage after iframe load
- **Version Support**: Optional version pinning or latest deployment

## React Components

### Core Components (`packages/react/src/components/`)

- **ChekinHostSDKView**: Main React component with ref support for direct SDK access

### Hooks (`packages/react/src/hooks/`)

- **useHostSDKEventListener**: Event listener hook with automatic cleanup and type safety

## SDK Usage Patterns

### Basic Initialization

```typescript
import {ChekinHostSDK} from 'chekin-host-sdk';

const sdk = new ChekinHostSDK({
  apiKey: 'your-api-key',
  features: ['reservations', 'guests'],
  autoHeight: true,
  onHeightChanged: height => console.log(`Height: ${height}px`),
});

await sdk.render('container-element');
```

### React Integration

```jsx
import {ChekinHostSDKView} from 'chekin-host-sdk-react';

<ChekinHostSDKView
  apiKey="your-api-key"
  features={['reservations']}
  onHeightChanged={height => console.log(height)}
/>;
```

## Testing & Development

### Sandbox Environment

- `packages/core/sandbox.html` - Development sandbox for testing core SDK
- Accessible via local development server for rapid testing

### Build System

- **Nx**: Monorepo orchestration with caching and parallel builds
- **TSUP**: Fast TypeScript bundling for packages
- **ESLint**: Consistent code style across packages

## Security Considerations

### Iframe Sandboxing

```html
<iframe
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>
```

### CSP Requirements

```
frame-src https://sdk.chekin.com;
connect-src https://api.chekin.com;
```

### API Key Management

- Validate keys before iframe creation
- Never log actual API keys (use redacted placeholders)
- Support both test and production key formats
