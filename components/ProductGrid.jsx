"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PiMagnifyingGlassLight, 
  PiSlidersHorizontalLight,
  PiCaretDownLight,
  PiStarLight,
  PiLightningLight,
  PiFireLight
} from "react-icons/pi";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import ProductModal from "./ProductModal";

const categories = ["All", "Living Room", "Bedroom", "Dining Area", "Home Office"];
const types = ["All Types", "Sofa", "Chair", "Table", "Bed", "Storage", "Desk"];
const prices = ["All Prices", "Under 100,000 ETB", "100,000 - 200,000 ETB", "200,000+ ETB"];

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
};

const DropdownFilter = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative group ${isOpen ? "z-50" : "z-20"}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-4 border font-secondary text-[11px] font-semibold tracking-[0.2em] uppercase rounded-full py-3 pl-6 pr-5 transition-all duration-500 cursor-pointer w-full sm:w-auto min-w-[180px] ${
          isOpen 
            ? "border-gold/40 bg-white shadow-[0_8px_30px_rgba(201,168,76,0.12)] text-secondary" 
            : "border-secondary/10 bg-white/40 hover:border-gold/30 hover:bg-white/80 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-secondary/80 hover:text-secondary"
        }`}
      >
        <span className="truncate">{value}</span>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`${isOpen ? "text-gold" : "text-secondary/40 group-hover:text-gold/70"} transition-colors shrink-0`}
        >
          <PiCaretDownLight size={14} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[calc(100%+8px)] left-0 w-full sm:min-w-[220px] origin-top bg-white/95 backdrop-blur-2xl border border-secondary/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden z-50 p-1.5"
          >
            <div className="flex flex-col max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-secondary/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`relative flex items-center w-full text-left px-4 py-3 rounded-xl font-secondary text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 group/item overflow-hidden ${
                    value === opt 
                      ? "bg-gold/5 text-gold" 
                      : "text-secondary/60 hover:bg-secondary/[0.03] hover:text-secondary"
                  }`}
                >
                  <span className={`transform transition-transform duration-300 ${value !== opt ? "group-hover/item:translate-x-1.5" : ""}`}>
                    {opt}
                  </span>
                  
                  {/* Subtle active indicator dot */}
                  {value === opt && (
                    <motion.div 
                      layoutId="activeDot"
                      className="absolute right-4 w-1.5 h-1.5 rounded-full bg-gold"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToggleChip = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full font-secondary text-[10px] font-bold tracking-widest uppercase transition-all duration-300 border ${
      active 
        ? "bg-gold/10 border-gold/50 text-gold shadow-[0_0_15px_rgba(217,182,110,0.15)]" 
        : "bg-transparent border-secondary/20 text-secondary/60 hover:border-secondary/40 hover:text-secondary"
    }`}
  >
    <Icon size={14} className={active ? "text-gold" : ""} />
    {label}
  </button>
);

