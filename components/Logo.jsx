"use client";
import Link from "next/link";

const Logo = ({ isDarkText = false }) => {
  return (
    <Link
      href="/"
      className="cursor-pointer flex items-center gap-2 select-none group"
    >
      <div 
        className={`w-[140px] h-[45px] transition-colors duration-300 ${isDarkText ? 'bg-secondary group-hover:bg-gold-dark' : 'bg-gold group-hover:bg-gold-light'}`}
        style={{
          maskImage: 'url(/assets/phoenix-logo.png)',
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'left center',
          WebkitMaskImage: 'url(/assets/phoenix-logo.png)',
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'left center',
        }}
      />
    </Link>
  );
};

export default Logo;