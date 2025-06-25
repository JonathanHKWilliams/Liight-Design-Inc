import React from 'react';
const BackgroundImage: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80 z-10" />
      <img
        src="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
        alt="Professional workspace background"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-primary/20 z-20" />
    </div>
  );
};

export default BackgroundImage;
