import React, { useRef, useEffect, useState } from 'react';
import { ChekinSDK, ChekinUrlConfig } from '@chekin/sdk';

export interface InlineWidgetProps extends ChekinUrlConfig {
  autoHeight?: boolean;
  onHeightChanged?: (height: number) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const InlineWidget: React.FC<InlineWidgetProps> = ({
  apiKey,
  baseUrl = 'https://sdk.chekin.com',
  autoHeight = true,
  onHeightChanged,
  onError,
  className = 'chekin-inline-widget',
  style,
  ...config
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sdkRef = useRef<ChekinSDK | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sdk = new ChekinSDK({
      apiKey,
      baseUrl,
      ...config
    });

    sdkRef.current = sdk;

    // Set up event listeners
    if (onHeightChanged) {
      sdk.on('height-changed', (height: number) => {
        onHeightChanged(height);
      });
    }

    if (onError) {
      sdk.on('error', (errorData: any) => {
        onError(new Error(errorData.message));
      });
    }

    // Render the SDK
    sdk.render(containerRef.current)
      .then(() => {
        setIsLoading(false);
        setError(null);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
        onError?.(err);
      });

    return () => {
      sdk.destroy();
    };
  }, [apiKey, baseUrl, onHeightChanged, onError, config]);

  if (error) {
    return (
      <div className={`${className} ${className}--error`} style={style}>
        <div className="chekin-error">
          Error loading Chekin SDK: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {isLoading && (
        <div className="chekin-loading">
          Loading Chekin SDK...
        </div>
      )}
      <div 
        ref={containerRef}
        style={{
          display: isLoading ? 'none' : 'block',
          height: autoHeight ? 'auto' : '100%'
        }}
      />
    </div>
  );
};