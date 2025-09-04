import {useEffect, useRef} from 'react';
import {CHEKIN_EVENTS, ChekinHostSDKConfig} from '@chekinapp/host-sdk';

export interface HostSDKEventCallbacks
  extends Pick<
    ChekinHostSDKConfig,
    | 'onHeightChanged'
    | 'onError'
    | 'onConnectionError'
    | 'onPoliceAccountConnection'
    | 'onStatAccountConnection'
  > {}

export function useHostSDKEventListener(eventHandlers: HostSDKEventCallbacks) {
  const callbacksRef = useRef(eventHandlers);

  useEffect(() => {
    callbacksRef.current = eventHandlers;
  }, [eventHandlers]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      const {type, payload} = event.data;

      switch (type) {
        case CHEKIN_EVENTS.HEIGHT_CHANGED:
          callbacksRef.current.onHeightChanged?.(payload);
          break;
        case CHEKIN_EVENTS.ERROR:
          callbacksRef.current.onError?.(payload);
          break;
        case CHEKIN_EVENTS.CONNECTION_ERROR:
          callbacksRef.current.onConnectionError?.(payload);
          break;
        case CHEKIN_EVENTS.POLICE_ACCOUNT_CONNECTION:
          callbacksRef.current.onPoliceAccountConnection?.(payload);
          break;
        case CHEKIN_EVENTS.STAT_ACCOUNT_CONNECTION:
          callbacksRef.current.onStatAccountConnection?.(payload);
          break;
      }
    };

    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);
}
