'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
    { name: 'Company', href: '/about' },
    { name: 'Solutions', href: '/projects' },
    { name: 'Project Templates', href: '/project-templates' },
    { name: 'Academy', href: '/courses' },
    { name: 'Connect', href: '/internships' },
    { name: 'Momentum', href: '/product' },
    { name: 'Service & Solutions', href: '/contact' },
];

const Navbar = () => {
    const pathname = usePathname();

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4"
        >
            <nav className="glass rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl">
                <Link href="/" className="font-display font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                    Aelvynor
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-white",
                                pathname === item.href ? "text-white" : "text-white/60"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/my-projects"
                        className="hidden md:block text-sm font-medium text-white/60 hover:text-white transition-colors"
                    >
                        My Projects
                    </Link>
                    <Link
                        href="/project-templates/request"
                        className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-white/90 transition-colors"
                    >
                        Request Project
                    </Link>
                    {/* Hidden Admin Login - Only visible as tiny link */}
                    <Link
                        href="/admin/login"
                        className="opacity-0 hover:opacity-30 text-[8px] text-white/20 transition-opacity w-0 overflow-hidden"
                        title="Admin Login"
                    >
                        Admin
                    </Link>
                </div>
            </nav>
        </motion.header>
    );
};

export default Navbar;
