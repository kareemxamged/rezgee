import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastMessage } from './ToastContainer';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Show animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto hide after duration
    const hideTimer = setTimeout(() => {
      handleClose();
    }, toast.duration || 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border-r-4 shadow-lg bg-white border border-slate-200";
    switch (toast.type) {
      case 'success':
        return `${baseStyles} border-r-green-500 bg-green-50`;
      case 'error':
        return `${baseStyles} border-r-red-500 bg-red-50`;
      case 'warning':
        return `${baseStyles} border-r-amber-500 bg-amber-50`;
      case 'info':
        return `${baseStyles} border-r-blue-500 bg-blue-50`;
      default:
        return `${baseStyles} border-r-blue-500 bg-blue-50`;
    }
  };

  return (
    <div
      className={`
        relative max-w-sm w-full transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${getStyles()}
        rounded-lg p-4 shadow-xl backdrop-blur-sm
      `}
      role="alert"
      style={{
        direction: 'rtl',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div className="flex items-start gap-3 text-right">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-800 mb-1 leading-tight">
            {toast.title}
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed break-words whitespace-pre-wrap">
            {toast.message}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-slate-200 transition-colors ml-2"
          aria-label="إغلاق التنبيه"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
