/**
 * Hero Section Component
 * Landing page hero with call-to-action
 * Features FloatingBoxes animation background (Render.com style)
 * Uses UI kit components for consistent styling
 */

'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Button from './ui/Button';
import TwoColumnLayout from './ui/TwoColumnLayout';
import FloatingBoxes from './FloatingBoxes';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  useTwoColumn?: boolean;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  showFloatingBoxes?: boolean;
}

export default function Hero({
  title = 'Welcome to Aelvynor',
  subtitle = 'Discover innovative projects, courses, internships, and products',
  ctaText = 'Explore Projects',
  ctaLink = '/projects',
  useTwoColumn = false,
  leftContent,
  rightContent,
  showFloatingBoxes = true,
}: HeroProps) {
  if (useTwoColumn && leftContent && rightContent) {
    return (
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <TwoColumnLayout
            left={leftContent}
            right={rightContent}
            gap="lg"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden min-h-[600px] sm:min-h-[700px] md:min-h-[800px]">
      {/* FloatingBoxes Background Animation */}
      {showFloatingBoxes && (
        <div className="absolute inset-0 z-0">
          {/* Blur and opacity wrapper for Render.com effect */}
          <div className="absolute inset-0 backdrop-blur-[2px] sm:backdrop-blur-[3px] opacity-30 sm:opacity-40 md:opacity-50">
            <FloatingBoxes 
              intensity={0.8}
              boxCount={10}
              className="h-full w-full"
            />
          </div>
          
          {/* Additional blur layer for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/60 backdrop-blur-sm" />
        </div>
      )}

      {/* Gradient Overlays for Depth and Readability */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Top gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-gray-900/60" />
        
        {/* Center radial gradient for focus */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-gray-900/30 to-gray-900/70" />
        
        {/* Side gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 via-transparent to-gray-900/50" />
        
        {/* Bottom gradient for text area */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent" />
      </div>

      {/* Hero Content - Above all background layers */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          {/* Text with enhanced readability */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 tracking-tight drop-shadow-lg">
            <span className="relative z-10">{title}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-md">
            <span className="relative z-10">{subtitle}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href={ctaLink}>
              <Button variant="secondary" size="lg" className="shadow-xl">
                {ctaText}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white/80 text-white hover:bg-white hover:text-gray-900 shadow-xl backdrop-blur-sm bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

