"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useHeroTheme } from "@/context/HeroThemeContext";
import { useProducts } from "@/context/ProductContext";

// We define custom themes for the first 4 products to change the aesthetic dynamically
const heroThemes = [
  { bg: "#A2AB93", text: "dark", heroText: "#EAE5D9" },  // Green Sofa Theme
  { bg: "#DAB8B8", text: "dark", heroText: "#F8F1F1" },  // Pink Sofa Theme
  { bg: "#DFD2C1", text: "dark", heroText: "#FDFBF7" },  // Beige Sofa Theme
  { bg: "#803535", text: "light", heroText: "#F5E6E6" }, // Red Velvet Sofa Theme
];

const Hero = () => {
  const { setHeroTheme } = useHeroTheme();
  const { products, isLoaded } = useProducts();

  const heroImages = [
    "/assets/img/hero/green-chair.jpeg",
    "/assets/img/hero/pink-chair.jpeg",
    "/assets/img/hero/beige-chair.jpeg",
    "/assets/img/hero/red-chair.jpeg",
  ];

  // Combine products with their themes and override images
  const heroProducts = (isLoaded && products.length >= 4 ? products : []).slice(0, 4).map((p, i) => ({
    ...p,
    images: [heroImages[i]],
    theme: heroThemes[i] || heroThemes[0],
  }));

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = heroProducts[activeIndex];

  // Dispatch active theme to Header
  useEffect(() => {
    let mounted = true;
    if (activeProduct) {
      setTimeout(() => {
        if (mounted) {
          setHeroTheme({
            isActive: true,
            bgColor: activeProduct.theme.bg,
            textColor: activeProduct.theme.text,
          });
        }
      }, 0);
    }
    return () => {
      mounted = false;
      setTimeout(() => {
        setHeroTheme(prev => ({ ...prev, isActive: false }));
      }, 0);
    };
  }, [activeIndex, activeProduct, setHeroTheme]);

  if (!isLoaded || heroProducts.length === 0) {
    return <div className="w-full h-screen bg-[#A2AB93]" />;
  }

  return (
    <section 
      className="relative w-full min-h-[100svh] flex items-center overflow-hidden pt-28 md:pt-32 pb-10 transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: activeProduct.theme.bg }}
    >
      
      {/* Main Center Area */}
      <div className="container relative z-10 flex flex-col lg:flex-row h-full items-center justify-between">
        
        {/* Top/Left / Center Content */}
        <div className="relative w-full lg:w-[70%] h-[50vh] lg:h-[80vh] flex items-center justify-center mt-6 lg:mt-0">
          
          <AnimatePresence mode="wait">
            {/* Main Floating Image & Text Container */}
            <motion.div
              key={`main-img-${activeIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="relative w-full aspect-square flex items-center justify-center pointer-events-none"
            >
              {/* The Sofa Image */}
              <div 
                className="relative z-10 w-full h-full mix-blend-multiply"
                style={{
                  backgroundImage: `url(${activeProduct.images[0]})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            </motion.div>
          </AnimatePresence>
          
        </div>

        {/* Bottom/Right Side Cards Column */}
        <div className="flex flex-row lg:flex-col w-full lg:w-[30%] h-auto lg:h-full justify-start lg:justify-center items-center lg:items-end gap-4 lg:gap-5 xl:gap-6 pt-4 lg:pt-0 pr-0 lg:pr-4 xl:pr-8 z-20 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 [&::-webkit-scrollbar]:hidden snap-x">
          <AnimatePresence mode="popLayout">
            {heroProducts.map((product, idx) => {
              const isActive = idx === activeIndex;
              const shortName = product.name.split(" ")[0];

              return (
                <motion.div 
                  key={product.id}
                  layout
                  onClick={() => setActiveIndex(idx)}
                  className={`relative shrink-0 w-[110px] h-[130px] lg:w-[130px] lg:h-[150px] xl:w-[150px] xl:h-[170px] bg-[#FAF8F5] rounded-[24px] lg:rounded-[32px] flex flex-col items-center justify-center p-3 lg:p-4 group hover:scale-105 transition-all duration-300 shadow-xl cursor-pointer snap-center ${isActive ? 'ring-2 ring-white/50 ring-offset-4 ring-offset-transparent' : ''}`}
                >
                  {/* NEW/ACTIVE Badge */}
                  <div 
                    className="absolute top-2 lg:top-3 font-secondary text-[8px] lg:text-[9px] font-bold tracking-[0.1em] px-3 lg:px-4 py-1 rounded-full lowercase z-10 shadow-sm transition-colors duration-500"
                    style={{
                      backgroundColor: isActive ? product.theme.bg : '#44423C',
                      color: isActive ? (product.theme.text === 'dark' ? '#191816' : '#FFFFFF') : '#EFECE5'
                    }}
                  >
                    {isActive ? 'active' : 'new'}
                  </div>

                  {/* Product Image */}
                  <div className="w-[80px] h-[65px] lg:w-[100px] xl:w-[120px] lg:h-[80px] xl:h-[95px] rounded-xl overflow-hidden mt-2 lg:mt-4 relative shrink-0">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" 
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* More options Button */}
          <Link href="/collections" className="shrink-0 snap-center">
            <button className="mt-0 lg:mt-6 px-6 lg:px-8 py-3 lg:py-4 bg-[#453E32] hover:bg-[#342e24] text-[#EFECE5] font-secondary text-[12px] lg:text-[14px] rounded-full shadow-lg transition-colors duration-300 whitespace-nowrap">
              More options
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;