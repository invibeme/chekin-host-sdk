# Main idea and review details:

Moving from the current approach where the SDK app is embedded in the same domain iframe (no src URL) to a separately deployed SDK with an npm package that manages an iframe loaded by src URL.

**Current**: SDK renders React app directly into the parent DOM using same-domain iframe (no src)
**Proposed**: NPM package manages externally-hosted iframe with src URL + parameter passing

**Key Benefits of This Approach**

1. **Better Separation of Concerns**
- SDK logic (initialization, modals, toasts) lives in parent domain
- Core app logic runs in isolated iframe with separate deployment
- Clear boundaries between integration layer and application layer
1. **Independent Deployment**
- SDK app can be deployed/updated without affecting the NPM package
- CDN benefits for the iframe content
- Better caching strategies
1. **Enhanced Security**
- Proper iframe sandboxing capabilities
- CSP compliance for parent applications
- Reduced attack surface
1. **Improved Developer Experience**
- NPM package provides clean React-like API
- Type-safe integration similar to react-calendly
- Better error handling and debugging

Recommended Implementation Structure

Based on react-calendly pattern:

**// NPM Package Structure**
ChekinSDK/
├── src/
│   ├── components/
│   │   ├── InlineWidget.tsx      // Direct embedding
│   │   ├── PopupWidget.tsx       // Modal integration

│   │   └── PopupButton.tsx       // Trigger component
│   ├── hooks/
│   │   └── useChekinEventListener.ts
│   ├── utils/
│   │   ├── formatChekinUrl.ts    // URL builder with params
│   │   └── communication.ts      // postMessage handling
│   └── index.ts                  // Main exports

### Short Migration Strategy

**Phase 1: Extract Communication Layer**

- Build URL formatting utilities (similar to formatCalendlyUrl)
- Implement postMessage communication for modals/toasts
- Create iframe management components

**Phase 2: NPM Package Development**

- Create React components with initialization/render methods
- Implement event listener hooks for parent-iframe communication
- Add TypeScript definitions

**Phase 3: Separate Deployment**

- Configure hosts-sdk for external hosting
- Update build process for CDN deployment
- Implement parameter passing via URL/postMessage

**Code Architecture Recommendations**

The current ChekinHousingsSDK class provides a good foundation - the initialize() and renderApp() methods can be adapted for the new pattern:

Current: sdk.initialize(config); sdk.renderApp({targetNode})
Proposed: <ChekinInlineWidget url="..." config={...} />

This approach will significantly improve maintainability, security, and developer experience while following established patterns from successful libraries like react-calendly.

# Chekin Hosts SDK Migration Specification

---

### 📋 Overview

**Current State**

- SDK renders React app directly into parent DOM using same-domain iframe (no src attribute)
- Monolithic architecture with tight coupling between SDK logic and application code
- Limited deployment flexibility and security constraints

**Target State**

- Separate monorepo for NPM packages with framework-agnostic core SDK
- NPM package manages externally-hosted iframe with src URL
- Iframe app always loads latest version with optional version pinning (like Stripe)
- Clear separation between SDK integration layer and core application
- Independent deployment pipeline for SDK app and NPM package
- Enhanced security through proper iframe sandboxing

**Success Metrics**

- SDK can be deployed independently from NPM package
- Reduced bundle size for client integrations
- Improved security posture with iframe sandboxing
- Maintained feature parity with current implementation
- Zero breaking changes for existing integrations

---

### 🎯 Goals & Objectives

**Primary Goals**

1. Architectural Separation - Decouple SDK integration logic from core application
2. Independent Deployment - Enable separate deployment cycles for SDK app and NPM package
3. Enhanced Security - Implement proper iframe sandboxing and CSP compliance
4. Developer Experience - Provide clean, type-safe React-like API similar to react-calendly

**Secondary Goals**

1. Performance Optimization - Reduce initial bundle size through external hosting
2. Better Caching - Leverage CDN benefits for iframe content
3. Maintainability - Clear boundaries between integration and application layers

---

### 🏗️ Architecture Design

High-Level Architecture

