import {describe, it, expect} from 'vitest';
import {formatChekinUrl} from '../../utils/formatChekinUrl';
import {ChekinSDKConfig} from '../../types';

describe('formatChekinUrl', () => {
  const baseConfig: ChekinSDKConfig = {
    apiKey: 'test-api-key',
  };

  describe('URL generation', () => {
    it('should generate URL with default version when no version specified', () => {
      const result = formatChekinUrl(baseConfig);

      expect(result.url).toContain('https://cdn.chekin.com/host-sdk/latest/');
      expect(result.url).toContain('apiKey=test-api-key');
      expect(result.isLengthLimited).toBe(false);
    });

    it('should use custom baseUrl when provided', () => {
      const config = {
        ...baseConfig,
        baseUrl: 'https://custom.example.com/',
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('https://custom.example.com/');
      expect(result.url).toContain('apiKey=test-api-key');
    });

    it('should handle version prefixing correctly', () => {
      const configWithV = {
        ...baseConfig,
        version: 'v1.2.3',
      };

      const configWithoutV = {
        ...baseConfig,
        version: '1.2.3',
      };

      const resultWithV = formatChekinUrl(configWithV);
      const resultWithoutV = formatChekinUrl(configWithoutV);

      expect(resultWithV.url).toContain('host-sdk/v1.2.3/');
      expect(resultWithoutV.url).toContain('host-sdk/v1.2.3/');
    });

    it('should handle "latest" version correctly', () => {
      const config = {
        ...baseConfig,
        version: 'latest',
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('host-sdk/latest/');
    });

    it('should handle "development" version correctly', () => {
      const config = {
        ...baseConfig,
        version: 'development',
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('host-sdk/development/');
    });
  });

  describe('Essential parameters', () => {
    it('should add all essential parameters to URL', () => {
      const config: ChekinSDKConfig = {
        apiKey: 'test-key',
        features: ['IV', 'LIVENESS_DETECTION'],
        housingId: 'housing-123',
        externalHousingId: 'ext-housing-456',
        reservationId: 'res-789',
        defaultLanguage: 'en',
        autoHeight: true,
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('apiKey=test-key');
      expect(result.url).toContain('features=reservations%2Cguests');
      expect(result.url).toContain('housingId=housing-123');
      expect(result.url).toContain('externalHousingId=ext-housing-456');
      expect(result.url).toContain('reservationId=res-789');
      expect(result.url).toContain('lang=en');
      expect(result.url).toContain('autoHeight=true');
    });

    it('should skip undefined essential parameters', () => {
      const config: ChekinSDKConfig = {
        apiKey: 'test-key',
        features: undefined,
        housingId: undefined,
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('apiKey=test-key');
      expect(result.url).not.toContain('features=');
      expect(result.url).not.toContain('housingId=');
    });

    it('should handle empty arrays by not adding parameter', () => {
      const config: ChekinSDKConfig = {
        apiKey: 'test-key',
        features: [],
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('apiKey=test-key');
      expect(result.url).not.toContain('features=');
    });
  });

  describe('Styles handling', () => {
    it('should add short stylesLink to URL', () => {
      const config = {
        ...baseConfig,
        stylesLink: 'https://example.com/styles.css',
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain(
        'stylesLink=https%253A%252F%252Fexample.com%252Fstyles.css',
      );
      expect(result.postMessageConfig).toBeUndefined();
      expect(result.isLengthLimited).toBe(false);
    });

    it('should move long stylesLink to postMessage config', () => {
      const longStylesLink =
        'https://example.com/very-long-styles-link-' + 'x'.repeat(500);
      const config = {
        ...baseConfig,
        stylesLink: longStylesLink,
      };

      const result = formatChekinUrl(config);

      expect(result.url).not.toContain('stylesLink=');
      expect(result.postMessageConfig?.stylesLink).toBe(longStylesLink);
      expect(result.isLengthLimited).toBe(true);
    });

    it('should add short styles to URL', () => {
      const config = {
        ...baseConfig,
        styles: 'body { color: red; }',
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain(
        'styles=body%2520%257B%2520color%253A%2520red%253B%2520%257D',
      );
      expect(result.postMessageConfig).toBeUndefined();
      expect(result.isLengthLimited).toBe(false);
    });

    it('should move long styles to postMessage config', () => {
      const longStyles =
        'body { color: red; } ' + '.class { background: blue; } '.repeat(50);
      const config = {
        ...baseConfig,
        styles: longStyles,
      };

      const result = formatChekinUrl(config);

      expect(result.url).not.toContain('styles=');
      expect(result.postMessageConfig?.styles).toBe(longStyles);
      expect(result.isLengthLimited).toBe(true);
    });
  });

  describe('Hidden sections handling', () => {
    it('should add short hiddenSections to URL', () => {
      const config = {
        ...baseConfig,
        hiddenSections: ['section1', 'section2'],
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('hiddenSections=section1%2Csection2');
      expect(result.postMessageConfig).toBeUndefined();
      expect(result.isLengthLimited).toBe(false);
    });

    it('should move long hiddenSections to postMessage config', () => {
      const longSections = Array(50)
        .fill(0)
        .map((_, i) => `very-long-section-name-${i}`);
      const config = {
        ...baseConfig,
        hiddenSections: longSections,
      };

      const result = formatChekinUrl(config);

      expect(result.url).not.toContain('hiddenSections=');
      expect(result.postMessageConfig?.hiddenSections).toEqual(longSections);
      expect(result.isLengthLimited).toBe(true);
    });

    it('should skip empty hiddenSections array', () => {
      const config = {
        ...baseConfig,
        hiddenSections: [],
      };

      const result = formatChekinUrl(config);

      expect(result.url).not.toContain('hiddenSections=');
      expect(result.postMessageConfig).toBeUndefined();
    });
  });

  describe('Large objects handling', () => {
    it('should always move hiddenFormFields to postMessage config', () => {
      const config = {
        ...baseConfig,
        hiddenFormFields: {
          housingInfo: ['field1', 'field2'],
        },
      };

      const result = formatChekinUrl(config);

      expect(result.url).not.toContain('hiddenFormFields');
      expect(result.postMessageConfig?.hiddenFormFields).toEqual({
        housingInfo: ['field1', 'field2'],
      });
      expect(result.isLengthLimited).toBe(true);
    });

    it('should always move payServicesConfig to postMessage config', () => {
      const config = {
        ...baseConfig,
        payServicesConfig: {
          currency: 'EUR',
          liveness: {price: 100},
        },
      };

      const result = formatChekinUrl(config);

      expect(result.url).not.toContain('payServicesConfig');
      expect(result.postMessageConfig?.payServicesConfig).toEqual({
        currency: 'EUR',
        liveness: {price: 100},
      });
      expect(result.isLengthLimited).toBe(true);
    });
  });

  describe('URL length limits', () => {
    it('should create minimal URL when exceeding safe limit', () => {
      const longValue = 'x'.repeat(2500);
      const config: ChekinSDKConfig = {
        apiKey: 'test-key',
        housingId: 'housing-123',
        externalHousingId: 'ext-housing-456',
        features: [longValue],
        reservationId: 'res-789',
        defaultLanguage: 'en',
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('apiKey=test-key');
      expect(result.url).toContain('housingId=housing-123');
      expect(result.url).toContain('externalHousingId=ext-housing-456');
      expect(result.url).not.toContain('features=');
      expect(result.url).not.toContain('reservationId=');
      expect(result.url).not.toContain('lang=');

      expect(result.postMessageConfig?.features).toEqual([longValue]);
      expect(result.postMessageConfig?.reservationId).toBe('res-789');
      expect(result.postMessageConfig?.defaultLanguage).toBe('en');
      expect(result.isLengthLimited).toBe(true);
    });

    it('should include housingId in minimal URL when available', () => {
      const longValue = 'x'.repeat(2500);
      const config: ChekinSDKConfig = {
        apiKey: 'test-key',
        housingId: 'housing-123',
        features: [longValue],
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('apiKey=test-key');
      expect(result.url).toContain('housingId=housing-123');
      expect(result.isLengthLimited).toBe(true);
    });

    it('should include externalHousingId in minimal URL when available', () => {
      const longValue = 'x'.repeat(2500);
      const config: ChekinSDKConfig = {
        apiKey: 'test-key',
        externalHousingId: 'ext-housing-456',
        features: [longValue],
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('apiKey=test-key');
      expect(result.url).toContain('externalHousingId=ext-housing-456');
      expect(result.isLengthLimited).toBe(true);
    });
  });

  describe('PostMessage config handling', () => {
    it('should return undefined postMessageConfig when empty', () => {
      const result = formatChekinUrl(baseConfig);

      expect(result.postMessageConfig).toBeUndefined();
    });

    it('should combine multiple config items in postMessage', () => {
      const longStyles = 'x'.repeat(600);
      const config = {
        ...baseConfig,
        styles: longStyles,
        hiddenFormFields: {housingInfo: ['field1']},
      };

      const result = formatChekinUrl(config);

      expect(result.postMessageConfig?.styles).toBe(longStyles);
      expect(result.postMessageConfig?.hiddenFormFields).toEqual({
        housingInfo: ['field1'],
      });
      expect(result.isLengthLimited).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle config with only apiKey', () => {
      const result = formatChekinUrl({apiKey: 'test-key'});

      expect(result.url).toContain('apiKey=test-key');
      expect(result.postMessageConfig).toBeUndefined();
      expect(result.isLengthLimited).toBe(false);
    });

    it('should handle boolean values correctly', () => {
      const config = {
        ...baseConfig,
        autoHeight: false,
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('autoHeight=false');
    });

    it('should handle numeric values correctly', () => {
      const config = {
        ...baseConfig,
        reservationId: '12345',
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('reservationId=12345');
    });

    it('should properly encode special characters in URL parameters', () => {
      const config = {
        ...baseConfig,
        defaultLanguage: 'zh-CN',
        styles: 'body { content: "Hello & World"; }',
      };

      const result = formatChekinUrl(config);

      expect(result.url).toContain('lang=zh-CN');
      expect(result.url).toContain(
        'styles=body%2520%257B%2520content%253A%2520%2522Hello%2520%2526%2520World%2522%253B%2520%257D',
      );
    });
  });

  describe('Return type validation', () => {
    it('should return UrlConfigResult with correct structure', () => {
      const result = formatChekinUrl(baseConfig);

      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('isLengthLimited');
      expect(typeof result.url).toBe('string');
      expect(typeof result.isLengthLimited).toBe('boolean');

      if (result.postMessageConfig) {
        expect(typeof result.postMessageConfig).toBe('object');
      }
    });

    it('should return valid URL format', () => {
      const result = formatChekinUrl(baseConfig);

      expect(() => new URL(result.url)).not.toThrow();
    });
  });
});
