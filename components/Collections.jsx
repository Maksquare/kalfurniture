"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PiArrowRightBold } from "react-icons/pi";
import Link from "next/link";
import GalleryModal from "./GalleryModal";

import { productsData } from "@/lib/data";

const categories = [
  {
    title: "Living Room",
    description: "Sofas, sectionals, and accent chairs crafted for comfort and style.",
    image: productsData["Living Room"]?.[0]?.images[0] || "/assets/img/living-room/living-room-1.jpg",
  },
  {
    title: "Bedroom",
    description: "Elegant bed frames, nightstands, and dressers for a serene sanctuary.",
    image: productsData["Bedroom"]?.[0]?.images[0] || "/assets/img/bedroom/bedroom-1.jpg",
  },
  {
    title: "Dining Area",
    description: "Tables and seating to elevate your dining experience.",
    image: productsData["Dining Area"]?.[0]?.images[0] || "/assets/img/dining-room/dining-room-1.jpg",
  },
  {
    title: "Home Office",
    description: "Desks and ergonomic seating blending productivity with design.",
    image: productsData["Home Office"]?.[0]?.images[0] || "/assets/img/home-office/home-office-1.jpg",
  },
];

const Collections = ({ hideHeader }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleOpenGallery = (categoryTitle) => {
    setSelectedCategory(categoryTitle);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-24 xl:py-32 bg-transparent">
        <div className="container">
          
          {/* Header */}
          {!hideHeader && (
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-[500px]"
              >
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="h-px w-6 bg-gold" />
                  <span className="font-secondary text-[10px] font-medium tracking-[0.28em] uppercase text-gold">
                    Our Selections
                  </span>
                </div>
                <h2 className="font-primary text-[40px] md:text-[52px] font-light text-secondary leading-[1.1] tracking-[-0.02em]">
                  Curated <em className="text-gold not-italic font-semibold">Collections.</em>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Link href="/collections">
                  <button className="group flex items-center gap-3 px-6 py-3 border border-secondary/20 bg-white/40 text-secondary/70 hover:text-secondary hover:border-gold/50 hover:bg-white/60 transition-all duration-300 font-secondary text-[11px] font-semibold tracking-[0.16em] uppercase rounded-full">
                    View All Categories
                    <PiArrowRightBold size={13} className="text-gold transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </motion.div>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                onClick={() => handleOpenGallery(cat.title)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group relative overflow-hidden h-[400px] xl:h-[500px] bg-muted/50 cursor-pointer"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 xl:p-12 flex flex-col justify-end">
                  <h3 className="font-primary text-[28px] xl:text-[36px] font-medium text-white mb-3">
                    {cat.title}
                  </h3>
                  <p className="font-secondary text-[14px] text-white/60 mb-6 max-w-[300px]">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-3 text-gold/80 font-secondary text-[11px] font-semibold tracking-[0.16em] uppercase">
                    <span>Explore</span>
                    <PiArrowRightBold size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GalleryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        category={selectedCategory} 
      />
    </>
  );
};

export default Collections;
