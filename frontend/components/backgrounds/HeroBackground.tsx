/**
 * HeroBackground - Composite Background Animation System
 * World-class layered animation inspired by Render.com, Tessat.space, Vercel.com
 * 
 * Layer Stack (bottom to top):
 * - PixelGridBackground (z-0)
 * - GradientLights (z-10)
 * - FloatingBoxes (z-20)
 * - Hero Content (z-30)
 * 
 * Features:
 * - Proper z-index layering
 * - GPU-accelerated animations
 * - Zero layout shift
 * - Cinematic depth and lighting
 * - Clean, minimal, futuristic look
 */

'use client';

import PixelGridBackground from './PixelGridBackground';
import GradientLights from './GradientLights';
import FloatingBoxes from './FloatingBoxes';

export default function HeroBackground() {
    return (
        <div
            className="absolute inset-0 overflow-hidden"
            style={{
                // Ensure background stays behind content
                zIndex: 0,
                // GPU acceleration
                transform: 'translate3d(0, 0, 0)',
                willChange: 'transform',
            }}
        >
            {/* Layer 1: Pixel Grid - Static foundation */}
            <div style={{ zIndex: 0 }}>
                <PixelGridBackground />
            </div>

            {/* Layer 2: Gradient Lights - Atmospheric depth */}
            <div style={{ zIndex: 10 }}>
                <GradientLights />
            </div>

            {/* Layer 3: Floating Boxes - Main animation feature */}
            <div style={{ zIndex: 20 }}>
                <FloatingBoxes />
            </div>

            {/* Dark overlay for text readability */}
            <div
                className="absolute inset-0"
                style={{
                    zIndex: 25,
                    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%)',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
