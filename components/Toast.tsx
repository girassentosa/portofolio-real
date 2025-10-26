'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <>
      {/* Backdrop Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 opacity-100"></div>

      {/* Toast Modal - Center */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] animate-scale-pop">
        <div className="relative">
          {/* Outer Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl opacity-20 blur-2xl"></div>
          
          {/* Toast Content */}
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Animated Icon Container */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                {/* Background Circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20"></div>
                
                {/* Animated Circle Progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.1)"
                    strokeWidth="4"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="animate-circle-fill"
                    style={{ 
                      strokeDasharray: '283',
                      strokeDashoffset: '283',
                      animationDuration: `${duration * 0.8}ms`
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Checkmark Icon with Rotate Animation */}
                <div className="absolute inset-0 flex items-center justify-center animate-checkmark-rotate">
                  <svg 
                    className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M5 13l4 4L19 7"
                      className="animate-draw-checkmark"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Message */}
              <div className="space-y-1">
                <p className="text-white font-semibold text-base sm:text-lg">
                  Berhasil!
                </p>
                <p className="text-white/70 text-sm sm:text-base max-w-xs">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

