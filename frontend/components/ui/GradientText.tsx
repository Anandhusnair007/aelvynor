import { cn } from '@/lib/utils';

interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
}

const GradientText = ({ children, className }: GradientTextProps) => {
    return (
        <span className={cn("bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 font-bold", className)}>
            {children}
        </span>
    );
};

export default GradientText;
