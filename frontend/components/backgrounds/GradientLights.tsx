/**
 * GradientLights - Cinematic Radial Gradient Lighting
 * Dramatic corner lighting effects
 * 
 * Features:
 * - Multiple radial gradients
 * - Purple → transparent (top-right)
 * - Blue → transparent (bottom-left)
 * - Heavy blur for depth
 * - Low opacity for subtlety
 */

'use client';

export default function GradientLights() {
    return (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            {/* Top-right purple glow */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 800px 600px at 85% 15%, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)',
                    filter: 'blur(120px)',
                }}
            />

            {/* Bottom-left blue glow */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 700px 500px at 15% 85%, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.06) 40%, transparent 70%)',
                    filter: 'blur(150px)',
                }}
            />

            {/* Center accent glow (subtle) */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 60%)',
                    filter: 'blur(200px)',
                }}
            />
        </div>
    );
}
