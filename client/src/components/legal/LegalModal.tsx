import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import TermsOfUse from './TermsOfUse';
import PrivacyPolicy from './PrivacyPolicy';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;
  
  // Create a portal container if it doesn't exist
  let container = document.getElementById('legal-modal-portal');
  if (!container) {
    container = document.createElement('div');
    container.id = 'legal-modal-portal';
    document.body.appendChild(container);
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-[10000] relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        
        {/* Content */}
        <div className="p-6">
          {type === 'terms' ? <TermsOfUse /> : <PrivacyPolicy />}
        </div>
      </div>
    </div>,
    container
  );
};

export default LegalModal;
