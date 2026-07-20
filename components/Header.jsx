"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiArrowRightUpLine,
  RiCloseLine,
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiWhatsappLine,
  RiInstagramLine,
  RiFacebookBoxLine,
  RiPinterestLine,
} from "react-icons/ri";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import Logo from "./Logo";
import NavMobile from "./NavMobile";
import { useCart } from "@/context/CartContext";
import { useHeroTheme } from "@/context/HeroThemeContext";

/* ─── Nav Links ─────────────────────────────────────────────────── */
const links = [
  { name: "Home",        href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "About",       href: "/about" },
  { name: "Contact",     href: "/contact" },
];

/* ─── Contact Details ───────────────────────────────────────────── */
const contactDetails = [
  {
    icon: RiPhoneLine,
    label: "Phone",
    value: "+251 911 123 456",
    href: "tel:+251911123456",
    note: "Mon – Sat, 9am – 8pm",
  },
  {
    icon: RiMailLine,
    label: "Email",
    value: "info@phoenixfurniture.et",
    href: "mailto:info@phoenixfurniture.et",
    note: "We reply within 24 hours",
  },
  {
    icon: RiMapPinLine,
    label: "Showroom",
    value: "Bole Medhanialem, Addis Ababa",
    href: "https://maps.google.com/?q=Addis+Ababa",
    note: "Open in Maps",
  },
];

const socials = [
  { icon: RiInstagramLine,   label: "Instagram", href: "https://instagram.com" },
  { icon: RiPinterestLine,   label: "Pinterest", href: "https://pinterest.com" },
  { icon: RiFacebookBoxLine, label: "Facebook",  href: "https://facebook.com"  },
];

