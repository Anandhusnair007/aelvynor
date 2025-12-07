/**
 * FloatingBoxes - World-Class 3-Layer Parallax Animation
 * Inspired by Render.com, Tessat.space, and Vercel.com
 * 
 * Features:
 * - 3 distinct depth layers with different blur and brightness
 * - Mouse-tilt 3D effect
 * - GPU-accelerated translate3d transforms
 * - Smooth parallax based on mouse position
 * - Responsive with mobile fallback
 */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Box {
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    delay: number;
    layer: 1 | 2 | 3;
    opacity: number;
    duration: number;
}

export default function FloatingBoxes() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Mouse tracking with smooth spring animation
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for mouse following
    const springConfig = { damping: 30, stiffness: 200 };
    const mouseXSpring = useSpring(mouseX, springConfig);
    const mouseYSpring = useSpring(mouseY, springConfig);

    // Detect mobile for performance optimization
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Generate boxes with 3 distinct layers
    const boxes: Box[] = useMemo(() => {
        const boxCount = isMobile ? 8 : 16; // Fewer boxes on mobile
        const layerDistribution = [5, 6, 5]; // Layer 1, 2, 3 distribution

        let currentLayer = 1 as 1 | 2 | 3;
        let layerIndex = 0;

        return Array.from({ length: boxCount }, (_, i) => {
            // Distribute boxes across layers
            if (layerIndex >= layerDistribution[currentLayer - 1]) {
                currentLayer = (currentLayer + 1) as 1 | 2 | 3;
                layerIndex = 0;
            }
            layerIndex++;

            // Layer-specific properties
            let opacity: number, size: number, duration: number;

            if (currentLayer === 1) {
                // Layer 1 - Far background: slow, heavy blur, low brightness
                opacity = 0.15 + Math.random() * 0.1;
                size = 60 + Math.random() * 40;
                duration = 25 + Math.random() * 15;
            } else if (currentLayer === 2) {
                // Layer 2 - Mid depth: medium speed, moderate blur
                opacity = 0.25 + Math.random() * 0.15;
                size = 80 + Math.random() * 60;
                duration = 18 + Math.random() * 10;
            } else {
                // Layer 3 - Foreground: fast, sharp, bright neon glow
                opacity = 0.35 + Math.random() * 0.15;
                size = 100 + Math.random() * 80;
                duration = 12 + Math.random() * 8;
            }

            return {
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size,
                rotation: Math.random() * 360,
                delay: Math.random() * 5,
                layer: currentLayer,
                opacity,
                duration,
            };
        });
    }, [isMobile]);

    // 3D Mouse parallax effect
    useEffect(() => {
        if (isMobile) return; // Disable on mobile for performance

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();

            // Normalize mouse position to -1 to 1
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

            // Set with intensity multiplier
            mouseX.set(x * 30);
            mouseY.set(y * 30);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY, isMobile]);

    // Get layer-specific styles
    const getLayerStyles = (layer: 1 | 2 | 3) => {
        switch (layer) {
            case 1:
                // Far background: heavy blur, lowest brightness
                return {
                    filter: isMobile ? 'blur(4px)' : 'blur(8px)',
                    transform: 'scale(0.3)',
                    zIndex: 1,
                };
            case 2:
                // Mid depth: moderate blur, slight glow
                return {
                    filter: isMobile ? 'blur(2px)' : 'blur(3px)',
                    transform: 'scale(0.6)',
                    zIndex: 2,
                };
            case 3:
                // Foreground: sharp, bright neon glow
                return {
                    filter: 'blur(0px)',
                    transform: 'scale(1)',
                    zIndex: 3,
                };
        }
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            style={{
                perspective: '1200px',
                transformStyle: 'preserve-3d',
            }}
        >
            {boxes.map((box) => {
                // Layer-specific parallax multiplier
                const parallaxMultiplier = box.layer === 1 ? 0.5 : box.layer === 2 ? 0.8 : 1.2;

                return (
                    <motion.div
                        key={box.id}
                        className="absolute pointer-events-none"
                        style={{
                            left: `${box.x}%`,
                            top: `${box.y}%`,
                            width: box.size,
                            height: box.size,
                            ...getLayerStyles(box.layer),
                        }}
                        // Parallax offset based on mouse position (if not mobile)
                        animate={
                            isMobile
                                ? {
                                    // Mobile: simple floating only
                                    y: [0, -15, 0],
                                    rotate: [box.rotation, box.rotation + 5, box.rotation],
                                }
                                : {
                                    // Desktop: full parallax
                                    x: [0, Math.sin(box.id) * 30, 0],
                                    y: [0, Math.cos(box.id) * 30, 0],
                                    rotate: [box.rotation, box.rotation + 180, box.rotation + 360],
                                }
                        }
                        transition={{
                            duration: box.duration,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: box.delay,
                        }}
                    >
                        <motion.div
                            className="w-full h-full rounded-2xl"
                            style={{
                                background: `linear-gradient(135deg, 
                                    rgba(139, 92, 246, ${box.opacity}) 0%, 
                                    rgba(59, 130, 246, ${box.opacity * 0.7}) 100%)`,
                                border: '0.5px solid rgba(139, 92, 246, 0.3)',
                                boxShadow:
                                    box.layer === 3
                                        ? `0 0 40px rgba(139, 92, 246, 0.4), 
                                           0 0 80px rgba(59, 130, 246, 0.2),
                                           inset 0 0 20px rgba(255, 255, 255, 0.1)`
                                        : box.layer === 2
                                            ? `0 0 20px rgba(139, 92, 246, 0.2),
                                           inset 0 0 10px rgba(255, 255, 255, 0.05)`
                                            : `0 0 10px rgba(139, 92, 246, 0.1)`,
                                backdropFilter: 'blur(2px)',
                                // GPU acceleration
                                transform: 'translate3d(0, 0, 0)',
                                willChange: 'transform',
                            }}
                            // 3D mouse tilt effect (desktop only)
                            animate={
                                !isMobile
                                    ? {
                                        rotateX: mouseYSpring.get() * parallaxMultiplier * -0.1,
                                        rotateY: mouseXSpring.get() * parallaxMultiplier * 0.1,
                                    }
                                    : {}
                            }
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}
