'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchAPI, purchaseCourse } from '@/lib/api';
import GradientText from '@/components/ui/GradientText';
import { motion } from 'framer-motion';
import { X, CheckCircle, ShoppingCart } from 'lucide-react';

interface Course {
    id: number;
    title: string;
    description: string;
    level: string;
    duration: string;
    students_count: number;
    price?: number | null;
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseForm, setPurchaseForm] = useState({ name: '', email: '', phone: '' });
    const [purchasing, setPurchasing] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [purchaseError, setPurchaseError] = useState<string | null>(null);

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const data = await fetchAPI('/api/courses');
                const foundCourse = data.find((c: Course) => c.id === parseInt(params.id));
                setCourse(foundCourse || null);
            } catch (error) {
                console.error('Failed to load course:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCourse();
    }, [params.id]);

    const handlePurchaseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPurchasing(true);
        setPurchaseError(null);

        try {
            const formData = new FormData();
            formData.append('name', purchaseForm.name);
            formData.append('email', purchaseForm.email);
            formData.append('phone', purchaseForm.phone);
            formData.append('course_id', params.id);

            await purchaseCourse(formData);
            setPurchaseSuccess(true);
            setPurchaseForm({ name: '', email: '', phone: '' });
            setTimeout(() => {
                setShowPurchaseModal(false);
                setPurchaseSuccess(false);
            }, 3000);
        } catch (err: any) {
            setPurchaseError(err?.message || 'Failed to submit purchase request');
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen relative pb-20 bg-black">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="max-w-7xl mx-auto px-6 pt-40 relative z-10">
                    <div className="text-center text-white/40">Loading course...</div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen relative pb-20 bg-black">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="max-w-7xl mx-auto px-6 pt-40 relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
                        <Link href="/courses" className="text-primary-400 hover:underline">
                            ← Back to Courses
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative pb-20 bg-black">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

            <div className="max-w-5xl mx-auto px-6 pt-20 relative z-10">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link href="/courses" className="text-white/60 hover:text-white transition-colors">
                        ← Back to Courses
                    </Link>
                </div>

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <span className="px-4 py-1.5 bg-primary-500/20 border border-primary-500/30 rounded-full text-sm font-bold text-primary-300">
                            {course.level}
                        </span>
                        <span className="text-white/60">{course.duration}</span>
                        <span className="text-white/60">👥 {course.students_count}+ students</span>
                        {course.price !== null && course.price !== undefined && (
                            <span className="px-4 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-sm font-bold text-green-300">
                                ₹{course.price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                        {course.title}
                    </h1>

                    <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
                        {course.description}
                    </p>
                </motion.div>

                {/* Syllabus */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold mb-8">
                        Course <GradientText>Syllabus</GradientText>
                    </h2>

                    <div className="space-y-4">
                        {['Fundamentals & Core Concepts', 'Practical Projects & Hands-on Labs', 'Industry Best Practices', 'Real-world Case Studies', 'Final Capstone Project'].map((module, i) => (
                            <div
                                key={i}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg font-bold">{i + 1}</span>
                                    </div>
                                    <h3 className="font-bold text-lg">{module}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* What You'll Learn */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold mb-8">
                        What You'll <GradientText>Learn</GradientText>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Master the fundamentals and advanced concepts',
                            'Build real-world projects from scratch',
                            'Learn industry-standard tools and workflows',
                            'Get hands-on experience with latest technologies',
                            'Work on portfolio-ready capstone projects',
                            'Receive mentorship from industry experts'
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-primary-400 text-sm">✓</span>
                                </div>
                                <p className="text-white/80">{item}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-primary-900/20 to-primary-600/20 border border-white/10 rounded-2xl p-12 text-center"
                >
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
                    <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                        Join {course.students_count}+ students already enrolled in this course.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setShowPurchaseModal(true)}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-bold hover:from-primary-600 hover:to-primary-700 transition-transform hover:scale-105 active:scale-95"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Purchase Course
                        </button>
                        <Link
                            href="/courses"
                            className="inline-block px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-transform hover:scale-105 active:scale-95"
                        >
                            Browse All Courses
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Purchase Modal */}
            {showPurchaseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1A1A1F] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">Purchase Course</h3>
                            <button
                                onClick={() => setShowPurchaseModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {purchaseSuccess ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <h4 className="text-xl font-bold mb-2">Request Submitted!</h4>
                                <p className="text-white/60">We'll contact you shortly with payment details.</p>
                            </div>
                        ) : (
                            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                                <div>
                                    <p className="text-white/60 mb-4">Course: <span className="text-white font-bold">{course.title}</span></p>
                                </div>

                                {purchaseError && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                        {purchaseError}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={purchaseForm.name}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={purchaseForm.email}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={purchaseForm.phone}
                                        onChange={(e) => setPurchaseForm({ ...purchaseForm, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500"
                                        placeholder="+91 1234567890"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={purchasing}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-bold hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {purchasing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </span>
                                    ) : (
                                        'Submit Purchase Request'
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
