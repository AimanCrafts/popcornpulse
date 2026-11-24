import React from 'react';
import { CheckIcon, SparklesIcon, XIcon } from './Icons';

const Toast = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div className={`toast-notification ${notification.type || 'success'}`}>
      <div className="toast-icon">
        {notification.type === 'info' ? (
          <SparklesIcon size={18} className="text-neon-cyan" />
        ) : (
          <CheckIcon size={18} className="text-neon-gold" />
        )}
      </div>
      <div className="toast-content">
        <strong className="toast-title">{notification.title}</strong>
        <p className="toast-message">{notification.message}</p>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss alert">
        <XIcon size={16} />
      </button>
    </div>
  );
};

export default Toast;
