'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GradientText from '@/components/ui/GradientText';
import HeroBackground from '@/components/backgrounds/HeroBackground';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
            {/* World-Class Background Animation System */}
            <HeroBackground />

            {/* Container - Content is above background (z-30) */}
            <div className="max-w-7xl mx-auto px-6 w-full relative" style={{ zIndex: 30 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* LEFT: Animation Space (visible within HeroBackground) */}
                    <div className="hidden lg:block relative h-[600px]">
                        {/* Animation is handled by HeroBackground */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-6xl font-bold text-white/5 select-none">
                                AELVYNOR
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="text-left space-y-8"
                    >
                        {/* Badge */}
                        <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-primary-300">
                            Incubated at Kerala Startup Mission
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[1.1]">
                            Build the <br />
                            <GradientText>Future.</GradientText>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">
                            Automation, Engineering & Next-Gen Innovation. Aelvynor modernizes rubber tapping with engineering, training, and market-ready automation solutions.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/projects"
                                className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-white/90 transition-transform hover:scale-105 active:scale-95 text-center"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/internships"
                                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-transform hover:scale-105 active:scale-95 text-center backdrop-blur-sm"
                            >
                                Apply Now
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                            <div>
                                <div className="text-3xl font-bold text-primary-400 mb-1">10+</div>
                                <div className="text-white/60 text-sm">Projects</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary-400 mb-1">500+</div>
                                <div className="text-white/60 text-sm">Students</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary-400 mb-1">3</div>
                                <div className="text-white/60 text-sm">Products</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" style={{ zIndex: 28 }} />
        </section>
    );
}