![image.png](attachment:ba1a3670-4f45-4503-bddb-d44ff9e8b43e:7a09ba01-f701-4b38-8d57-9cd540b67c33.png)

---

### 📝 Naming Convention Update

**Migration from "hosts-sdk" to "host-sdk"**

Following industry standards and semantic clarity, we're adopting singular naming:

**Before:**
- Repository: `chekin-hosts-sdk`
- Package: `@chekin/hosts-sdk`
- Directory: `apps/hosts-sdk/`

**After:**
- Repository: `chekin-host-sdk`
- Package: `@chekin/host-sdk`
- Directory: `apps/host-sdk/`

**Reasoning:**
- **Industry Standard**: Most SDKs use singular naming (stripe-js, react-calendly, intercom-javascript)
- **Semantic Clarity**: "Host SDK" = SDK for host management (clearer purpose)
- **Better Grammar**: "Host" as a feature/domain name vs "Hosts" as plural
- **Consistency**: Aligns with established patterns in the JavaScript ecosystem

### Repository Structure

**Separate SDK Monorepo: `chekin-host-sdk`**
```
chekin-host-sdk/
├── packages/
│   ├── core/                        # @chekin/sdk (framework-agnostic)
│   │   ├── src/
│   │   │   ├── ChekinSDK.ts        # Main vanilla JS class
│   │   │   ├── communication/       # postMessage handling
│   │   │   ├── utils/              # formatChekinUrl, validation
│   │   │   └── types/              # TypeScript definitions
│   │   └── package.json
│   │
│   └── react/                       # @chekin/sdk-react (future)
│       ├── src/
│       │   ├── components/         # InlineWidget, PopupWidget
│       │   ├── hooks/              # useChekinEventListener, etc.
│       │   └── index.ts
│       └── package.json
│
├── examples/
│   ├── vanilla-js/                 # Pure JS integration example
│   ├── react/                      # React integration example
│   └── typescript/                 # TypeScript integration example
│
├── docs/
│   ├── api-reference.md
│   ├── integration-guide.md
│   └── migration.md
│
└── README.md
```

**Current Monorepo: `dashboard-chekin`**
```
apps/host-sdk/                      # Iframe application (to be renamed)
├── src/
│   ├── App.tsx                     # Main application
│   ├── main.ts                     # Entry point  
│   ├── communication/              # NEW: Parent communication
│   │   ├── MessageHandler.ts       # Handle parent messages
│   │   └── EventEmitter.ts         # Emit events to parent
│   ├── components/                 # Existing components
│   └── views/                      # Existing views
```

**Iframe Application Structure**

apps/hosts-sdk/
├── src/
│   ├── App.tsx                      # Main application
│   ├── main.ts                      # Entry point
│   ├── communication/
│    │   ├── MessageHandler.ts        # Handle parent messages
│    │   └── EventEmitter.ts          # Emit events to parent
│   ├── components/                  # Existing components
│   ├── views/                       # Existing views
│   └── utils/
│     └── parentCommunication.ts   # Parent-iframe utilities

---

### 🔧 Technical Implementation

**Phase 1: Communication Layer**

**1.1 Iframe Versioning Strategy (Stripe-like Approach)**

**Always Latest by Default with Optional Pinning**
```typescript
// utils/formatChekinUrl.ts
interface ChekinUrlConfig {
  baseUrl?: string;
  apiKey: string;
  version?: string;              // NEW: Optional version pinning
  features?: string[];
  housingId?: string;
  reservationId?: string;
  defaultLanguage?: string;
  styles?: Record<string, string>;
  stylesLink?: string;           // NEW: External CSS
}

export function formatChekinUrl(config: ChekinUrlConfig): string {
  const version = config.version || 'latest';
  const baseUrl = config.baseUrl || `https://sdk.chekin.com/${version}/`;

  const url = new URL(baseUrl);
  url.searchParams.set("apiKey", config.apiKey);

  if (config.features?.length) {
    url.searchParams.set("features", config.features.join(","));
  }

  if (config.stylesLink) {
    url.searchParams.set("stylesLink", encodeURIComponent(config.stylesLink));
  }

  // Add other parameters...
  return url.toString();
}
```

**CDN Structure**
```
https://sdk.chekin.com/
├── latest/           # Always points to newest version
│   ├── index.html
│   └── assets/
├── v1.6.2/          # Specific version
│   ├── index.html
│   └── assets/
├── v1.6.1/          # Previous version
└── v1.5.0/          # Legacy version
```

**Usage Examples**
```typescript
// Always latest (recommended)
const latestSdk = new ChekinSDK({
  apiKey: "pk_test_...",
  // version not specified = latest
});

