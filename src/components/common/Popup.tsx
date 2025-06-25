import React, { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type PopupType = 'success' | 'error' | 'info' | 'warning';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | ReactNode;
  type?: PopupType;
  autoCloseMs?: number | null;
  footer?: ReactNode;
  zIndex?: number;
}

/**
 * A reusable popup component for notifications, alerts, and success messages
 */
const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  autoCloseMs = 8000,
  footer,
  zIndex = 9999
}) => {
  // Create a portal container if it doesn't exist
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  
  useEffect(() => {
    // Check if the portal container already exists
    let container = document.getElementById('popup-portal');
    
    // If not, create it and append to body
    if (!container) {
      container = document.createElement('div');
      container.id = 'popup-portal';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.zIndex = '9999';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);
    }
    
    setPortalContainer(container);
    
    // Log when popup opens or closes for debugging
    console.log(`Popup ${isOpen ? 'opened' : 'closed'}:`, { title, type });
    
    // Auto-close after specified time if provided
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isOpen && autoCloseMs) {
      timer = setTimeout(() => {
        onClose();
      }, autoCloseMs);
    }
    
    // Cleanup function
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, onClose, autoCloseMs, title, type]);

  if (!isOpen || !portalContainer) return null;

  // Get the appropriate icon and background color based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-6 h-6 mr-2" />,
          bgClass: 'bg-gradient-to-r from-green-600 to-green-800',
          textClass: 'text-white'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-6 h-6 mr-2" />,
          bgClass: 'bg-gradient-to-r from-red-600 to-red-800',
          textClass: 'text-white'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="w-6 h-6 mr-2" />,
          bgClass: 'bg-gradient-to-r from-yellow-500 to-yellow-700',
          textClass: 'text-white'
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-6 h-6 mr-2" />,
          bgClass: 'bg-gradient-to-r from-blue-600 to-blue-800',
          textClass: 'text-white'
        };
    }
  };

  const { icon, bgClass, textClass } = getTypeStyles();

  // Use createPortal to render the popup outside the normal DOM hierarchy
  return createPortal(
    <div 
      className="fixed inset-0 overflow-y-auto flex items-center justify-center"
      style={{ 
        zIndex: zIndex,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        pointerEvents: 'auto'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full mx-4 transform transition-all"
        style={{
          maxWidth: '500px',
          animation: 'popup-slide-in 0.3s ease-out'
        }}
      >
        <style>{`
          @keyframes popup-slide-in {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        
        <div className={`flex items-center justify-between p-4 ${bgClass} ${textClass}`}>
          <div className="flex items-center">
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className={`${textClass} hover:opacity-75 focus:outline-none`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            {typeof message === 'string' ? (
              message.split('\n').map((line, index) => (
                <p key={index} className="mb-2 text-gray-700">
                  {line}
                </p>
              ))
            ) : (
              message
            )}
          </div>
          
          {footer && (
            <div className="mt-6">
              {footer}
            </div>
          )}
          
          {!footer && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className={`px-4 py-2 ${bgClass} ${textClass} rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                Got it!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    portalContainer
  );
};

export default Popup;
