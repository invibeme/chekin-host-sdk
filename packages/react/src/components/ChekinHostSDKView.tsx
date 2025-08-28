import {useEffect, useRef, useImperativeHandle, forwardRef, CSSProperties} from 'react';
import { ChekinHostSDK, ChekinSDKConfig } from '@chekin/host-sdk';

export interface ChekinHostSDKViewProps extends ChekinSDKConfig {
  className?: string;
  style?: CSSProperties;
}

export interface ChekinHostSDKViewHandle {
  sdk: ChekinHostSDK | null;
  container: HTMLDivElement | null;
}

export const ChekinHostSDKView = forwardRef<ChekinHostSDKViewHandle, ChekinHostSDKViewProps>(
  (props, ref) => {
    const { className, style, ...sdkConfig } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const sdkRef = useRef<ChekinHostSDK | null>(null);

    useImperativeHandle(ref, () => ({
      sdk: sdkRef.current,
      container: containerRef.current,
    }));

    useEffect(() => {
      if (!containerRef.current || !sdkConfig.apiKey) return;

      sdkRef.current = new ChekinHostSDK(sdkConfig);

      const renderPromise = sdkRef.current.render(containerRef.current);

      renderPromise.catch((error) => {
        console.error('Failed to render ChekinHostSDK:', error);
        if (sdkConfig.onError) {
          sdkConfig.onError({ message: error.message });
        }
      });

      return () => {
        if (sdkRef.current) {
          sdkRef.current.destroy();
          sdkRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      if (sdkRef.current) {
        sdkRef.current.updateConfig(sdkConfig);
      }
    }, [
      sdkConfig.baseUrl,
      sdkConfig.version,
      sdkConfig.features,
      sdkConfig.housingId,
      sdkConfig.externalHousingId,
      sdkConfig.reservationId,
      sdkConfig.defaultLanguage,
      sdkConfig.styles,
      sdkConfig.stylesLink,
      sdkConfig.autoHeight,
      sdkConfig.disableLogging,
      sdkConfig.hiddenFormFields,
      sdkConfig.hiddenSections,
      sdkConfig.payServicesConfig,
    ]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          width: '100%',
          minHeight: '400px',
          ...style,
        }}
      />
    );
  }
);

ChekinHostSDKView.displayName = 'ChekinHostSDKView';