// Pinned version (for stability)
const pinnedSdk = new ChekinSDK({
  apiKey: "pk_test_...",
  version: "1.6.2"     // Pin to specific iframe version
});

// Development mode
const devSdk = new ChekinSDK({
  apiKey: "pk_test_...",
  baseUrl: "http://localhost:5173/"  // Override entire URL
});
```

**SDK vs Iframe Versioning**
- **SDK Package Version**: `@chekin/sdk@2.1.0` (independent semantic versioning)
- **Iframe App Version**: `v1.6.2` (deployed to CDN paths)
- **Compatibility**: SDK includes compatibility matrix for supported iframe versions

**1.2 postMessage Communication**

```tsx
// utils/communication.ts
export interface ChekinMessage {
  type: 'height-changed' | 'modal-open' | 'toast-show' | 'error';
  payload: any;
}

export class ChekinCommunicator {
  private iframe: HTMLIFrameElement;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  private handleMessage(event: MessageEvent<ChekinMessage>) {
    if (event.source !== this.iframe.contentWindow) return;

    const listeners = this.eventListeners.get(event.data.type) || [];
    listeners.forEach(listener => listener(event.data.payload));
  }

  public on(type: string, callback: Function) {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    this.eventListeners.get(type)!.push(callback);
  }

  public send(message: ChekinMessage) {
    this.iframe.contentWindow?.postMessage(message, 'https://cdn.chekin.com');
  }
}
```

**Phase 2: Framework-Agnostic Core SDK**

**2.1 Vanilla JavaScript Implementation (Primary Focus)**

```typescript
// packages/core/src/ChekinSDK.ts
export class ChekinSDK {
  private iframe: HTMLIFrameElement | null = null;
  private communicator: ChekinCommunicator | null = null;
  private config: ChekinUrlConfig;

  constructor(config: ChekinUrlConfig) {
    this.config = config;
  }

  // Framework-agnostic render method
  public render(container: string | HTMLElement): Promise<void> {
    const targetElement = typeof container === 'string'
      ? document.getElementById(container)
      : container;

    if (!targetElement) {
      throw new Error(`Container not found: ${container}`);
    }

    return this.createIframe(targetElement);
  }

  private createIframe(container: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
      this.iframe = document.createElement('iframe');
      this.iframe.src = formatChekinUrl(this.config);
      this.iframe.style.cssText = 'width: 100%; border: none;';
      this.iframe.sandbox.add('allow-scripts', 'allow-same-origin', 'allow-forms');

      this.iframe.onload = () => {
        this.communicator = new ChekinCommunicator(this.iframe!, this.config);
        resolve();
      };

      this.iframe.onerror = reject;
      container.appendChild(this.iframe);
    });
  }

  public destroy(): void {
    if (this.iframe?.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
    this.communicator?.destroy();
    this.iframe = null;
    this.communicator = null;
  }

  // Event handling
  public on(event: string, callback: Function): void {
    this.communicator?.on(event, callback);
  }

  public off(event: string, callback: Function): void {
    this.communicator?.off(event, callback);
  }
}
```

**Usage Examples - Framework Agnostic**

```javascript
// Vanilla JavaScript
import { ChekinSDK } from '@chekin/sdk';

const sdk = new ChekinSDK({
  apiKey: 'your-api-key',
  features: ['reservations', 'guests']
});

// Render into DOM element
sdk.render('chekin-container').then(() => {
  console.log('SDK loaded successfully');
});

// Event handling
sdk.on('height-changed', (height) => {
  console.log('New height:', height);
});

