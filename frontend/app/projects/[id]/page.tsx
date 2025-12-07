'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import SectionCard from '@/components/ui/SectionCard';
import { getProject } from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProjectDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  full_description: string;
  tags: string[];
  features: string[];
  image: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.id as string; // Next.js dynamic route param is 'id' based on folder name, but we treat as slug
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await getProject(slug);
        setProject({
          ...data,
          tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags,
          features: typeof data.features === 'string' ? JSON.parse(data.features) : data.features,
          image: data.image?.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${data.image}` : data.image
        });
      } catch (error) {
        console.error('Failed to load project:', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) loadProject();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white/40">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href="/projects" className="text-primary-400 hover:underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="left" />

      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-20" />
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 w-full z-30 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link href="/projects" className="text-white/60 hover:text-white mb-4 inline-block transition-colors">
              ← Back to Projects
            </Link>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <SectionCard>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <div className="text-white/80 leading-relaxed text-lg whitespace-pre-line">
                {project.full_description}
              </div>
            </SectionCard>

            <SectionCard delay={0.1}>
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <button className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-white/90 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              View Live Demo
            </button>

            <button className="w-full py-4 glass-card text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              View Source Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