/* ─── Contact Drawer ────────────────────────────────────────────── */
const ContactDrawer = ({ onClose }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="absolute inset-0 bg-primary/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        className="relative ml-auto h-full w-full max-w-[500px] bg-primary flex flex-col overflow-hidden"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        <span className="pointer-events-none select-none absolute -bottom-4 -right-2 font-primary text-[260px] font-light leading-none text-white/[0.025] italic" aria-hidden="true">
          L
        </span>

        <div className="flex items-center justify-between px-10 pt-10 pb-8 shrink-0">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-px w-6 bg-gold" />
            <span className="font-secondary text-[10px] font-medium tracking-[0.28em] uppercase text-gold">
              Get in Touch
            </span>
          </motion.div>
          <motion.button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 border border-white/10 text-white/40 hover:text-white hover:border-gold/50 transition-all duration-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            aria-label="Close"
          >
            <RiCloseLine size={17} />
          </motion.button>
        </div>

        <div className="px-10 mb-10 shrink-0">
          <motion.h2
            className="font-primary text-[44px] font-light text-white leading-[1.1] tracking-[-0.02em]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Elegance begins<br />
            <em className="not-italic text-shimmer">with a conversation.</em>
          </motion.h2>
          <motion.p
            className="font-secondary text-[14px] text-white/45 mt-4 leading-relaxed max-w-[300px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Our team is here to assist you with design consultations and showroom visits.
          </motion.p>
        </div>

        <motion.div
          className="mx-10 h-px bg-gradient-to-r from-gold/40 via-gold/20 to-transparent mb-8 shrink-0"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        />

        <div className="px-10 flex flex-col gap-2.5 overflow-y-auto">
          {contactDetails.map(({ icon: Icon, label, value, href, note }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 p-4 border border-white/[0.06] hover:border-gold/30 hover:bg-white/[0.03] transition-all duration-300"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.38 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-center w-10 h-10 border border-white/[0.07] group-hover:border-gold/30 group-hover:bg-gold/10 transition-all duration-300 shrink-0">
                <Icon size={17} className="text-white/30 group-hover:text-gold transition-colors duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-secondary text-[10px] font-medium tracking-[0.2em] uppercase text-white/25 mb-0.5">{label}</p>
                <p className="font-secondary text-[14px] font-medium text-white/70 group-hover:text-white truncate transition-colors duration-200">{value}</p>
                <p className="font-secondary text-[11px] text-white/25 mt-0.5">{note}</p>
              </div>
              <RiArrowRightUpLine size={14} className="shrink-0 text-white/15 group-hover:text-gold transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          ))}
        </div>

        <motion.div
          className="mt-auto px-10 pb-10 pt-8 shrink-0"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.4 }}
        >
          <div className="h-px bg-white/[0.07] mb-7" />
          <p className="font-secondary text-[10px] font-medium tracking-[0.22em] uppercase text-white/25 mb-4">Follow Us</p>
          <div className="flex items-center gap-2.5">
            {socials.map(({ icon: Icon, label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-10 h-10 border border-white/[0.08] text-white/30 hover:text-gold hover:border-gold/40 transition-all duration-200"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.66 + i * 0.06 }}
              >
                <Icon size={17} />
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-7">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="font-primary italic text-[13px] text-white/20">Phoenix Furniture</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>
          <p className="font-secondary text-[11px] text-white/20 mt-3 tracking-wide">
            Design Consultation · Exclusive Collections
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Header ────────────────────────────────────────────────────── */
const Header = () => {
  const [scrolled, setScrolled]       = useState(false);
  const [hidden, setHidden]           = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mounted, setMounted]         = useState(false);
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const { heroTheme } = useHeroTheme();
  
  const { scrollY } = useScroll();

  useEffect(() => { setMounted(true); }, []);

  /* Smart Navigation Logic */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 80) {
      setScrolled(true);
      if (latest > previous && latest > 250) {
        setHidden(true); // Hide when scrolling down
      } else {
        setHidden(false); // Show when scrolling up
      }
    } else {
      setScrolled(false);
      setHidden(false);
    }
  });

  // Determine if text should be dark based on scroll state and hero theme
  // When scrolled, we use the dark luxury pill, so text is always LIGHT (isDarkText = false)
  const isDarkText = scrolled ? false : (!heroTheme.isActive || heroTheme.textColor === "dark");

  /* Scroll lock — only runs when drawer is open */
  useEffect(() => {
    if (!contactOpen) return;
    const y = window.scrollY;
    document.body.dataset.scrollY = String(y);
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    return () => {
      const savedY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo({ top: savedY, behavior: "instant" });
    };
  }, [contactOpen]);

  return (
    <>
      <div className="fixed left-0 right-0 z-50 pointer-events-none px-4 lg:px-8 flex justify-center">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: hidden ? -150 : 0, opacity: hidden ? 0 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} // luxury ease
          className={`pointer-events-auto w-full transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            scrolled 
              ? 'max-w-[1100px] bg-primary/95 backdrop-blur-2xl ring-1 ring-white/10 rounded-full shadow-elevated mt-4 md:mt-6 py-2 md:py-2.5 px-4 md:px-6 lg:px-8'
              : 'max-w-[1400px] bg-transparent ring-1 ring-transparent mt-0 py-4 md:py-5 px-4 lg:px-8'
          }`}
        >
          <div className="flex items-center justify-between gap-6">
            <div className={`transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${scrolled ? 'scale-90 origin-left' : 'scale-100 origin-left'}`}>
              <Logo isDarkText={isDarkText} />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-8">
              <ul className="flex items-center gap-1">
                {links.map(({ name, href }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={name}>
                      <Link
                        href={href}
                        className="relative flex items-center px-4 py-2 group"
                      >
                        <span className={[
                          "font-secondary text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors duration-400 select-none",
                          isActive
                            ? (isDarkText ? "text-primary" : "text-gold")
                            : isDarkText
                              ? "text-secondary/60 group-hover:text-primary"
                              : "text-white/70 group-hover:text-white",
                        ].join(" ")}>
                          {name}
                        </span>
                        
                        {/* Animated Underline */}
                        <span
                          className={[
                            "absolute bottom-1.5 left-4 right-4 h-[1px]",
                            isActive ? (isDarkText ? "bg-primary" : "bg-gold") : (isDarkText ? "bg-primary/50" : "bg-gold/70"),
                            "transform origin-left transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          ].join(" ")}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className={`w-px h-4 transition-colors duration-500 ${isDarkText ? 'bg-secondary/15' : 'bg-white/15'}`} />

              <div className="flex items-center gap-5">
                {/* Cart Button */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className={`relative p-2 rounded-full transition-colors duration-400 ${
                    isDarkText 
                      ? 'text-secondary/70 hover:text-primary hover:bg-primary/5' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label="Open Cart"
                >
                  <PiShoppingCartSimpleBold size={20} />
                  {mounted && cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0 right-0 w-4 h-4 bg-gold rounded-full flex items-center justify-center text-[9px] font-bold text-primary shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </button>

                {/* Showroom CTA */}
                <Link href="/showroom">
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative flex items-center gap-3 overflow-hidden px-6 py-2.5 rounded-full font-secondary text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] bg-gold text-primary shadow-[0_4px_24px_rgba(217,182,110,0.35)] hover:shadow-[0_6px_32px_rgba(217,182,110,0.45)]"
                  >
                    <span className="relative z-10">Visit Showroom</span>
                    <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 bg-primary/15 group-hover:bg-primary/25">
                      <RiArrowRightUpLine size={13} className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:rotate-45" />
                    </span>
                  </motion.button>
                </Link>
              </div>
            </nav>

            {/* Mobile Nav */}
            <div className="xl:hidden">
              <NavMobile isDarkText={isDarkText} />
            </div>
          </div>
        </motion.header>
      </div>

      {/* Contact Drawer Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {contactOpen && <ContactDrawer onClose={() => setContactOpen(false)} />}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Header;