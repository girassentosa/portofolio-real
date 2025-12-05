'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types/database';
import CircularGallery from './CircularGallery';

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
    const [mounted, setMounted] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

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

    // Combine main image and gallery images
    const allImages = useMemo(() => {
        if (!project) return [];
        return Array.from(new Set([
            project.project_image_url,
            ...(project.gallery_images || [])
        ].filter(Boolean)));
    }, [project?.project_image_url, project?.gallery_images, project]);

    // Prepare items for CircularGallery
    const galleryItems = useMemo(() => allImages.map((img, index) => ({
        image: img,
        text: String(index + 1)
    })), [allImages]);

    if (!project) return null;
    if (!mounted) return null;

    // Parse tech stack from subtitle (split by comma)
    const techStack = project.project_subtitle
        ? project.project_subtitle.split(',').map(s => s.trim())
        : [];

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
                            className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md border border-white/10"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
                                {/* Top - Circular Gallery */}
                                <div className="w-full bg-black/20 relative shrink-0" style={{ height: '400px' }}>
                                    <CircularGallery
                                        items={galleryItems}
                                        bend={3}
                                        textColor="#ffffff"
                                        borderRadius={0.05}
                                        scrollEase={0.05}
                                        onItemClick={(index: number) => {
                                            const img = galleryItems[index % galleryItems.length]?.image;
                                            if (img) setPreviewImage(img);
                                        }}
                                    />
                                </div>

                                {/* Bottom - Details */}
                                <div className="w-full p-5 sm:p-6 bg-gradient-to-br from-[#0f0f0f] to-[#121212] border-t border-white/5">
                                    <div className="w-full">

                                        {/* Header */}
                                        <div className="mb-4">
                                            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-sky-300 bg-clip-text text-transparent mb-1">
                                                {project.project_title}
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Left Col - Description */}
                                            <div>
                                                {project.project_description && (
                                                    <div className="prose prose-invert prose-sm max-w-none">
                                                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2 text-base">
                                                            <span className="w-1 h-5 bg-cyan-500 rounded-full"></span>
                                                            About Project
                                                        </h3>
                                                        <p className="text-white/80 leading-relaxed text-justify text-sm sm:text-base">
                                                            {project.project_description}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Col - Tech & Buttons */}
                                            <div className="flex flex-col gap-5">
                                                {/* Tech Stack */}
                                                {techStack.length > 0 && (
                                                    <div>
                                                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2 text-base">
                                                            <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                                                            Technologies
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {techStack.map((tech, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/80 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                                                                >
                                                                    {tech}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex flex-col sm:flex-row gap-3 mt-auto">

                                                    {/* GitHub Button */}
                                                    {project.project_url && (
                                                        <a
                                                            href={project.project_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full sm:w-1/2 px-4 py-3 font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                            </svg>
                                                            GitHub Repo
                                                        </a>
                                                    )}

                                                    {/* Live Demo Button */}
                                                    {project.demo_url && (
                                                        <a
                                                            href={project.demo_url}
                                                            target="_blank"
                                                            className={`w-full ${project.project_url ? 'sm:w-1/2' : 'w-full'} px-4 py-3 font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20`}
                                                        >
                                                            <span>🚀</span> Live Demo
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Image Preview Overlay */}
                    {previewImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPreviewImage(null)}
                            className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
                        >
                            {/* Simple Close Button */}
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="absolute top-6 right-6 z-[10001] text-white/70 hover:text-white transition-colors"
                            >
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <motion.img
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                src={previewImage}
                                alt="Preview"
                                onClick={(e) => e.stopPropagation()}
                                className="max-w-full max-h-[80vh] object-contain rounded-sm"
                            />
                        </motion.div>
                    )}
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ProjectModal;
