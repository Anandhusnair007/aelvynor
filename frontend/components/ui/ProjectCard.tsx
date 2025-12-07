import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
    id: string;
    title: string;
    description: string;
    tags: string[];
    image?: string;
    index: number;
}

const ProjectCard = ({ id, title, description, tags, image, index }: ProjectCardProps) => {
    return (
        <Link href={`/projects/${id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-full glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
            >
                <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 relative overflow-hidden">
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-4xl font-display font-bold">
                            {title.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">{title}</h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{description}</p>

                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-white/5 rounded-md text-xs font-medium text-white/80 border border-white/5"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProjectCard;
