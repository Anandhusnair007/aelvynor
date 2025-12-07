import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SectionCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const SectionCard = ({ children, className, delay = 0 }: SectionCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "glass-card rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export default SectionCard;
