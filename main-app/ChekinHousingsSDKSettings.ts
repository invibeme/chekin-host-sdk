import {SDK_FEATURES, SDK_MODES} from 'utils/constants.ts';
import {CURRENCIES, CURRENCIES_SYMBOL, PREMIUM_FEATURE_PRICING} from '@chekin/core';

const mockCallback = () => {};

class ChekinHousingsSDKSettings {
  static get settings() {
    return window.ChekinHousingsSDKSettings || {};
  }

  static get housingId() {
    return ChekinHousingsSDKSettings.settings.housingId;
  }

  static get reservationId() {
    return ChekinHousingsSDKSettings.settings.reservationId;
  }

  static get apiKey() {
    return ChekinHousingsSDKSettings.settings.apiKey ?? '';
  }

  static get defaultLanguage() {
    return ChekinHousingsSDKSettings.settings.defaultLanguage;
  }

  static get styles() {
    return ChekinHousingsSDKSettings.settings.styles;
  }

  static get stylesLink() {
    return ChekinHousingsSDKSettings.settings.stylesLink;
  }

  static get autoHeight() {
    return ChekinHousingsSDKSettings.settings.autoHeight;
  }

  static get hiddenFormFields() {
    return ChekinHousingsSDKSettings.settings.hiddenFormFields;
  }

  static get hiddenHousingFields() {
    return ChekinHousingsSDKSettings.hiddenFormFields?.housingInfo || [];
  }

  static get hiddenHousingPoliceFields() {
    return ChekinHousingsSDKSettings.hiddenFormFields?.housingPolice || [];
  }

  static get hiddenHousingStatFields() {
    return ChekinHousingsSDKSettings.hiddenFormFields?.housingStat || [];
  }

  static get hiddenGuestbookGenerationFields() {
    return ChekinHousingsSDKSettings.hiddenFormFields?.guestbookGeneration || [];
  }

  static get hiddenSections() {
    return ChekinHousingsSDKSettings.settings.hiddenSections || [];
  }

  static get externalHousingId() {
    return ChekinHousingsSDKSettings.settings.externalHousingId;
  }

  static get mode() {
    if (
      ChekinHousingsSDKSettings.housingId ??
      ChekinHousingsSDKSettings.externalHousingId
    ) {
      return SDK_MODES.singleHousing;
    } else if (ChekinHousingsSDKSettings.reservationId) {
      return SDK_MODES.singleReservation;
    } else {
      return SDK_MODES.default;
    }
  }

  static get isSingleMode() {
    return ChekinHousingsSDKSettings.mode === SDK_MODES.singleHousing;
  }

  static get isSingleReservationMode() {
    return ChekinHousingsSDKSettings.mode === SDK_MODES.singleReservation;
  }

  static get isDefaultMode() {
    return ChekinHousingsSDKSettings.mode === SDK_MODES.default;
  }

  static checkIfFeatureIsAvailable(feature: SDK_FEATURES) {
    return Boolean(ChekinHousingsSDKSettings.settings.features?.includes(feature));
  }

  static get payServicesConfig() {
    return ChekinHousingsSDKSettings.settings.payServicesConfig || {};
  }

  static get currency() {
    return ChekinHousingsSDKSettings.payServicesConfig.currency || CURRENCIES.usd;
  }

  static getPremiumFeaturePrice(feature: string): {
    price: number;
    formatedPrice: string;
  } {
    const config = ChekinHousingsSDKSettings.payServicesConfig;
    const currency = ChekinHousingsSDKSettings.currency;
    const currencySign =
      CURRENCIES_SYMBOL[currency as CURRENCIES] || CURRENCIES_SYMBOL.usd;

    switch (feature) {
      case 'livenessDetection':
      case 'liveness':
      case 'liveness_detection':
        return {
          price: config.liveness?.price || PREMIUM_FEATURE_PRICING.liveness,
          formatedPrice: `${(config.liveness?.price || PREMIUM_FEATURE_PRICING.liveness).toFixed(2)}${currencySign}`,
        };
      default:
        return {
          price: PREMIUM_FEATURE_PRICING.liveness,
          formatedPrice: `${PREMIUM_FEATURE_PRICING.liveness}${currencySign}`,
        };
    }
  }

  static get events() {
    const settings = ChekinHousingsSDKSettings.settings;

    return {
      onError: settings?.onError || mockCallback,
      onConnectionError: settings?.onConnectionError || mockCallback,
      onPoliceAccountConnection: settings?.onPoliceAccountConnection || mockCallback,
      onStatAccountConnection: settings?.onStatAccountConnection || mockCallback,
      onHeightChanged: settings?.onHeightChanged || mockCallback,
    };
  }
}

export default ChekinHousingsSDKSettings;
