import { ChekinSDK, ChekinLogger } from '@chekin/sdk';

// Example showing the new "[Host SDK]" prefix in logs

// 1. Default SDK logging (with [Host SDK] prefix)
const sdk = new ChekinSDK({
  apiKey: 'demo-api-key',
  features: ['reservations', 'guests']
});

// This will log:
// [Host SDK] 2025-01-27T... INFO ChekinSDK instance created {...}

// 2. Custom prefix
const customSDK = new ChekinSDK({
  apiKey: 'demo-api-key',
  logger: {
    prefix: '[My Chekin App]' // Override default prefix
  }
});

// This will log:
// [My Chekin App] 2025-01-27T... INFO ChekinSDK instance created {...}

// 3. Standalone logger with different prefix
const appLogger = new ChekinLogger({
  prefix: '[App Core]',
  level: 'debug'
});

appLogger.info('Application started');
// Logs: [App Core] 2025-01-27T... INFO APPLICATION Application started

appLogger.debug('Debug information', { userId: 123 });
// Logs: [App Core] 2025-01-27T... DEBUG APPLICATION Debug information {userId: 123}

// 4. Context-aware logging with prefix
const sdkLogger = sdk.getLogger();
sdkLogger.info('Custom application message', { feature: 'checkout' }, 'CHECKOUT');
// Logs: [Host SDK] 2025-01-27T... INFO [CHECKOUT] Custom application message {feature: 'checkout'}

// The log format is:
// {prefix} {timestamp} {level} [{context}] {message} {data}
// 
// Examples:
// [Host SDK] 2025-01-27T19:30:45.123Z INFO [LIFECYCLE] SDK mounted to container: app-container
// [Host SDK] 2025-01-27T19:30:45.456Z WARN [VALIDATION] Validation warning in features[1]: Unknown feature "invalid-feature"
// [Host SDK] 2025-01-27T19:30:45.789Z DEBUG [COMMUNICATION] Communication event: height-changed {height: 450}
// [Host SDK] 2025-01-27T19:30:46.012Z ERROR [IFRAME] Iframe failed to load {error: "Network error"}

console.log(`
Log Format: {prefix} {timestamp} {level} [{context}] {message} {data}

Examples of logs you'll see:
✅ [Host SDK] 2025-01-27T19:30:45.123Z INFO [LIFECYCLE] SDK mounted to container: app-container
⚠️  [Host SDK] 2025-01-27T19:30:45.456Z WARN [VALIDATION] Unknown feature "invalid-feature"
🐛 [Host SDK] 2025-01-27T19:30:45.789Z DEBUG [COMMUNICATION] Communication event: height-changed
❌ [Host SDK] 2025-01-27T19:30:46.012Z ERROR [IFRAME] Iframe failed to load

Benefits of the prefix:
- Easy to filter logs in production
- Clear SDK identification
- Consistent branding
- Debug-friendly format
`);