import React from 'react';
import {createRoot, Root} from 'react-dom/client';
import EmbeddedApp from './EmbeddedApp.tsx';
import './configs/i18n/i18n.ts';
import {LS_I18NEXT_LNG_KEY} from '@chekin/api';
import {LANGUAGE_CODES, LocalStorage} from '@chekin/core';
import QUERY_CLIENT_CONFIG from 'configs/query.config.ts';

type InitialAppProps = NonNullable<Window['ChekinHousingsSDKSettings']>;

type RenderAppProps = {
  targetNode: string;
};

class ChekinHousingsSDK {
  private root: Root | null = null;
  private observer: MutationObserver | null = null;

  initialize(props: InitialAppProps) {
    const {
      apiKey,
      styles,
      stylesLink,
      externalHousingId,
      features,
      payServicesConfig,
      housingId,
      autoHeight,
      onHeightChanged,
      reservationId,
      defaultLanguage = LANGUAGE_CODES.en,
      hiddenFormFields,
      hiddenSections,
      onError,
      onConnectionError,
      onPoliceAccountConnection,
      onStatAccountConnection,
    } = props || {};

    LocalStorage.set(LS_I18NEXT_LNG_KEY, defaultLanguage);

    window.ChekinHousingsSDKSettings = {
      apiKey,
      styles,
      onError,
      features,
      payServicesConfig,
      autoHeight,
      onHeightChanged,
      onConnectionError,
      onStatAccountConnection,
      onPoliceAccountConnection,
      housingId: housingId || undefined,
      reservationId: reservationId || undefined,
      externalHousingId: externalHousingId || undefined,
      stylesLink,
      defaultLanguage,
      hiddenFormFields,
      hiddenSections,
    };
    console.log(`The ${__APP_NAME__} ${__APP_VERSION__} is initialized`);
  }

  static getSettings() {
    return window.ChekinHousingsSDKSettings || {};
  }

  renderApp({targetNode}: RenderAppProps) {
    const reactElement = React.createElement(EmbeddedApp, {}, 'Chekin-Dashboard');
    const container = document.getElementById(targetNode);

    if (!container) {
      throw new Error(`The target element ${targetNode ?? ''} by id not found`);
    }

    if (!window.ChekinHousingsSDKSettings?.apiKey) {
      throw new Error(
        `It is necessary to initialize SDK before and pass the correct apiKey to the initialize method`,
      );
    }

    if (this.root) {
      QUERY_CLIENT_CONFIG.clear();
      this.root.render(reactElement);
    } else {
      const root = createRoot(container);
      this.root = root;
      root.render(reactElement);
    }

    this.observeContainerRemoval(container);

    return reactElement;
  }

  private observeContainerRemoval(container: HTMLElement) {
    this.observer?.disconnect();
    this.observer = new MutationObserver(() => {
      if (!document.getElementById(container.id)) {
        this.unmount();
      }
    });

    this.observer.observe(container.ownerDocument || document, {
      childList: true,
      subtree: true,
    });
  }

  unmount() {
    this.root?.unmount();
    LocalStorage.remove(LS_I18NEXT_LNG_KEY);
    QUERY_CLIENT_CONFIG.unmount();
    window.ChekinHousingsSDKSettings = undefined as unknown as InitialAppProps;
    this.observer?.disconnect();
    this.observer = null;
    console.log(`The ${__APP_NAME__} ${__APP_VERSION__} is unmounted`);
  }
}

export default ChekinHousingsSDK;
