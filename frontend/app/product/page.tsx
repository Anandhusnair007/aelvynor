'use client';

import Link from 'next/link';
import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';
import { getProduct } from '@/lib/api';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Product {
    id: number;
    name: string;
    description: string;
    features: string[];
    specs: Record<string, string>;
}

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProduct();
                // getProduct returns a list, handle accordingly
                const productsList = Array.isArray(data) ? data : [data];
                setProducts(productsList.map((p: any) => ({
                    ...p,
                    features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
                    specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs
                })));
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen relative pb-20 bg-black">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <FloatingBoxes anchor="right" intensity={0.5} />
                <div className="max-w-7xl mx-auto px-6 pt-40 relative z-10">
                    <div className="text-center text-white/40">Loading products...</div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen relative pb-20 bg-black">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <FloatingBoxes anchor="right" intensity={0.5} />
                <div className="max-w-7xl mx-auto px-6 pt-40 relative z-10">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                            Aelyvnor <GradientText>Momentum</GradientText>
                        </h1>
                        <p className="text-white/60 text-xl max-w-3xl mx-auto mb-3">
                            Aelyvnor Momentum — Where ideas turn into reality.
                        </p>
                        <p className="text-white/50 text-lg max-w-3xl mx-auto">
                            Driving efficiency, delivering quality.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const product = products[0]; // Display first product

    return (
        <div className="min-h-screen relative pb-20 bg-black">
            {/* Render.com-style background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

            <FloatingBoxes anchor="right" intensity={0.5} />

            <div className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                        Aelyvnor <GradientText>Momentum</GradientText>
                    </h1>
                    <p className="text-white/60 text-xl max-w-3xl mx-auto mb-3">
                        Aelyvnor Momentum — Where ideas turn into reality.
                    </p>
                    <p className="text-white/50 text-lg max-w-3xl mx-auto mb-12">
                        Driving efficiency, delivering quality.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-transform hover:scale-105 active:scale-95"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-display font-bold text-center mb-12"
                    >
                        Key <GradientText>Features</GradientText>
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {product.features.map((feature, i) => (
                            <SectionCard key={i} delay={i * 0.1}>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2">{feature}</h3>
                                    </div>
                                </div>
                            </SectionCard>
                        ))}
                    </div>
                </div>

                {/* Specifications */}
                {Object.keys(product.specs).length > 0 && (
                    <div className="mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-display font-bold text-center mb-12"
                        >
                            Technical <GradientText>Specifications</GradientText>
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {Object.entries(product.specs).map(([key, value], i) => (
                                <SectionCard key={key} delay={i * 0.1}>
                                    <div className="text-white/40 text-sm mb-2 uppercase tracking-wider">{key}</div>
                                    <div className="font-bold text-lg">{value}</div>
                                </SectionCard>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-primary-900/20 to-primary-600/20 border border-white/10 rounded-2xl p-12 text-center backdrop-blur-sm"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to get started?
                    </h2>
                    <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
                        Join innovative teams already using {product.name} to build the future.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
                        >
                            Contact Us
                        </Link>
                        <Link
                            href="/projects"
                            className="inline-block px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-transform hover:scale-105 active:scale-95"
                        >
                            View Projects
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
