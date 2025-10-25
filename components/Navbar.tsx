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
    const handleScroll = () => {
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
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Backdrop blur dengan gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/90 backdrop-blur-md border-b border-cyan-500/20"></div>
      
      <nav className="relative container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo dengan glow effect */}
          <Link href="/" className="group shrink-0">
            <div className="relative">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110 inline-block">
                Portfolio
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Navigation Menu dengan pill style */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 bg-white/5 backdrop-blur-sm rounded-full px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 border border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`relative px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeSection === item.href
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
                {activeSection === item.href && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 blur-md opacity-50 animate-pulse"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
