import React, { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  zIndex?: number;
}

/**
 * A reusable modal component that uses React Portal for proper stacking context
 */
const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  zIndex = 9999 
}) => {
  // Create a portal container if it doesn't exist
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  
  useEffect(() => {
    // Check if the portal container already exists
    let container = document.getElementById('modal-portal');
    
    // If not, create it and append to body
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-portal';
      document.body.appendChild(container);
    }
    
    setPortalContainer(container);
    
    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    // Cleanup function to remove the container when component unmounts
    return () => {
      document.body.style.overflow = '';
      if (container && !isOpen) {
        document.body.removeChild(container);
      }
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen || !portalContainer) return null;

  // Use createPortal to render the modal outside the normal DOM hierarchy
  return createPortal(
    <div 
      className="fixed inset-0 overflow-y-auto"
      style={{ 
        zIndex: zIndex,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75" 
          onClick={onClose}
          style={{ zIndex: zIndex }}
        />
        
        <div 
          className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          style={{ 
            zIndex: zIndex + 1,
            position: 'relative',
            margin: '1.5rem auto'
          }}
        >
          {title && (
            <div className="px-4 py-3 bg-gray-50 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>,
    portalContainer
  );
};

export default Modal;
