"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiXLight, PiCheckCircleFill, PiShoppingCartSimpleBold } from "react-icons/pi";
import { useCart } from "../context/CartContext";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut", delay: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20, 
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
  },
};

const ProductModal = ({ isOpen, onClose, product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  // Reset state when a new product is opened
  useEffect(() => {
    if (isOpen) {
      setActiveImageIndex(0);
      setIsAdded(false);
    }
  }, [isOpen, product]);

  const handleAddToCart = () => {
    if (isAdded) return;
    addToCart(product);
    setIsAdded(true);
    // Automatically reset after 2.5 seconds
    setTimeout(() => setIsAdded(false), 2500);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 xl:p-12 bg-black/80 backdrop-blur-2xl"
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl h-auto max-h-[95vh] bg-primary/95 backdrop-blur-3xl border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 group flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] hover:bg-gold hover:border-gold transition-all duration-300 backdrop-blur-md"
              aria-label="Close modal"
            >
              <PiXLight className="text-white/70 group-hover:text-primary text-xl transition-colors duration-300" />
            </button>

            {/* Left: Image Gallery */}
            <div className="w-full md:w-[55%] flex flex-col p-6 xl:p-10 bg-white/[0.02] border-r border-white/[0.04]">
              {/* Main Image */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-muted/30 mb-6">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={product.images[activeImageIndex]}
                    alt={`${product.name} - View ${activeImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                </AnimatePresence>
              </div>

              {/* Thumbnail Rail */}
              <div className="flex items-center gap-3 overflow-x-auto py-1 px-1 [&::-webkit-scrollbar]:hidden snap-x">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={[
                      "group relative w-20 h-16 xl:w-24 xl:h-20 shrink-0 rounded-md overflow-hidden transition-all duration-300 snap-start",
                      activeImageIndex === idx 
                        ? "ring-1 ring-gold ring-offset-2 ring-offset-primary opacity-100" 
                        : "opacity-40 hover:opacity-100"
                    ].join(" ")}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {activeImageIndex !== idx && <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="w-full md:w-[45%] flex flex-col p-8 xl:p-12 overflow-y-auto custom-scrollbar">
              <span className="font-secondary text-[10px] font-semibold tracking-[0.2em] uppercase text-gold mb-3">
                {product.category}
              </span>
              
              <h2 className="font-primary text-[32px] md:text-[40px] font-medium text-white leading-[1.1] mb-4">
                {product.name}
              </h2>
              
              <div className="font-secondary text-[22px] text-white/90 mb-8">
                {product.price.toLocaleString()} ETB
              </div>
              
              <div className="w-12 h-px bg-gold/50 mb-8" />

              <p className="font-secondary text-[15px] text-white/60 leading-relaxed mb-10">
                {product.description}
              </p>

              {/* Features / Details */}
              <div className="flex flex-col gap-4 mb-12">
                <div className="flex justify-between border-b border-white/[0.06] pb-3">
                  <span className="font-secondary text-[13px] text-white/40 uppercase tracking-wider">Materials</span>
                  <span className="font-secondary text-[13px] text-white/80">{product.materials || "Premium wood & fabric"}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-3">
                  <span className="font-secondary text-[13px] text-white/40 uppercase tracking-wider">Dimensions</span>
                  <span className="font-secondary text-[13px] text-white/80">{product.dimensions || "W 84\" x D 36\" x H 34\""}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-3">
                  <span className="font-secondary text-[13px] text-white/40 uppercase tracking-wider">Availability</span>
                  <span className="font-secondary text-[13px] text-emerald-400">In Stock</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={[
                    "relative w-full h-14 flex items-center justify-center gap-3 rounded-full overflow-hidden transition-all duration-300",
                    isAdded 
                      ? "bg-emerald-500 text-white cursor-default"
                      : "bg-gold text-primary border border-gold hover:bg-transparent hover:text-gold hover:shadow-gold-glow"
                  ].join(" ")}
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.div
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 font-secondary text-[12px] font-semibold tracking-[0.15em] uppercase"
                      >
                        <PiCheckCircleFill size={18} />
                        Added to Cart
                      </motion.div>
                    ) : (
                      <motion.div
                        key="add"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 font-secondary text-[12px] font-semibold tracking-[0.15em] uppercase"
                      >
                        <PiShoppingCartSimpleBold size={16} />
                        Add to Cart
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
