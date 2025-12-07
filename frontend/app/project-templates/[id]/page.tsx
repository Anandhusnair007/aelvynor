'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';
import { getProjectTemplate } from '@/lib/api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProjectTemplate {
  id: number;
  title: string;
  category: string;
  description: string;
  tech_stack: string[];
  price: number | null;
  time_duration: string;
  requirements: string;
  demo_images: string[];
  demo_video: string | null;
}

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = parseInt(params.id as string);
  const [template, setTemplate] = useState<ProjectTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      if (isNaN(templateId)) {
        setError('Invalid template ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getProjectTemplate(templateId);
        setTemplate(data);
      } catch (error: any) {
        console.error('Failed to load template:', error);
        setError(error?.message || 'Failed to load project template.');
      } finally {
        setLoading(false);
      }
    };
    loadTemplate();
  }, [templateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/40">
        Loading template details...
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Template Not Found</h1>
          <p className="text-white/60 mb-6">{error || 'The requested template could not be found.'}</p>
          <Link href="/project-templates" className="text-primary-400 hover:underline">
            ← Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="left" />

      <div className="max-w-7xl mx-auto px-6 pt-20">
        {/* Back Button */}
        <Link
          href="/project-templates"
          className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors"
        >
          ← Back to Templates
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-2 bg-primary-500/20 text-primary-300 rounded-full text-sm font-bold">
              {template.category}
            </span>
            {template.price !== null ? (
              <span className="text-2xl font-bold text-white">
                ₹{template.price.toLocaleString()}
              </span>
            ) : (
              <span className="text-xl text-white/60">Price: Negotiable</span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            {template.title}
          </h1>
          <p className="text-white/60 text-xl max-w-3xl">
            {template.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Demo Images */}
            {template.demo_images && template.demo_images.length > 0 && (
              <SectionCard>
                <h2 className="text-2xl font-bold mb-4">Demo Images</h2>
                <div className="grid grid-cols-2 gap-4">
                  {template.demo_images.map((image, index) => (
                    <img
                      key={index}
                      src={image.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${image}` : image}
                      alt={`Demo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Demo Video */}
            {template.demo_video && (
              <SectionCard>
                <h2 className="text-2xl font-bold mb-4">Demo Video</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={template.demo_video}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </SectionCard>
            )}

            {/* Requirements */}
            {template.requirements && (
              <SectionCard>
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <div className="text-white/80 whitespace-pre-line">
                  {template.requirements}
                </div>
              </SectionCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <SectionCard>
              <h3 className="text-xl font-bold mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {template.tech_stack && template.tech_stack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-white/5 rounded-lg text-sm text-white/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </SectionCard>

            {/* Details */}
            <SectionCard>
              <h3 className="text-xl font-bold mb-4">Project Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-white/40 text-sm">Duration</span>
                  <p className="text-white font-medium">⏱ {template.time_duration}</p>
                </div>
                <div>
                  <span className="text-white/40 text-sm">Category</span>
                  <p className="text-white font-medium">{template.category}</p>
                </div>
                <div>
                  <span className="text-white/40 text-sm">Price</span>
                  <p className="text-white font-medium">
                    {template.price !== null ? `₹${template.price.toLocaleString()}` : 'Negotiable'}
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* CTA Button */}
            <Link
              href={`/project-templates/request?templateId=${template.id}`}
              className="block w-full py-4 bg-white text-black rounded-xl font-bold text-lg text-center hover:bg-white/90 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Request This Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

