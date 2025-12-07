'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const sections = ['home', 'about', 'skills', 'project', 'contact'];
        const scrollPosition = window.scrollY + 200;

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
    handleScroll(); // Call once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      // Responsive offset untuk semua devices
      const width = window.innerWidth;
      let headerOffset;

      if (width < 640) {
        headerOffset = 55; // Mobile (< 640px)
      } else if (width < 768) {
        headerOffset = 60; // Small tablet (640px - 768px)
      } else if (width < 1024) {
        headerOffset = 85; // Medium tablet (768px - 1024px)
      } else {
        headerOffset = 100; // Desktop (≥ 1024px)
      }

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <nav className="relative container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 pointer-events-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-4">

          {/* Navigation Menu - Only Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-full shadow-lg shadow-black/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`relative px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-medium rounded-full transition-all duration-300 whitespace-nowrap ${activeSection === item.href
                  ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-50 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
