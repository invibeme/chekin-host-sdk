import { useEffect, useRef } from 'react';
import { ChekinHostSDK, ChekinEventCallback } from '@chekin/host-sdk';

export function useChekinEventListener(
  sdk: ChekinHostSDK | null,
  eventType: string,
  callback: ChekinEventCallback
) {
  const callbackRef = useRef(callback);
  
  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!sdk) return;

    const eventHandler = (payload: any) => {
      callbackRef.current(payload);
    };

    sdk.on(eventType, eventHandler);

    return () => {
      sdk.off(eventType, eventHandler);
    };
  }, [sdk, eventType]);
}