// Cleanup
sdk.destroy();
```

```html
<!-- HTML Integration -->
<div id="chekin-widget"></div>
<script type="module">
  import { ChekinSDK } from 'https://unpkg.com/@chekin/sdk';

  const sdk = new ChekinSDK({
    apiKey: 'your-api-key'
  });

  sdk.render('chekin-widget');
</script>
```

**Phase 3: React Components (Future Implementation)**

**2.1 InlineWidget Component**

```tsx
// components/InlineWidget.tsx
import React, { useRef, useEffect, useState } from "react";
import { ChekinCommunicator } from "../utils/communication";
import { formatChekinUrl } from "../utils/formatChekinUrl";

interface InlineWidgetProps {
  apiKey: string;
  baseUrl?: string;
  features?: string[];
  housingId?: string;
  reservationId?: string;
  defaultLanguage?: string;
  styles?: Record<string, string>;
  autoHeight?: boolean;
  onHeightChanged?: (height: number) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const InlineWidget: React.FC<InlineWidgetProps> = ({
                                                            apiKey,
                                                            baseUrl = "[https://sdk.chekin.com](https://sdk.chekin.com/)",
                                                            autoHeight = true,
                                                            onHeightChanged,
                                                            onError,
                                                            className = "chekin-inline-widget",
                                                            style,
                                                            ...config
                                                          }) => {
  const iframeRef = useRef < HTMLIFrameElement > null;
  const [isLoading, setIsLoading] = useState(true);
  const [communicator, setCommunicator] =
  (useState < ChekinCommunicator) | (null > null);

  const iframeSrc = formatChekinUrl({ apiKey, baseUrl, ...config });

  useEffect(() => {
    if (iframeRef.current && !communicator) {
      const comm = new ChekinCommunicator(iframeRef.current);

      comm.on("height-changed", (height: number) => {
        if (autoHeight && iframeRef.current) {
          iframeRef.current.style.height = `${height}px`;
        }
        onHeightChanged?.(height);
      });

      comm.on("error", (error: any) => {
        onError?.(new Error(error.message));
      });

      setCommunicator(comm);
    }
  }, [autoHeight, onHeightChanged, onError, communicator]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={className} style={style}>
      {isLoading && <div className="chekin-loading">Loading Chekin SDK...</div>}
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        style={{
          width: "100%",
          height: autoHeight ? "600px" : "100%",
          border: "none",
          display: isLoading ? "none" : "block",
        }}
        onLoad={handleLoad}
        title="Chekin Hosts SDK"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
      />
    </div>
  );
};
```

**2.2 PopupWidget Component**

```tsx
// components/PopupWidget.tsx
import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface PopupWidgetProps
  extends Omit<InlineWidgetProps, "style" | "className"> {
  isOpen: boolean;
  onClose: () => void;
  rootElement?: HTMLElement;
}

export const PopupWidget: React.FC<PopupWidgetProps> = ({
                                                          isOpen,
                                                          onClose,
                                                          rootElement = document.body,
                                                          ...inlineProps
                                                        }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="chekin-modal-overlay" onClick={onClose}>
      <div
        className="chekin-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="chekin-modal-close" onClick={onClose}>
          ×
        </button>
        <InlineWidget
          {...inlineProps}
          style={{ height: "80vh", width: "90vw", maxWidth: "800px" }}
        />
      </div>
    </div>
  );

  return createPortal(modalContent, rootElement);
};
```

**Phase 3: Iframe Application Updates**

**3.1 Message Handler in Iframe**

```tsx
// apps/hosts-sdk/src/communication/MessageHandler.ts
export class MessageHandler {
  private parentOrigin: string;
  constructor() {
    this.parentOrigin = document.referrer ? new URL(document.referrer).origin : '*';
    window.addEventListener('message', this.handleParentMessage.bind(this));
  }

  private handleParentMessage(event: MessageEvent) {
    // Handle messages from parent
    switch (event.data.type) {
      case 'config-update':
        this.updateConfig(event.data.payload);
        break;
      case 'navigate':
        this.navigate(event.data.payload.path);
        break;
    }
  }

  public sendToParent(type: string, payload: any) {
    window.parent.postMessage({ type, payload }, this.parentOrigin);
  }

