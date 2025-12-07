/**
 * Admin Sidebar Component
 * Dark theme with glassmorphism, gradient accents
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Target,
    Package,
    FolderKanban,
    GraduationCap,
    Briefcase,
    FileText,
    Globe,
    Settings,
    ScrollText,
    LogOut,
    FolderOpen,
    FileCheck,
    Upload,
    DollarSign,
    Bell,
    ShoppingCart,
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Mission', href: '/admin/mission', icon: Target },
    { name: 'Product', href: '/admin/product', icon: Package },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Project Templates', href: '/admin/project-templates', icon: FolderOpen },
    { name: 'Project Requests', href: '/admin/project-requests', icon: FileCheck },
    { name: 'Project Delivery', href: '/admin/project-delivery', icon: Upload },
    { name: 'Payment & Pricing', href: '/admin/payments', icon: DollarSign },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Courses', href: '/admin/courses', icon: GraduationCap },
    { name: 'Course Purchases', href: '/admin/course-purchases', icon: ShoppingCart },
    { name: 'Internships', href: '/admin/internships', icon: Briefcase },
    { name: 'Applications', href: '/admin/applications', icon: FileText },
    { name: 'Content', href: '/admin/content', icon: Globe },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Logs', href: '/admin/logs', icon: ScrollText },
];

interface AdminSidebarProps {
    onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col shadow-xl transition-all duration-200 z-50">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold text-white font-display">
                    Aelvynor
                </h1>
                <p className="text-xs text-white/60 mt-1 font-medium">Admin Console</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 relative group',
                                isActive
                                    ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            )}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            )}

                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-red-500/10 hover:border hover:border-red-500/20 transition-all duration-150 w-full group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-400" />
                    <span className="font-medium group-hover:text-red-400">Logout</span>
                </button>
            </div>
        </aside>
    );
}
