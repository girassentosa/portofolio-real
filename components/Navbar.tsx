'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('#home');

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Project', href: '#project' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    // Scroll listener to update active section
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const sections = ['home', 'about', 'skills', 'project', 'contact'];
        const scrollPosition = window.scrollY + 300; // Increased offset for better triggering

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const offsetTop = element.offsetTop;
            const offsetBottom = offsetTop + element.offsetHeight;
            if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
              setActiveSection(`#${section}`);
              break;
            }
          }
        }
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-6 inset-x-0 z-[9999] flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          delay: 0.5 // Delay slightly to let page load first
        }}
        // RESPONSIVE UPDATE: 
        // Mobile: w-[calc(100%-2rem)] matches standard page margins (px-4)
        // Desktop: w-auto (fit content)
        // Height increased (p-2.5 mobile) to prevent "thin" look
        // Gradient Border enabled via p-[1px] wrapper
        className="pointer-events-auto relative p-[1px] rounded-full shadow-2xl shadow-cyan-500/10 w-[calc(100%-2rem)] md:w-auto overflow-hidden bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50"
      >
        {/* Inner container for background and content */}
        <div className="flex items-center justify-between md:justify-center gap-0.5 md:gap-2 p-2.5 md:p-2 lg:p-2.5 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-full w-full h-full whitespace-nowrap overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                // RESPONSIVE UPDATE: 
                // Mobile: px-2 py-3 (Taller buttons), text-xs
                // Desktop: Standard padding
                className="relative px-2 py-3 md:px-6 md:py-2.5 lg:px-7 lg:py-3 rounded-full text-xs md:text-base font-medium transition-colors duration-200 flex-1 md:flex-none text-center shrink-0"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-cyan-50' : 'text-white/60 hover:text-white'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
