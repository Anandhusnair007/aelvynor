/**
 * PixelGridBackground - Tech-themed Static Grid
 * Subtle pixel grid overlay for futuristic aesthetic
 * 
 * Features:
 * - Ultra-low opacity (2%)
 * - 1px grid lines
 * - Static (no movement)
 * - Dark theme compatible
 */

'use client';

export default function PixelGridBackground() {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                zIndex: 0,
                opacity: 0.02,
                backgroundImage: `
                    linear-gradient(rgba(18, 18, 18, 1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(18, 18, 18, 1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                backgroundPosition: 'center center',
            }}
        />
    );
}
