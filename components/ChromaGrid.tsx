'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import React from 'react';
import FadeIn from './FadeIn';
import Image from 'next/image';

interface ChromaGridItem {
    id?: number;
    image: string;
    title: string;
    subtitle: string;
    handle?: string;
    location?: string;
    borderColor?: string;
    gradient?: string;
    url?: string;
}

interface ChromaGridProps {
    items?: ChromaGridItem[];
    className?: string;
    radius?: number;
    damping?: number;
    fadeOut?: number;
    ease?: string;
    onProjectClick?: (item: ChromaGridItem) => void;
}

const ChromaGrid: React.FC<ChromaGridProps> = React.memo(({ items = [], className = '', radius = 300, damping = 0.45, fadeOut = 0.6, ease = 'power3.out', onProjectClick }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const setX = useRef<((value: number) => void) | null>(null);
    const setY = useRef<((value: number) => void) | null>(null);
    const pos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        setX.current = gsap.quickSetter(el, '--x', 'px') as (value: number) => void;
        setY.current = gsap.quickSetter(el, '--y', 'px') as (value: number) => void;
        const { width, height } = el.getBoundingClientRect();
        pos.current = { x: width / 2, y: height / 2 };
        setX.current(pos.current.x);
        setY.current(pos.current.y);
    }, []);

    const moveTo = useCallback((x: number, y: number) => {
        gsap.to(pos.current, {
            x,
            y,
            duration: damping,
            ease,
            onUpdate: () => {
                setX.current?.(pos.current.x);
                setY.current?.(pos.current.y);
            },
            overwrite: true
        });
    }, [damping, ease]);

    const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!rootRef.current) return;
        const r = rootRef.current.getBoundingClientRect();
        moveTo(e.clientX - r.left, e.clientY - r.top);
        if (fadeRef.current) {
            gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
        }
    }, [moveTo]);

    const handleLeave = useCallback(() => {
        if (fadeRef.current) {
            gsap.to(fadeRef.current, {
                opacity: 1,
                duration: fadeOut,
                overwrite: true
            });
        }
    }, [fadeOut]);

    const handleCardClick = useCallback((item: ChromaGridItem) => {
        if (onProjectClick) {
            onProjectClick(item);
        } else if (item.url) {
            window.open(item.url, '_blank', 'noopener,noreferrer');
        }
    }, [onProjectClick]);

    const handleCardMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const c = e.currentTarget as HTMLElement;
        const rect = c.getBoundingClientRect();
        c.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        c.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }, []);

    return (
        <div
            ref={rootRef}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            className={`relative w-full h-full flex flex-wrap justify-center items-start gap-3 ${className}`}
            style={{
                '--r': `${radius}px`,
                '--x': '50%',
                '--y': '50%'
            } as React.CSSProperties}
        >
            {items.map((c, i) => (
                <FadeIn
                    key={i}
                    delay={0.1 + (i * 0.1)}
                    direction="up"
                >
                    <article
                        onMouseMove={handleCardMove}
                        onClick={() => handleCardClick(c)}
                        className="group relative flex flex-col w-[380px] h-[380px] rounded-[20px] overflow-hidden border-2 border-transparent transition-colors duration-300 cursor-pointer"
                        style={{
                            '--card-border': c.borderColor || 'transparent',
                            background: c.gradient,
                            '--spotlight-color': 'rgba(255,255,255,0.3)'
                        } as React.CSSProperties}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
                            style={{
                                background:
                                    'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)'
                            }}
                        />
                        <div className="relative z-10 h-[270px] p-[10px] box-border">
                            <div className="relative w-full h-full rounded-[10px] overflow-hidden">
                                <Image
                                    src={c.image}
                                    alt={c.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                                    className="object-cover"
                                    loading={i < 3 ? 'eager' : 'lazy'}
                                    quality={85}
                                />
                            </div>
                        </div>
                        <footer className="relative z-10 p-3 text-white font-sans grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
                            <h3 className="m-0 text-[1.05rem] font-semibold">{c.title}</h3>
                            {c.handle && <span className="text-[0.95rem] opacity-80 text-right">{c.handle}</span>}
                            <p className="m-0 text-[0.85rem] opacity-85">{c.subtitle}</p>
                            {c.location && <span className="text-[0.85rem] opacity-85 text-right">{c.location}</span>}
                        </footer>
                    </article>
                </FadeIn>
            ))}
            <div
                className="absolute inset-0 pointer-events-none z-30"
                style={{
                    backdropFilter: 'grayscale(1) brightness(0.78)',
                    WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
                    background: 'rgba(0,0,0,0.001)',
                    willChange: 'transform, opacity',
                    maskImage:
                        'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)',
                    WebkitMaskImage:
                        'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)'
                }}
            />
            <div
                ref={fadeRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40"
                style={{
                    backdropFilter: 'grayscale(1) brightness(0.78)',
                    WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
                    background: 'rgba(0,0,0,0.001)',
                    willChange: 'opacity',
                    maskImage:
                        'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)',
                    WebkitMaskImage:
                        'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)',
                    opacity: 1
                }}
            />
        </div>
    );
});

ChromaGrid.displayName = 'ChromaGrid';

export default ChromaGrid;
