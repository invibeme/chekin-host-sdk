// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { useEffect, useState } from 'react';

export function App() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Parse URL parameters to get initial configuration
    const params = new URLSearchParams(window.location.search);
    const initialConfig = {
      apiKey: params.get('apiKey'),
      features: params.get('features')?.split(',') || [],
      housingId: params.get('housingId'),
      reservationId: params.get('reservationId'),
      lang: params.get('lang') || 'en',
      customStyles: params.get('customStyles'),
      stylesLink: params.get('stylesLink')
    };
    setConfig(initialConfig);
  }, []);

  if (!config?.apiKey) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Chekin Host SDK</h2>
        <p>Missing API key. Please configure the SDK properly.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chekin Host SDK</h1>
      <div style={{ marginBottom: '20px' }}>
        <h3>Configuration:</h3>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Features:</h3>
        {config.features.length > 0 ? (
          <ul>
            {config.features.map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        ) : (
          <p>No specific features configured</p>
        )}
      </div>

      <div style={{ 
        padding: '20px', 
        background: '#e8f5e8', 
        borderRadius: '4px',
        border: '1px solid #4caf50'
      }}>
        <p><strong>✅ SDK Loaded Successfully</strong></p>
        <p>This is the iframe application that will be embedded in parent websites.</p>
        <p>Communication with parent window is active.</p>
      </div>
    </div>
  );
}

export default App;