const ProductGrid = () => {
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All Types");
  const [activePrice, setActivePrice] = useState("All Prices");
  
  // Toggles
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  const { products, isLoaded } = useProducts();

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    if (!isLoaded) return [];

    const typeMatchMap = {
      "Sofa": ["sofa", "sectional", "lounge"],
      "Chair": ["chair", "recliner", "ottoman", "stool"],
      "Table": ["table", "console", "credenza", "desk"],
      "Bed": ["bed", "headboard", "nightstand"],
      "Storage": ["dresser", "wardrobe", "cabinet", "bookshelf", "shelves"],
      "Desk": ["desk"]
    };

    return products.filter((product) => {
      // 1. Search Query
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Category
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      
      // 3. Type
      let matchesType = activeType === "All Types";
      if (!matchesType && typeMatchMap[activeType]) {
        matchesType = typeMatchMap[activeType].some(keyword => product.name.toLowerCase().includes(keyword));
      }
      
      // 4. Price
      let matchesPrice = true;
      if (activePrice === "Under 100,000 ETB") matchesPrice = product.price < 100000;
      else if (activePrice === "100,000 - 200,000 ETB") matchesPrice = product.price >= 100000 && product.price <= 200000;
      else if (activePrice === "200,000+ ETB") matchesPrice = product.price > 200000;

      // 5. Toggles
      const matchesBestSeller = !isBestSeller || product.bestSeller;
      const matchesNew = !isNewArrival || product.isNew;
      const matchesFeatured = !isFeatured || product.featured;

      return matchesSearch && matchesCategory && matchesType && matchesPrice && matchesBestSeller && matchesNew && matchesFeatured;
    });
  }, [searchQuery, activeCategory, activeType, activePrice, isBestSeller, isNewArrival, isFeatured]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveType("All Types");
    setActivePrice("All Prices");
    setIsBestSeller(false);
    setIsNewArrival(false);
    setIsFeatured(false);
  };

  return (
    <>
      <section className="py-12 md:py-20 bg-transparent min-h-screen">
        <div className="container">
          
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 border-b border-secondary/10 pb-8">
            <div className="max-w-xl">
              <h1 className="font-primary text-[36px] md:text-[48px] font-light text-secondary leading-tight mb-4">
                Our <em className="text-gold not-italic font-semibold">Products</em>
              </h1>
              <p className="font-secondary text-[14px] md:text-[16px] text-secondary/70 leading-relaxed">
                Browse our entire collection. Filter by precise attributes to find the perfect piece for your space.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary/60 group-focus-within:text-gold transition-colors">
                  <PiMagnifyingGlassLight size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-[300px] bg-white/50 border border-secondary/20 text-secondary font-secondary text-[13px] rounded-full py-3 pl-11 pr-4 focus:outline-none focus:border-gold/50 focus:bg-white/70 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Advanced Filter Bar */}
          <div className="flex flex-col xl:flex-row gap-8 mb-12 bg-white/60 backdrop-blur-md border border-secondary/10 rounded-[32px] p-6 lg:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.03)]">
            
            {/* Top row: Categories (Rooms) */}
            <div className="flex flex-wrap items-center gap-2 xl:pr-8 xl:border-r border-secondary/20">
              <div className="flex items-center gap-2 mr-3 text-secondary/40">
                <PiSlidersHorizontalLight size={20} />
                <span className="font-secondary text-[11px] font-bold tracking-[0.2em] uppercase">Room</span>
              </div>
              <div className="flex flex-wrap gap-1 bg-secondary/[0.03] p-1.5 rounded-full border border-secondary/5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-5 py-2.5 rounded-full font-secondary text-[10px] font-bold tracking-[0.15em] uppercase transition-colors duration-500 ${
                      activeCategory === cat 
                        ? "text-white" 
                        : "text-secondary/60 hover:text-secondary"
                    }`}
                  >
                    {activeCategory === cat && (
                      <motion.div
                        layoutId="activeCategoryBg"
                        className="absolute inset-0 bg-primary rounded-full shadow-lg"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdowns & Toggles */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 flex-1">
              <DropdownFilter label="Type" options={types} value={activeType} onChange={setActiveType} />
              <DropdownFilter label="Price" options={prices} value={activePrice} onChange={setActivePrice} />
              
              <div className="hidden sm:block w-px h-8 bg-secondary/10 mx-3" />

              <ToggleChip active={isBestSeller} onClick={() => setIsBestSeller(!isBestSeller)} icon={PiFireLight} label="Best Sellers" />
              <ToggleChip active={isNewArrival} onClick={() => setIsNewArrival(!isNewArrival)} icon={PiLightningLight} label="New Arrivals" />
              <ToggleChip active={isFeatured} onClick={() => setIsFeatured(!isFeatured)} icon={PiStarLight} label="Featured" />
            </div>

          </div>

          {/* Active Filters Summary (Optional clear button) */}
          {(searchQuery || activeCategory !== "All" || activeType !== "All Types" || activePrice !== "All Prices" || isBestSeller || isNewArrival || isFeatured) && (
            <div className="flex items-center gap-4 mb-8">
              <span className="font-secondary text-[11px] text-secondary/60 tracking-widest uppercase">
                {filteredProducts.length} Results
              </span>
              <button 
                onClick={clearFilters}
                className="font-secondary text-[10px] font-bold tracking-widest uppercase text-gold hover:text-secondary transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Product Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.div
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key={product.id}
                    className="group flex flex-col h-full cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="relative w-full aspect-[4/5] bg-white/50 rounded-xl overflow-hidden mb-4">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="bg-primary text-white font-secondary text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                            New
                          </span>
                        )}
                        {product.bestSeller && (
                          <span className="bg-gold text-primary font-secondary text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                            Best Seller
                          </span>
                        )}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="font-secondary text-[11px] font-bold tracking-[0.2em] uppercase text-primary bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-secondary/10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                          View Details
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="font-primary text-[20px] text-secondary leading-tight group-hover:text-gold transition-colors">
                          {product.name}
                        </h3>
                        <span className="font-secondary text-[14px] text-secondary whitespace-nowrap">
                          {product.price.toLocaleString()} ETB
                        </span>
                      </div>
                      <p className="font-secondary text-[13px] text-secondary/70 line-clamp-2 mb-4">
                        {product.description}
                      </p>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="mt-auto self-start px-5 py-2.5 bg-white/50 hover:bg-gold text-secondary hover:text-primary rounded-full transition-all duration-300 font-secondary text-[10px] font-bold tracking-wider uppercase border border-secondary/20 hover:border-gold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 flex flex-col items-center justify-center text-center border border-secondary/10 rounded-2xl bg-white/40"
                >
                  <PiMagnifyingGlassLight className="text-4xl text-secondary/40 mb-4" />
                  <h3 className="font-primary text-2xl text-secondary mb-2">No products found</h3>
                  <p className="font-secondary text-secondary/70 text-[14px] max-w-md">
                    We couldn't find any products matching your current filters. Try adjusting your selections to see more results.
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="mt-6 px-6 py-2 border border-gold/50 text-gold font-secondary text-[11px] tracking-widest uppercase rounded-full hover:bg-gold hover:text-primary transition-colors"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />
    </>
  );
};

export default ProductGrid;