  private updateConfig(config: any) {
    // Update SDK configuration
  }

  private navigate(path: string) {
    // Handle navigation
  }
}
```

**3.2 Height Observer for Auto-sizing**

```tsx
// apps/hosts-sdk/src/communication/HeightObserver.ts
export class HeightObserver {
  private messageHandler: MessageHandler;
  private observer: ResizeObserver;

  constructor(messageHandler: MessageHandler) {
    this.messageHandler = messageHandler;
    this.observer = new ResizeObserver(this.handleResize.bind(this));
    this.observer.observe(document.body);
  }

  private handleResize(entries: ResizeObserverEntry[]) {
    const height = entries[0].contentRect.height;
    this.messageHandler.sendToParent('height-changed', height);
  }

  public disconnect() {
    this.observer.disconnect();
  }
}
```

**Phase 4: Build & Deployment**

**4.1 Build Tool Selection**

**Primary Choice: tsup + Nx**

After analyzing industry patterns from companies like TipTap (migrated to tsup), Radix UI (transitioning to tsup), and monorepo tools used by major tech companies, we've selected:

- **tsup**: Zero-config TypeScript library bundler for NPM packages
- **Nx**: Monorepo management and build orchestration

**Why tsup for Library Building:**
- Zero configuration out of the box
- TypeScript-first with automatic type generation
- Dual format output (ESM + CommonJS)
- Fast builds powered by esbuild
- Perfect for framework-agnostic SDKs
- Used by modern libraries like TipTap v3

**Why Nx for Monorepo Management:**
- Superior TypeScript project references
- Automatic dependency graph detection
- Built-in caching for CI/CD
- Excellent npm package publishing support
- Used by enterprise companies (Capital One, Walmart, Shopify)

**4.2 NPM Package Build Configuration**

```typescript
// packages/core/tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],           // Dual format: CommonJS + ES modules
  dts: true,                        // Generate TypeScript declarations
  splitting: false,                 // Keep bundle simple for SDK
  sourcemap: true,
  clean: true,
  external: [],                     // No externals for framework-agnostic core
  minify: true,
  target: 'es2018'                  // Browser compatibility
})
```

```typescript
// packages/react/tsup.config.ts  
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'], // React as peer dependency
  minify: true,
  target: 'es2018'
})
```

**4.3 Nx Monorepo Configuration**

```json
// nx.json
{
  "extends": "nx/presets/npm.json",
  "targetDefaults": {
    "build": {
      "executor": "@nx/js:tsup",
      "cache": true,
      "dependsOn": ["^build"]
    },
    "publish": {
      "dependsOn": ["build"],
      "cache": true
    },
    "test": {
      "cache": true
    }
  }
}
```

```json
// packages/core/project.json
{
  "name": "core",
  "targets": {
    "build": {
      "executor": "@nx/js:tsup",
      "outputs": ["{projectRoot}/dist"],
      "options": {
        "config": "{projectRoot}/tsup.config.ts"
      }
    },
    "publish": {
      "executor": "nx:run-commands",
      "options": {
        "command": "npm publish",
        "cwd": "{projectRoot}"
      }
    }
  }
}
```

**4.4 Package.json Structure**

```json
// packages/core/package.json
{
  "name": "@chekin/sdk",
  "version": "1.0.0",
  "description": "Framework-agnostic Chekin SDK",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs", 
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "prepublishOnly": "nx build core"
  }
}
```

```json
// packages/react/package.json
{
  "name": "@chekin/sdk-react", 
  "version": "1.0.0",
  "description": "React components for Chekin SDK",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts", 
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
  "dependencies": {
    "@chekin/sdk": "workspace:^"
  }
}
```

**4.2 SDK App Build for CDN**

```tsx
// apps/hosts-sdk/vite.config.ts (updated)
export default defineConfig(({ mode }) => {
  const isCDNBuild = mode === "production";

  return {
    // ... existing config
    build: {
      // Remove lib configuration for CDN build
      outDir: "dist",
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
        },
      },
    },
    base: isCDNBuild ? "<https://cdn.chekin.com/hosts-sdk/>" : "/",
  };
});
```

---

**📊 Migration Strategy**

Timeline: 8 Weeks

| Phase | Duration | Key Deliverables |
| --- | --- | --- |
| Phase 1 |  | Communication layer, URL management |
| Phase 2 |  | React components, NPM package structure |
| Phase 3 |  | Iframe app updates, message handling |
| Phase 4 |  | Build configuration, deployment pipeline |

### Risk Migration

**High Risk Areas**

1. Breaking Changes - Existing integrations may break
- Mitigation: Maintain backward compatibility during transition
- Rollback Plan: Feature flags for old vs new architecture
2. Cross-Origin Communication - postMessage reliability
- Mitigation: Comprehensive testing across browsers
- Fallback: Polling mechanism for critical communications
3. Performance Regression - Additional network requests
- Mitigation: Aggressive caching, CDN optimization
- Monitoring: Performance metrics dashboard

**Medium Risk Areas**

1. CSP Compatibility - Client CSP policies may block iframe
- Mitigation: Clear documentation, CSP helper utilities
2. Mobile Experience - Iframe behavior on mobile devices
- Mitigation: Responsive design, mobile-specific testing

---

### Browser Support Matrix

| Browser | Version | Status |
| --- | --- | --- |
| Chrome | 90+ | ✅ Supported |
| Firefox | 88+ | ✅ Supported |
| Safari | 14+ | ✅ Supported |
| Edge | 90+ | ✅ Supported |
| IE | 11 | ❌ Not Supported |

---

### 📝 API Documentation

**NPM Package Exports**

```tsx
// Main exports
export { InlineWidget } from './components/InlineWidget';
export { PopupWidget } from './components/PopupWidget';
export { PopupButton } from './components/PopupButton';
// Hooks
export { useChekinEventListener } from './hooks/useChekinEventListener';
export { useChekinModal } from './hooks/useChekinModal';
export { useChekinToast } from './hooks/useChekinToast';

