'use client';

import { motion, useInView, UseInViewOptions } from 'framer-motion';
import { useRef } from 'react';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    fullWidth?: boolean;
    className?: string;
    amount?: UseInViewOptions['amount'];
    once?: boolean;
    duration?: number;
}

export default function FadeIn({
    children,
    delay = 0,
    direction = 'up',
    fullWidth = false,
    className = '',
    amount = 0.2, // Trigger when 20% of element is visible
    once = true,
    duration = 0.5
}: FadeInProps) {
    const ref = useRef(null);

    // Optimized: Only triggers once by default to save resources after animation is done
    const isInView = useInView(ref, { once, amount });

    const getDirectionOffset = () => {
        switch (direction) {
            case 'up': return { y: 40, x: 0 };
            case 'down': return { y: -40, x: 0 };
            case 'left': return { x: 40, y: 0 };
            case 'right': return { x: -40, y: 0 };
            case 'none': return { x: 0, y: 0 };
            default: return { y: 0, x: 0 };
        }
    };

    const offset = getDirectionOffset();

    return (
        <div ref={ref} className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            <motion.div
                initial={{
                    opacity: 0,
                    x: offset.x,
                    y: offset.y
                }}
                animate={isInView ? {
                    opacity: 1,
                    x: 0,
                    y: 0
                } : {
                    opacity: 0,
                    x: offset.x,
                    y: offset.y
                }}
                transition={{
                    duration: duration,
                    delay: delay,
                    ease: [0.21, 0.47, 0.32, 0.98], // "Apple-like" ease-out

                }}
                // Will-change hint optimization for complex children
                style={{ willChange: 'opacity, transform' }}
            >
                {children}
            </motion.div>
        </div>
    );
}
