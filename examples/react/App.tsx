import React, { useState } from 'react';
import {
  InlineWidget,
  PopupWidget,
  PopupButton,
  useChekinModal,
  useChekinToast
} from '@chekin/sdk-react';

function App() {
  const [config, setConfig] = useState({
    apiKey: 'demo-api-key',
    features: ['reservations', 'guests'],
    housingId: 'demo-housing-123',
    defaultLanguage: 'en'
  });
  
  const [showInline, setShowInline] = useState(false);
  const { isOpen: isPopupOpen, open: openPopup, close: closePopup } = useChekinModal();
  const { toasts, showToast, removeToast } = useChekinToast();

  const handleHeightChanged = (height: number) => {
    showToast(`Height changed to ${height}px`, 'info');
  };

  const handleError = (error: Error) => {
    showToast(`Error: ${error.message}`, 'error');
  };

  const updateFeatures = () => {
    setConfig(prev => ({
      ...prev,
      features: [...prev.features, 'documents']
    }));
    showToast('Added documents feature', 'success');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Chekin SDK - React Example</h1>
      
      {/* Controls */}
      <div style={{ 
        margin: '20px 0', 
        padding: '20px', 
        background: '#f5f5f5', 
        borderRadius: '8px' 
      }}>
        <h3>SDK Controls</h3>
        <button 
          onClick={() => setShowInline(!showInline)}
          style={{ margin: '5px', padding: '10px 20px' }}
        >
          {showInline ? 'Hide' : 'Show'} Inline Widget
        </button>
        
        <button 
          onClick={openPopup}
          style={{ margin: '5px', padding: '10px 20px' }}
        >
          Open Popup Widget
        </button>

        <button 
          onClick={updateFeatures}
          style={{ margin: '5px', padding: '10px 20px' }}
        >
          Add Documents Feature
        </button>

        <PopupButton
          {...config}
          onHeightChanged={handleHeightChanged}
          onError={handleError}
          onOpen={() => showToast('Popup opened via button', 'info')}
          onClose={() => showToast('Popup closed via button', 'info')}
          buttonStyle={{ margin: '5px', padding: '10px 20px' }}
        >
          Popup Button Component
        </PopupButton>
      </div>

      {/* Configuration Display */}
      <div style={{ margin: '20px 0' }}>
        <h3>Current Configuration:</h3>
        <pre style={{ 
          background: '#f9f9f9', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      {/* Inline Widget */}
      {showInline && (
        <div style={{ margin: '20px 0' }}>
          <h3>Inline Widget:</h3>
          <InlineWidget
            {...config}
            onHeightChanged={handleHeightChanged}
            onError={handleError}
            style={{ border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>
      )}

      {/* Popup Widget */}
      <PopupWidget
        {...config}
        isOpen={isPopupOpen}
        onClose={closePopup}
        onHeightChanged={handleHeightChanged}
        onError={handleError}
      />

      {/* Toast Messages */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              background: toast.type === 'error' ? '#f44336' : 
                         toast.type === 'success' ? '#4caf50' : '#2196f3',
              color: 'white',
              padding: '12px',
              margin: '8px 0',
              borderRadius: '4px',
              cursor: 'pointer',
              maxWidth: '300px'
            }}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;