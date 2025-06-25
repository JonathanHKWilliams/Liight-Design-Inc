import React from 'react';

const ComingSoonContent: React.FC = () => {
  return (
    <div className="space-y-8 animate-slide-up px-4 sm:px-6 md:px-0 max-w-4xl mx-auto text-center">
      <div>
        <h2 className="font-changa text-5xl md:text-6xl lg:text-7xl font-bold text-secondary mb-4 leading-tight">
          Coming Soon!
        </h2>
        <h3 className="font-changa text-3xl md:text-4xl font-semibold text-white mb-6">
          Thanks for Stopping By!
        </h3>
      </div>

      <div className="max-w-md mx-auto">
        <p className="font-poppins text-lg text-gray-300 leading-relaxed">
          We're currently working behind the scenes to launch something bold, creative, and powerful.
        </p>
      </div>
    </div>
  );
};

export default ComingSoonContent;
