import { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const bgColor = {
    success: 'rgba(57, 255, 20, 0.1)',
    error: 'rgba(255, 107, 107, 0.1)',
    info: 'rgba(255, 215, 0, 0.1)'
  }[toast.type];

  const borderColor = {
    success: 'rgba(57, 255, 20, 0.3)',
    error: 'rgba(255, 107, 107, 0.3)',
    info: 'rgba(255, 215, 0, 0.3)'
  }[toast.type];

  const textColor = {
    success: '#39ff14',
    error: '#ff6b6b',
    info: '#ffd700'
  }[toast.type];

  return (
    <div
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        color: textColor,
        padding: '14px 18px',
        borderRadius: '8px',
        marginBottom: '10px',
        animation: 'slideIn 0.3s ease-out',
        fontSize: '0.95rem',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <span>
        {toast.type === 'success' && '✅'}
        {toast.type === 'error' && '❌'}
        {toast.type === 'info' && 'ℹ️'}
      </span>
      {toast.message}
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: CustomEvent) => {
      const toast: ToastMessage = {
        id: Math.random().toString(),
        ...e.detail
      };
      setToasts(prev => [...prev, toast]);
    };

    window.addEventListener('showToast', handleToast as EventListener);
    return () => window.removeEventListener('showToast', handleToast as EventListener);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        maxWidth: '400px',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function useToast() {
  return {
    success: (message: string) => {
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message, type: 'success' }
      }));
    },
    error: (message: string) => {
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message, type: 'error' }
      }));
    },
    info: (message: string) => {
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message, type: 'info' }
      }));
    }
  };
}
