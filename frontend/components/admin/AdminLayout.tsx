/**
 * Admin Layout Wrapper
 * Provides consistent layout with sidebar and topbar for all admin pages
 */

'use client';

import { useRouter } from 'next/navigation';
import { clearAuthToken } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const router = useRouter();

    const handleLogout = () => {
        clearAuthToken();
        router.push('/'); // Redirect to user panel (home page)
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
            <FloatingBoxes anchor="center" intensity={0.5} />

            {/* Sidebar */}
            <AdminSidebar onLogout={handleLogout} />

            {/* Main Content */}
            <div className="ml-64 relative z-10">
                <AdminTopbar title={title} />

                <main className="p-8 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
