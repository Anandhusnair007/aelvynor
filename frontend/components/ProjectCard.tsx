/**
 * Project Card Component
 * Displays project information in a card format
 * Uses UI kit components for consistent styling
 */

import Link from 'next/link';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface ProjectCardProps {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  technologies?: string;
}

export default function ProjectCard({
  id,
  title,
  description,
  image_url,
  github_url,
  live_url,
  technologies,
}: ProjectCardProps) {
  const techList = technologies ? technologies.split(',').map((t) => t.trim()) : [];

  return (
    <Card hover padding="none" className="overflow-hidden">
      {/* Image */}
      {image_url && (
        <div className="relative h-48 w-full bg-gray-100">
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        
        {description && (
          <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        )}

        {/* Technologies */}
        {techList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {techList.slice(0, 3).map((tech, index) => (
              <Badge key={index} variant="primary" size="sm">
                {tech}
              </Badge>
            ))}
            {techList.length > 3 && (
              <Badge variant="gray" size="sm">
                +{techList.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          <Link href={`/projects/${id}`}>
            <Button variant="ghost" size="sm">
              View Details →
            </Button>
          </Link>
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm">
                GitHub
              </Button>
            </a>
          )}
          {live_url && (
            <a
              href={live_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm">
                Live Demo
              </Button>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

