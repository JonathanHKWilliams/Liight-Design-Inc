import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import DonationModal from './DonationModal';

/**
 * Button component that triggers the donation modal
 */
const DonationButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className=" d-none md:block bg-secondary hover:bg-secondary/90 text-white font-poppins font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Heart className="w-4 h-4 fill-current" />
        <span>Support Us</span>
      </button>
      
      <DonationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default DonationButton;
