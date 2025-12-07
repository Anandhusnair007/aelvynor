'use client';

import { motion } from 'framer-motion';
import GradientText from '@/components/ui/GradientText';

export const scriptScenes = [
    {
        title: "Scene 1 – Introduction & Credibility",
        content: [
            "Innovation is not a word we use lightly — it's the foundation of everything we build.",
            "Welcome to Aelvynor, a proud beneficiary of the Kerala Startup Mission (KSUM) Seed Fund.",
            "From developing breakthrough agricultural technologies like our Automated Rubber Tapping System, to training the next generation of engineers, we are shaping the future — right here in Kerala."
        ]
    },
    {
        title: "Scene 2 – Academic Projects",
        content: [
            "Final-year engineering projects shouldn't be boring. They should be meaningful.",
            "We support students across Computer Science, IT, Electronics, Electrical, Mechanical, Robotics, and AI.",
            "Introducing our 10-Tier Project Model — built for every budget and every level of innovation.",
            "From simple prototypes to full industry-standard R&D systems, we deliver projects that are:",
            "• Custom-built",
            "• Mentor-supported",
            "• Industry-relevant",
            "• Portfolio-enhancing",
            "Stop submitting copy-paste work. Start building solutions that get you hired."
        ]
    },
    {
        title: "Scene 3 – Industry Courses",
        content: [
            "The gap between your syllabus and the industry? Massive.",
            "Our Industry-Ready Courses close that gap fast.",
            "We teach what we actually use in our own engineering teams:",
            "• Modern AI & LLM workflows",
            "• Cloud & DevOps pipelines",
            "• Python & Full Stack Engineering",
            "• IoT & Embedded Systems",
            "• Real-world hardware-software integration",
            "Learn the tech stacks companies expect from day one — not outdated theory."
        ]
    },
    {
        title: "Scene 4 – Internship Pathway",
        content: [
            "And here's the best part: Talent should never come with a price tag.",
            "Introducing our Free Internship Program.",
            "Work with our KSUM-backed engineering team.",
            "Build real products.",
            "Solve real engineering challenges.",
            "Get real experience.",
            "And if you show potential?",
            "Your internship becomes your interview.",
            "Top performers move directly into full-time roles inside Aelvynor — no exam, no fee, no shortcuts.",
            "Just pure skill."
        ]
    },
    {
        title: "Scene 5 – Call to Action",
        content: [
            "Projects. Courses. Internships. Jobs. Your entire engineering career starts here.",
            "Visit https://aelvynor.com (placeholder) or scan the QR code to explore our offerings or apply today.",
            "Aelvynor — Engineered for the Future.",
            "Designed for Innovators."
        ]
    }
];

interface ScriptContentProps {
    showTitle?: boolean;
    className?: string;
}

export default function ScriptContent({ showTitle = true, className = '' }: ScriptContentProps) {
    return (
        <div className={className}>
            {showTitle && (
                <div className="space-y-6 mb-16">
                    <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                        From Campus to <br />
                        <GradientText>Career</GradientText>
                    </h1>
                    <p className="text-2xl text-white/60 font-light">Innovate with Us</p>
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-sm font-mono text-white/40 uppercase tracking-widest">
                            Production-Grade 2-Minute Promotional Script
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-16">
                {scriptScenes.map((scene, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="space-y-6"
                    >
                        <h2 className="text-sm font-bold tracking-widest text-primary-400 uppercase">
                            {scene.title}
                        </h2>
                        <div className="space-y-4 text-lg md:text-xl text-white/90 leading-relaxed font-light">
                            {scene.content.map((line, i) => (
                                <p 
                                    key={i} 
                                    className={line.startsWith('•') ? 'pl-6 font-medium text-white border-l-2 border-primary-400/30' : ''}
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

