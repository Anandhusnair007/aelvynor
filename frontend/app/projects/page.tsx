'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import ProjectCard from '@/components/ui/ProjectCard';
import { getProjects } from '@/lib/api';
import { useEffect, useState } from 'react';

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  image: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjects();
        if (Array.isArray(data)) {
          // Parse JSON strings if necessary
          const parsedData = data.map((p: any) => ({
            ...p,
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (Array.isArray(p.tags) ? p.tags : []),
            // Handle relative image paths
            image: p.image?.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${p.image}` : p.image
          }));
          setProjects(parsedData);
        } else {
          setProjects([]);
        }
      } catch (error: any) {
        console.error('Failed to load projects:', error);
        setError(error?.message || 'Failed to load projects. Please try again later.');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="right" />

      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Our <GradientText>Solutions</GradientText>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Delivering smart, scalable and reliable solutions for every challenge.
          </p>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mt-3">
            Engineering solutions that grow with every challenge.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white/40">Loading projects...</div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-white/60">
            <p className="text-xl mb-4">No projects available at the moment.</p>
            <p className="text-sm">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                id={project.slug}
                title={project.title}
                description={project.description}
                tags={project.tags}
                image={project.image}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
