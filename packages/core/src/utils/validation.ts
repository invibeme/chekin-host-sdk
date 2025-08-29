import { ChekinSDKConfig } from '../types';

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

const SUPPORTED_LANGUAGES = [
  'en',
  'es',
  'it',
  'de',
  'fr',
  'hu',
  'ru',
  'cs',
  'bg',
  'pt',
  'ro',
  'et',
  'pl',
  'ca',
] as const;

const SUPPORTED_FEATURES = ['IV'] as const;

const SUPPORTED_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'SEK',
  'NZD',
  'MXN',
  'SGD',
  'HKD',
  'NOK',
  'TRY',
  'ZAR',
  'BRL',
  'INR',
  'KRW',
  'PLN',
] as const;

export class ChekinSDKValidator {
  public validateConfig(config: ChekinSDKConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Required field validation
    if (!config.apiKey) {
      errors.push({
        field: 'apiKey',
        message: 'API key is required',
        value: config.apiKey,
      });
    } else if (typeof config.apiKey !== 'string') {
      errors.push({
        field: 'apiKey',
        message: 'API key must be a string',
        value: config.apiKey,
      });
    } else if (config.apiKey.length < 10) {
      warnings.push({
        field: 'apiKey',
        message: 'API key seems too short, please verify it is correct',
        value: config.apiKey.length,
      });
    }

    // BaseUrl validation
    if (config.baseUrl) {
      if (typeof config.baseUrl !== 'string') {
        errors.push({
          field: 'baseUrl',
          message: 'Base URL must be a string',
          value: config.baseUrl,
        });
      } else {
        try {
          new URL(config.baseUrl);
        } catch {
          errors.push({
            field: 'baseUrl',
            message: 'Base URL must be a valid URL',
            value: config.baseUrl,
          });
        }
      }
    }

    // Version validation
    if (config.version) {
      if (typeof config.version !== 'string') {
        errors.push({
          field: 'version',
          message: 'Version must be a string',
          value: config.version,
        });
      } else if (
        !/^(latest|v?\d+\.\d+\.\d+(-[a-z0-9]+)?)$/i.test(config.version)
      ) {
        warnings.push({
          field: 'version',
          message:
            'Version format should be "latest" or semantic version (e.g., "1.0.0", "v2.1.3")',
          value: config.version,
        });
      }
    }

    if (config.features) {
      if (!Array.isArray(config.features)) {
        errors.push({
          field: 'features',
          message: 'Features must be an array',
          value: config.features,
        });
      } else {
        config.features.forEach((feature, index) => {
          if (typeof feature !== 'string') {
            errors.push({
              field: `features[${index}]`,
              message: 'Each feature must be a string',
              value: feature,
            });
          } else if (
            !SUPPORTED_FEATURES.includes(
              feature as (typeof SUPPORTED_FEATURES)[number]
            )
          ) {
            warnings.push({
              field: `features[${index}]`,
              message: `Unknown feature "${feature}". Supported features: ${SUPPORTED_FEATURES.join(
                ', '
              )}`,
              value: feature,
            });
          }
        });
      }
    }

    // ID validation
    this.validateId(config.housingId, 'housingId', errors, warnings);
    this.validateId(
      config.externalHousingId,
      'externalHousingId',
      errors,
      warnings
    );
    this.validateId(config.reservationId, 'reservationId', errors, warnings);

    // Language validation
    if (config.defaultLanguage) {
      if (typeof config.defaultLanguage !== 'string') {
        errors.push({
          field: 'defaultLanguage',
          message: 'Default language must be a string',
          value: config.defaultLanguage,
        });
      } else if (
        !SUPPORTED_LANGUAGES.includes(
          config.defaultLanguage as (typeof SUPPORTED_LANGUAGES)[number]
        )
      ) {
        warnings.push({
          field: 'defaultLanguage',
          message: `Unsupported language "${
            config.defaultLanguage
          }". Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`,
          value: config.defaultLanguage,
        });
      }
    }

    if (config.styles) {
      if (typeof config.styles !== 'string') {
        errors.push({
          field: 'styles',
          message: 'Styles must be a string',
          value: config.styles,
        });
      }
    }

    if (config.stylesLink) {
      if (typeof config.stylesLink !== 'string') {
        errors.push({
          field: 'stylesLink',
          message: 'Styles link must be a string',
          value: config.stylesLink,
        });
      } else {
        try {
          new URL(config.stylesLink);
        } catch {
          errors.push({
            field: 'stylesLink',
            message: 'Styles link must be a valid URL',
            value: config.stylesLink,
          });
        }
      }
    }

    this.validateBoolean(config.autoHeight, 'autoHeight', errors);
    this.validateBoolean(config.disableLogging, 'disableLogging', errors);

    // Hidden form fields validation
    if (config.hiddenFormFields) {
      this.validateHiddenFormFields(config.hiddenFormFields, errors, warnings);
    }

    // Hidden sections validation
    if (config.hiddenSections) {
      if (!Array.isArray(config.hiddenSections)) {
        errors.push({
          field: 'hiddenSections',
          message: 'Hidden sections must be an array',
          value: config.hiddenSections,
        });
      } else {
        config.hiddenSections.forEach((section, index) => {
          if (typeof section !== 'string') {
            errors.push({
              field: `hiddenSections[${index}]`,
              message: 'Each hidden section must be a string',
              value: section,
            });
          }
        });
      }
    }

    // Pay services config validation
    if (config.payServicesConfig) {
      this.validatePayServicesConfig(
        config.payServicesConfig,
        errors,
        warnings
      );
    }

    // Callback validation
    this.validateCallback(config.onHeightChanged, 'onHeightChanged', errors);
    this.validateCallback(config.onError, 'onError', errors);
    this.validateCallback(
      config.onConnectionError,
      'onConnectionError',
      errors
    );
    this.validateCallback(
      config.onPoliceAccountConnection,
      'onPoliceAccountConnection',
      errors
    );
    this.validateCallback(
      config.onStatAccountConnection,
      'onStatAccountConnection',
      errors
    );

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateId(
    value: unknown,
    fieldName: string,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): void {
    if (value !== undefined) {
      if (typeof value !== 'string') {
        errors.push({
          field: fieldName,
          message: `${fieldName} must be a string`,
          value,
        });
      } else if (value.length === 0) {
        errors.push({
          field: fieldName,
          message: `${fieldName} cannot be empty`,
          value,
        });
      } else if (value.length > 100) {
        warnings.push({
          field: fieldName,
          message: `${fieldName} is unusually long (${value.length} characters)`,
          value: value.length,
        });
      }
    }
  }

  private validateBoolean(
    value: unknown,
    fieldName: string,
    errors: ValidationError[]
  ): void {
    if (value !== undefined && typeof value !== 'boolean') {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a boolean`,
        value,
      });
    }
  }

  private validateHiddenFormFields(
    hiddenFormFields: unknown,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): void {
    if (typeof hiddenFormFields !== 'object' || hiddenFormFields === null) {
      errors.push({
        field: 'hiddenFormFields',
        message: 'Hidden form fields must be an object',
        value: hiddenFormFields,
      });
      return;
    }

    const validSections = [
      'housingInfo',
      'housingPolice',
      'housingStat',
      'guestbookGeneration',
    ];

    Object.entries(hiddenFormFields).forEach(([section, fields]) => {
      if (!validSections.includes(section)) {
        warnings.push({
          field: `hiddenFormFields.${section}`,
          message: `Unknown section "${section}". Valid sections: ${validSections.join(
            ', '
          )}`,
          value: section,
        });
      }

      if (!Array.isArray(fields)) {
        errors.push({
          field: `hiddenFormFields.${section}`,
          message: 'Hidden form fields section must be an array',
          value: fields,
        });
      } else {
        (fields as unknown[]).forEach((field, index) => {
          if (typeof field !== 'string') {
            errors.push({
              field: `hiddenFormFields.${section}[${index}]`,
              message: 'Each hidden field must be a string',
              value: field,
            });
          }
        });
      }
    });
  }

  private validatePayServicesConfig(
    payConfig: ChekinSDKConfig['payServicesConfig'],
    errors: ValidationError[],
    warnings: ValidationError[]
  ): void {
    if (typeof payConfig !== 'object' || payConfig === null) {
      errors.push({
        field: 'payServicesConfig',
        message: 'Pay services config must be an object',
        value: payConfig,
      });
      return;
    }

    if (payConfig['currency']) {
      if (typeof payConfig['currency'] !== 'string') {
        errors.push({
          field: 'payServicesConfig.currency',
          message: 'Currency must be a string',
          value: payConfig['currency'],
        });
      } else if (
        !SUPPORTED_CURRENCIES.includes(
          payConfig['currency'] as (typeof SUPPORTED_CURRENCIES)[number]
        )
      ) {
        warnings.push({
          field: 'payServicesConfig.currency',
          message: `Unsupported currency "${
            payConfig['currency']
          }". Supported currencies: ${SUPPORTED_CURRENCIES.join(', ')}`,
          value: payConfig['currency'],
        });
      }
    }

    if (payConfig['liveness']) {
      if (
        typeof payConfig['liveness'] !== 'object' ||
        payConfig['liveness'] === null
      ) {
        errors.push({
          field: 'payServicesConfig.liveness',
          message: 'Liveness config must be an object',
          value: payConfig['liveness'],
        });
      } else if (payConfig.liveness.price !== undefined) {
        if (typeof payConfig.liveness.price !== 'number') {
          errors.push({
            field: 'payServicesConfig.liveness.price',
            message: 'Liveness price must be a number',
            value: payConfig.liveness.price,
          });
        } else if (payConfig.liveness.price < 0) {
          errors.push({
            field: 'payServicesConfig.liveness.price',
            message: 'Liveness price cannot be negative',
            value: payConfig.liveness.price,
          });
        } else if (payConfig.liveness.price > 10000) {
          warnings.push({
            field: 'payServicesConfig.liveness.price',
            message: 'Liveness price seems unusually high',
            value: payConfig.liveness.price,
          });
        }
      }
    }
  }

  private validateCallback(
    callback: unknown,
    fieldName: string,
    errors: ValidationError[]
  ): void {
    if (callback !== undefined && typeof callback !== 'function') {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a function`,
        value: typeof callback,
      });
    }
  }

  // Quick validation methods for specific use cases
  public static validateApiKey(apiKey: unknown): boolean {
    return typeof apiKey === 'string' && apiKey.length >= 10;
  }

  public static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public static validateLanguage(lang: string): boolean {
    return SUPPORTED_LANGUAGES.includes(
      lang as (typeof SUPPORTED_LANGUAGES)[number]
    );
  }

  public static validateFeature(feature: string): boolean {
    return SUPPORTED_FEATURES.includes(
      feature as (typeof SUPPORTED_FEATURES)[number]
    );
  }

  public static validateCurrency(currency: string): boolean {
    return SUPPORTED_CURRENCIES.includes(
      currency as (typeof SUPPORTED_CURRENCIES)[number]
    );
  }
}
