import { ChekinSDK, ChekinSDKValidator, type ValidationResult } from '@chekin/sdk';

// Example 1: Basic SDK usage with logging enabled (default)
const sdk1 = new ChekinSDK({
  apiKey: 'your-api-key-here',
  features: ['reservations', 'guests'],
  defaultLanguage: 'en',
  autoHeight: true,
  // disableLogging: false (default - logging enabled)
});

// Example 2: SDK with logging disabled
const sdk2 = new ChekinSDK({
  apiKey: 'your-api-key-here',
  features: ['payments', 'analytics'],
  disableLogging: true, // Disable all SDK logging
});

// Example 3: SDK with custom logger configuration
const sdk3 = new ChekinSDK({
  apiKey: 'your-api-key-here',
  features: ['documents'],
  logger: {
    level: 'warn', // Only log warnings and errors
    prefix: '[MyChekinApp]',
    onLog: (entry) => {
      // Custom log handler - send to your monitoring service
      console.log(`Custom log: ${entry.level} - ${entry.message}`, entry.data);
    }
  }
});

// Example 4: Validation before SDK creation
const config = {
  apiKey: 'test-key',
  features: ['invalid-feature'], // This will trigger a warning
  defaultLanguage: 'invalid-lang', // This will trigger a warning  
  styles: {
    'background-color': '#ff0000',
    'font-size': '16px'
  },
  payServicesConfig: {
    currency: 'USD',
    liveness: {
      price: 5.99
    }
  }
};

// Validate configuration before creating SDK
const validationResult: ValidationResult = ChekinSDK.validateConfig(config);

if (validationResult.isValid) {
  console.log('✅ Configuration is valid');
  const sdk = new ChekinSDK(config);
} else {
  console.log('❌ Configuration has errors:');
  validationResult.errors.forEach(error => {
    console.log(`  - ${error.field}: ${error.message}`);
  });
}

if (validationResult.warnings.length > 0) {
  console.log('⚠️ Configuration warnings:');
  validationResult.warnings.forEach(warning => {
    console.log(`  - ${warning.field}: ${warning.message}`);
  });
}

// Example 5: Standalone validator usage
const validator = new ChekinSDKValidator();

// Quick validation methods
console.log('API key valid:', ChekinSDKValidator.validateApiKey('my-api-key-123'));
console.log('Language valid:', ChekinSDKValidator.validateLanguage('en'));
console.log('Feature valid:', ChekinSDKValidator.validateFeature('reservations'));
console.log('Currency valid:', ChekinSDKValidator.validateCurrency('EUR'));
console.log('URL valid:', ChekinSDKValidator.validateUrl('https://styles.example.com/app.css'));

// Example 6: Large configuration that will use postMessage
const largeConfig = {
  apiKey: 'your-api-key-here',
  styles: {
    // Large CSS object that might exceed URL limits
    'primary-color': '#1a73e8',
    'secondary-color': '#34a853',
    'background-color': '#ffffff',
    'text-color': '#202124',
    'border-color': '#dadce0',
    'hover-color': '#1557b0',
    'focus-color': '#1967d2',
    'disabled-color': '#f1f3f4',
    'error-color': '#d93025',
    'warning-color': '#f9ab00',
    'success-color': '#137333',
    'info-color': '#1a73e8',
    // ... many more styles
  },
  hiddenFormFields: {
    housingInfo: ['field1', 'field2', 'field3'],
    housingPolice: ['policeField1', 'policeField2'],
    housingStat: ['statField1', 'statField2', 'statField3'],
    guestbookGeneration: ['guestField1', 'guestField2']
  },
  payServicesConfig: {
    currency: 'EUR',
    liveness: { price: 12.50 }
  }
};

const sdkWithLargeConfig = new ChekinSDK(largeConfig);

// The SDK will automatically:
// 1. Validate the configuration and log warnings for any issues
// 2. Check URL length limits
// 3. Move large parameters to postMessage if needed
// 4. Log the process (unless logging is disabled)

// Example 7: Runtime validation of current config
const currentValidation = sdkWithLargeConfig.getValidationResult();
console.log('Current config validation:', currentValidation);

// Example 8: Access logger for custom logging
const logger = sdk1.getLogger();
logger.info('Custom message from application', { customData: 'example' });

// Example 9: Send logs to monitoring service
sdk1.sendLogs('https://your-logging-endpoint.com/api/logs');