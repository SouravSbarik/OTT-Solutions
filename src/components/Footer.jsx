import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#FEF8E6] pt-10 pb-10 font-sans">
      
      {/* 1. Top Title */}
      <div className="text-center mb-6">
        <h2 className="text-4xl text-black">Tune O</h2>
      </div>

      {/* 2. Middle Image Banner */}
      {/* Replace 'banner-image-path.png' with your actual file path */}
      <div className="w-full mb-8">
        <img 
          src="../../public/main.png" 
          alt="Musical Instruments Banner" 
          className="w-full h-auto object-cover"
        />
      </div>

      {/* 3. Bottom Content Area */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-0">
        
        {/* Left: Navigation Links */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-gray-700 text-sm font-medium">
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a href="/" className="hover:text-black hover:underline">Home</a>
            <a href="/repertoire" className="hover:text-black hover:underline">Repertoire</a>
            <a href="/newSongs" className="hover:text-black hover:underline">New Songs Release</a>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a href="/resource" className="hover:text-black hover:underline">Resource</a>
            <a href="/contact" className="hover:text-black hover:underline">Contact</a>
          </div>
        </div>

        {/* Center: Logo */}
        {/* Replace 'logo-path.png' with your actual file path */}
        <div className="flex flex-col items-center">
          <img 
            src="../../public/OTT.png" 
            alt="OTT Solutions Logo" 
            className="w-16 h-auto mb-1"
          />
          <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wide">
            OTT Solutions
          </span>
        </div>

        {/* Right: Contact Information */}
        <div className="text-center md:text-right">
          <p className="text-[#556b2f] text-lg mb-1">
            OTT Solutions Private Limited
          </p>
          <p className="text-black font-normal">
            Landline : +913335109301
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;