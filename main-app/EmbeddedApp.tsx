import {StyleSheetManager} from 'styled-components';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import ChekinHousingsSDKSettings from './ChekinHousingsSDKSettings.ts';
import {CHEKIN_ROOT_IFRAME_ID} from './utils/constants.ts';
import QUERY_CLIENT_CONFIG from './configs/query.config.ts';
import App from './App';
import Frame, {FrameContextConsumer} from './components/Frame';
import {InjectingCustomStylesProvider} from 'providers/InjectingCustomStylesProvider';

function EmbeddedApp() {
  return (
    <>
      <Frame
        title={__APP_NAME__}
        name="housings-sdk-frame"
        role="application"
        id={CHEKIN_ROOT_IFRAME_ID}
        style={{
          border: 'none',
          overflow: ChekinHousingsSDKSettings.settings.autoHeight ? 'hidden' : 'initial',
        }}
        // sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      >
        <FrameContextConsumer>
          {({document}) => (
            <StyleSheetManager target={document?.head}>
              <InjectingCustomStylesProvider
                target={document.head}
                styles={ChekinHousingsSDKSettings.styles}
                stylesLink={ChekinHousingsSDKSettings.stylesLink}
              >
                <App />
              </InjectingCustomStylesProvider>
            </StyleSheetManager>
          )}
        </FrameContextConsumer>
      </Frame>
      <ReactQueryDevtools client={QUERY_CLIENT_CONFIG} />
    </>
  );
}

export default EmbeddedApp;
