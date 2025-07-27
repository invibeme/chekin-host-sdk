# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Chekin Host SDK** repository - a migration project to transform the existing same-domain iframe SDK into an independently deployable NPM package with external iframe hosting.

### Current State
- Early-stage repository with only specification and license files
- No package.json or build system yet (to be created)
- Repository renamed from "hosts-sdk" to "host-sdk" following naming conventions

### Target Architecture
The project aims to create a **framework-agnostic SDK** following the react-calendly pattern:

**Separate SDK Monorepo Structure:**
```
chekin-host-sdk/
├── packages/
│   ├── core/                    # @chekin/sdk (vanilla JS, framework-agnostic)
│   └── react/                   # @chekin/sdk-react (React components)
├── examples/                    # Integration examples
└── docs/                       # API documentation
```

**Key Components to Build:**
1. **Core SDK** (`packages/core/`): Vanilla JavaScript ChekinSDK class with iframe management
2. **React Package** (`packages/react/`): InlineWidget, PopupWidget components
3. **Communication Layer**: postMessage handling between parent and iframe
4. **URL Management**: formatChekinUrl utility with versioning support

## Development Commands

**Initial Setup Required:**
- `npm init` - Initialize package.json files for monorepo packages
- `npm install` - Install dependencies (pnpm workspaces recommended)

**Build Commands (to be implemented):**
- `npm run build` - Build all packages
- `npm run build:core` - Build vanilla JS SDK
- `npm run build:react` - Build React components

**Development Commands (to be implemented):**
- `npm run dev` - Start development servers
- `npm run test` - Run test suites
- `npm run lint` - Lint all packages
- `npm run typecheck` - TypeScript type checking

## Key Technical Concepts

### Iframe Versioning Strategy
- **Always Latest by Default**: `https://sdk.chekin.com/latest/`
- **Optional Version Pinning**: `https://sdk.chekin.com/v1.6.2/`
- **Development Override**: Custom baseUrl for local testing

### Communication Architecture
- **postMessage API**: Parent-iframe communication
- **Event System**: height-changed, modal-open, toast-show, error events
- **Security**: Proper iframe sandboxing with allow-scripts, allow-same-origin, allow-forms

### Framework Support
- **Primary**: Vanilla JavaScript (framework-agnostic core)
- **Secondary**: React wrapper components
- **Future**: Vue, Angular, Svelte packages

## Implementation Phases

1. **Phase 1**: Communication layer and URL management utilities
2. **Phase 2**: Framework-agnostic core SDK with iframe management
3. **Phase 3**: React components (InlineWidget, PopupWidget, PopupButton)
4. **Phase 4**: Build configuration and deployment pipeline

## Code Patterns

### SDK Initialization
```javascript
const sdk = new ChekinSDK({
  apiKey: 'your-api-key',
  version: '1.6.2',  // Optional version pinning
  features: ['reservations', 'guests']
});

sdk.render('container-id').then(() => {
  console.log('SDK loaded');
});
```

### React Integration
```jsx
<InlineWidget
  apiKey="your-api-key"
  features={['reservations', 'guests']}
  onHeightChanged={(height) => console.log(height)}
/>
```

## Important Notes

- **No Package Manager Yet**: Repository needs initial npm/pnpm workspace setup
- **Specification-Driven**: Follow the detailed SPECIFICATION.md for architecture decisions
- **Security Focus**: Implement proper iframe sandboxing and CSP compliance
- **Backward Compatibility**: Maintain compatibility during migration from existing SDK
- **CDN Strategy**: Build for external hosting at sdk.chekin.com with version management

## Migration Context

This SDK replaces an existing same-domain iframe implementation. The new architecture provides:
- Independent deployment of SDK app and NPM package
- Enhanced security through proper iframe sandboxing
- Better caching and CDN benefits
- Framework-agnostic core with React wrapper components