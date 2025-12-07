'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import NextImage from 'next/image';

interface ChromaGridItem {
    id?: number;
    image: string;
    title: string;
    subtitle: string;
    handle?: string;
    location?: string;
    borderColor?: string;
    gradient: string;
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

const ChromaGrid: React.FC<ChromaGridProps> = ({
    items,
    className = '',
    radius = 300,
    damping = 0.45,
    fadeOut = 0.6,
    ease = 'power3.out',
    onProjectClick
}) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const setX = useRef<Function | null>(null);
    const setY = useRef<Function | null>(null);
    const pos = useRef({ x: 0, y: 0 });

    const demo: ChromaGridItem[] = [
        {
            image: 'https://i.pravatar.cc/300?img=8',
            title: 'Alex Rivera',
            subtitle: 'Full Stack Developer',
            handle: '@alexrivera',
            borderColor: '#4F46E5',
            gradient: 'linear-gradient(145deg,#4F46E5,#000)',
            url: 'https://github.com/'
        },
        // ... (rest of demo data unchanged - assuming standard demo data or empty)
        {
            image: 'https://i.pravatar.cc/300?img=2',
            title: 'Sarah Chen',
            subtitle: 'UI/UX Designer',
            handle: '@sarahdesign',
            location: 'San Francisco, CA',
            borderColor: '#EC4899',
            gradient: 'linear-gradient(145deg,#EC4899,#000)',
            url: 'https://dribbble.com/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=12',
            title: 'James Wilson',
            subtitle: 'DevOps Engineer',
            handle: '@jwilsonops',
            location: 'London, UK',
            borderColor: '#10B981',
            gradient: 'linear-gradient(145deg,#10B981,#000)',
            url: 'https://gitlab.com/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=8',
            title: 'Alex Rivera',
            subtitle: 'Full Stack Developer',
            handle: '@alexrivera',
            borderColor: '#4F46E5',
            gradient: 'linear-gradient(145deg,#4F46E5,#000)',
            url: 'https://github.com/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=2',
            title: 'Sarah Chen',
            subtitle: 'UI/UX Designer',
            handle: '@sarahdesign',
            location: 'San Francisco, CA',
            borderColor: '#EC4899',
            gradient: 'linear-gradient(145deg,#EC4899,#000)',
            url: 'https://dribbble.com/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=12',
            title: 'James Wilson',
            subtitle: 'DevOps Engineer',
            handle: '@jwilsonops',
            location: 'London, UK',
            borderColor: '#10B981',
            gradient: 'linear-gradient(145deg,#10B981,#000)',
            url: 'https://gitlab.com/'
        }
    ];

    const data = items?.length ? items : demo;

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        setX.current = gsap.quickSetter(el, '--x', 'px');
        setY.current = gsap.quickSetter(el, '--y', 'px');
        const { width, height } = el.getBoundingClientRect();
        pos.current = { x: width / 2, y: height / 2 };
        setX.current(pos.current.x);
        setY.current(pos.current.y);
    }, []);

    const moveTo = (x: number, y: number) => {
        gsap.to(pos.current, {
            x,
            y,
            duration: damping,
            ease,
            onUpdate: () => {
                if (setX.current) setX.current(pos.current.x);
                if (setY.current) setY.current(pos.current.y);
            },
            overwrite: true
        });
    };

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!rootRef.current) return;
        const r = rootRef.current.getBoundingClientRect();
        moveTo(e.clientX - r.left, e.clientY - r.top);
        if (fadeRef.current) {
            gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
        }
    };

    const handleLeave = () => {
        if (fadeRef.current) {
            gsap.to(fadeRef.current, {
                opacity: 1,
                duration: fadeOut,
                overwrite: true
            });
        }
    };

    const handleCardClick = (item: ChromaGridItem) => {
        if (onProjectClick) {
            onProjectClick(item);
        } else if (item.url) {
            window.open(item.url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
        const c = e.currentTarget as HTMLElement;
        const rect = c.getBoundingClientRect();
        c.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        c.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    return (
        <div
            ref={rootRef}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            className={`relative w-full h-full flex flex-wrap justify-center items-start gap-3 sm:gap-4 ${className}`}
            style={{
                ['--r' as string]: `${radius}px`,
                ['--x' as string]: '50%',
                ['--y' as string]: '50%'
            }}
        >
            {data.map((c, i) => (
                <article
                    key={i}
                    onMouseMove={handleCardMove}
                    onClick={() => handleCardClick(c)}
                    className="group relative flex flex-col w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] h-[280px] sm:h-[300px] rounded-[16px] overflow-hidden border-2 border-transparent transition-colors duration-300 cursor-pointer"
                    style={{
                        ['--card-border' as string]: c.borderColor || 'transparent',
                        background: c.gradient,
                        ['--spotlight-color' as string]: 'rgba(255,255,255,0.3)'
                    }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
                        style={{
                            background:
                                'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)'
                        }}
                    />
                    <div className="relative z-10 flex-1 p-[8px] sm:p-[10px] box-border min-h-0">
                        {/* Optimized Image */}
                        <NextImage
                            src={c.image}
                            alt={c.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="w-full h-full object-cover rounded-[8px] sm:rounded-[10px]"
                        />
                    </div>
                    <footer className="relative z-10 p-2 sm:p-3 text-white font-sans grid grid-cols-[1fr_auto] gap-x-2 gap-y-0.5">
                        <h3 className="m-0 text-xs sm:text-sm font-semibold truncate">{c.title}</h3>
                        {c.handle && <span className="text-[10px] sm:text-xs opacity-80 text-right truncate">{c.handle}</span>}
                        <p className="m-0 text-[10px] sm:text-xs opacity-85 truncate">{c.subtitle}</p>
                        {c.location && <span className="text-[10px] sm:text-xs opacity-85 text-right truncate">{c.location}</span>}
                    </footer>
                </article>
            ))}
            <div
                className="absolute inset-0 pointer-events-none z-30"
                style={{
                    backdropFilter: 'grayscale(1) brightness(0.78)',
                    WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
                    background: 'rgba(0,0,0,0.001)',
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
                    maskImage:
                        'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)',
                    WebkitMaskImage:
                        'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)',
                    opacity: 1
                }}
            />
        </div>
    );
};

export default ChromaGrid;
