import React from 'react';
import { createPortal } from 'react-dom';
import { InlineWidget, InlineWidgetProps } from './InlineWidget.js';

export interface PopupWidgetProps extends Omit<InlineWidgetProps, 'style' | 'className'> {
  isOpen: boolean;
  onClose: () => void;
  rootElement?: HTMLElement;
  overlayClassName?: string;
  modalClassName?: string;
}

export const PopupWidget: React.FC<PopupWidgetProps> = ({
  isOpen,
  onClose,
  rootElement = document.body,
  overlayClassName = 'chekin-modal-overlay',
  modalClassName = 'chekin-modal-content',
  ...inlineProps
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className={overlayClassName}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div
        className={modalClassName}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          width: '90vw',
          height: '80vh',
          maxWidth: '800px',
          maxHeight: '600px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <button
          className="chekin-modal-close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 1,
            color: '#666'
          }}
        >
          ×
        </button>
        <InlineWidget
          {...inlineProps}
          style={{ 
            height: '100%', 
            width: '100%',
            border: 'none'
          }}
          className="chekin-popup-widget"
        />
      </div>
    </div>
  );

  return createPortal(modalContent, rootElement);
};