// Types
export type {
  ChekinConfig,
  ChekinEventType,
  InlineWidgetProps,
  PopupWidgetProps
} from './types';

// Utils
export { formatChekinUrl } from './utils/formatChekinUrl';

Usage Examples

// Basic inline widget
import { InlineWidget } from '@chekin/hosts-sdk';

function MyComponent() {
  return (
    <InlineWidget
      apiKey="your-api-key"
      features={['reservations', 'guests']}
      onError={(error) => console.error(error)}
    />
  );
}

// Popup integration
import { PopupWidget, useChekinModal } from '@chekin/hosts-sdk';

function MyPopupComponent() {
  const { isOpen, open, close } = useChekinModal();
  return (
    <>
      <button onClick={open}>Open Chekin SDK</button>
      <PopupWidget
        isOpen={isOpen}
        onClose={close}
        apiKey="your-api-key"
      />
    </>
  );
}
```

---

### 🚀 Deployment Plan

**Infrastructure Requirements**

1. CDN Setup - Configure CDN for SDK app hosting
2. Domain Configuration - Setup [sdk.chekin.com](http://sdk.chekin.com/) subdomain
3. SSL Certificates - Ensure HTTPS for iframe content
4. CI/CD Pipeline - Separate pipelines for NPM package and SDK app

**Release Strategy**

1. Alpha Release - Internal testing with development team
2. Beta Release - Limited external partners
3. Staged Rollout - Gradual migration of existing integrations
4. Full Release - Complete migration with deprecation notices

**Monitoring & Observability**

- Performance metrics (load times, error rates)
- Usage analytics (component adoption, feature usage)
- Error tracking (client-side errors, communication failures)
- Health checks (iframe availability, API responsiveness)

---

### ✅ Success Criteria

Technical Metrics

- 0% increase in integration complexity for developers
- < 500ms additional load time for iframe content
- 99.9% uptime for CDN-hosted SDK app
- 100% backward compatibility during transition period

**Business Metrics**

- Maintained feature parity with current implementation
- Improved developer satisfaction scores
- Reduced support tickets related to integration issues
- Faster deployment cycles for SDK updates

---

### **Exemplary** and inspired by project:

https://github.com/tcampb/react-calendly