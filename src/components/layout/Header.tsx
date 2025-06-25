import React from 'react';
import Logo from '../layout/assets/Liight-Design-Logo.png';
import DonationButton from '../donation/DonationButton';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <a href="https://liightdesigninc.onrender.com/">
            <img src={Logo} alt="Liight Design Logo" className="w-30 h-14"/>
          </a>
          <DonationButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
