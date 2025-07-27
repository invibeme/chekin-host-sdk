import React, { useState } from 'react';
import { PopupWidget, PopupWidgetProps } from './PopupWidget.js';

export interface PopupButtonProps extends Omit<PopupWidgetProps, 'isOpen' | 'onClose'> {
  children: React.ReactNode;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
  onOpen?: () => void;
  onClose?: () => void;
}

export const PopupButton: React.FC<PopupButtonProps> = ({
  children,
  buttonClassName = 'chekin-popup-button',
  buttonStyle,
  onOpen,
  onClose,
  ...popupProps
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      <button
        className={buttonClassName}
        style={buttonStyle}
        onClick={handleOpen}
      >
        {children}
      </button>
      <PopupWidget
        {...popupProps}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
};