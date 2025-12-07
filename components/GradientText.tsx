import React from 'react';

interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
    from?: string;
    via?: string;
    to?: string;
}

export default function GradientText({
    children,
    className = "",
    from = "from-white",
    via = "via-cyan-100",
    to = "to-sky-300"
}: GradientTextProps) {
    return (
        <h2 className={`font-bold bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] ${className}`}>
            {children}
        </h2>
    );
}
