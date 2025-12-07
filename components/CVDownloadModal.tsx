'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CVDownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CVDownloadModal = ({ isOpen, onClose }: CVDownloadModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-6"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/50 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md border border-white/10"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Content */}
                            <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
                                {/* Icon Header */}
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-white/10 mb-2">
                                    <span className="text-3xl">📄</span>
                                </div>

                                {/* Title & Desc */}
                                <div>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-sky-300 bg-clip-text text-transparent mb-2">
                                        Download CV
                                    </h2>
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        Get a detailed copy of my resume including work experience, skills, and education history.
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="w-full space-y-3">
                                    {/* PDF Download */}
                                    <a
                                        href="/images/CV TAJI JADDA GIRAS SENTOSA.pdf"
                                        download="CV_Taji_Jadda_Giras_Sentosa.pdf"
                                        className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none block"
                                        onClick={() => {
                                            setTimeout(onClose, 1000);
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 transition-all duration-300 group-hover:scale-105"></div>
                                        <div className="relative bg-[#0f0f0f] hover:bg-black/80 text-white rounded-[11px] px-6 py-3.5 transition-colors flex items-center justify-center gap-2 font-medium">
                                            <span>Download PDF</span>
                                            <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </div>
                                    </a>

                                    {/* JPG Download */}
                                    <a
                                        href="/images/CV TAJI JADDA GIRAS SENTOSA.jpg"
                                        download="CV_Taji_Jadda_Giras_Sentosa.jpg"
                                        className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none block"
                                        onClick={() => {
                                            setTimeout(onClose, 1000);
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-300 group-hover:scale-105"></div>
                                        <div className="relative bg-[#0f0f0f] hover:bg-black/80 text-white rounded-[11px] px-6 py-3.5 transition-colors flex items-center justify-center gap-2 font-medium">
                                            <span>Download JPG</span>
                                            <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </div>
                                    </a>
                                </div>

                                <div className="text-xs text-white/30 pt-2">
                                    Last updated: December 2025
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CVDownloadModal;
