/**
 * FloatingBoxes Component
 * Render.com-inspired floating 3D cards animation
 * Uses Framer Motion for smooth GPU-accelerated animations
 * 
 * Features:
 * - Smooth floating animations with infinite reverse
 * - GPU-accelerated transforms
 * - Hover scale effects
 * - Glowing shadows
 * - Parallax depth
 * - Responsive grid layout
 */

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FloatingBoxesProps {
  intensity?: number;
  boxCount?: number;
  colors?: string[];
  className?: string;
}

const defaultColors = [
  'bg-blue-500/20',
  'bg-purple-500/20',
  'bg-pink-500/20',
  'bg-cyan-500/20',
  'bg-indigo-500/20',
  'bg-violet-500/20',
  'bg-fuchsia-500/20',
  'bg-teal-500/20',
];

export default function FloatingBoxes({
  intensity = 1,
  boxCount = 10,
  colors = defaultColors,
  className = '',
}: FloatingBoxesProps) {
  // Generate random positions and animations for each box
  const boxes = useMemo(() => {
    return Array.from({ length: boxCount }, (_, i) => {
      const baseDelay = (i * 0.15) % 3; // Stagger delays
      const duration = 10 + (Math.random() * 6); // 10-16 seconds for smooth movement
      const xOffset = (Math.random() - 0.5) * 60 * intensity; // Random X movement
      const yOffset = (Math.random() - 0.5) * 60 * intensity; // Random Y movement
      const rotation = (Math.random() - 0.5) * 20 * intensity; // Random rotation
      const rotateX = (Math.random() - 0.5) * 10 * intensity; // 3D rotation X
      const rotateY = (Math.random() - 0.5) * 10 * intensity; // 3D rotation Y
      
      return {
        id: i,
        color: colors[i % colors.length],
        x: (Math.random() - 0.5) * 80, // Initial X position
        y: (Math.random() - 0.5) * 80, // Initial Y position
        rotate: (Math.random() - 0.5) * 15, // Initial Z rotation
        rotateX,
        rotateY,
        scale: 0.85 + Math.random() * 0.3, // Random scale 0.85-1.15
        delay: baseDelay,
        duration,
        xOffset,
        yOffset,
        rotation,
      };
    });
  }, [boxCount, colors, intensity]);

  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className}`} 
      style={{ 
        perspective: '1000px',
        transform: 'translateZ(0)', // GPU acceleration
        willChange: 'transform',
      }}
    >
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
        {boxes.map((box) => (
          <motion.div
            key={box.id}
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: box.delay * 0.3 }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.div
              className={`
                ${box.color}
                rounded-xl
                backdrop-blur-md
                border border-white/20
                relative
                overflow-hidden
                cursor-pointer
                group
              `}
              style={{
                width: '100%',
                aspectRatio: '1',
                // GPU-accelerated transforms
                transformStyle: 'preserve-3d',
                transform: 'translateZ(0)', // Force GPU acceleration
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                // Glowing shadow effect (reduced for background)
                boxShadow: `
                  0 4px 16px rgba(59, 130, 246, 0.15),
                  0 0 0 1px rgba(255, 255, 255, 0.08),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1),
                  0 10px 30px rgba(147, 51, 234, 0.1)
                `,
              }}
              // Floating animation with infinite reverse
              animate={{
                x: [box.x, box.x + box.xOffset, box.x],
                y: [box.y, box.y + box.yOffset, box.y],
                rotate: [box.rotate, box.rotate + box.rotation, box.rotate],
                rotateX: [box.rotateX, box.rotateX + (box.rotation * 0.3), box.rotateX],
                rotateY: [box.rotateY, box.rotateY + (box.rotation * 0.3), box.rotateY],
                scale: box.scale,
              }}
              transition={{
                duration: box.duration,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: [0.4, 0, 0.6, 1], // Custom easing for smooth motion
                // Optimize for performance
                type: 'tween',
              }}
              // Hover scale effect with depth
              whileHover={{
                scale: box.scale * 1.15,
                rotateZ: box.rotate + box.rotation * 0.5,
                z: 100,
                transition: { 
                  duration: 0.3,
                  ease: 'easeOut',
                },
              }}
              // Parallax effect
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: '-50px' }}
            >
              {/* Inner glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Subtle grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03]">
                <div 
                  className="w-full h-full rounded-xl"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      {/* Ambient background glow layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 via-transparent to-pink-500/5" />
      </div>
    </div>
  );
}

