/**
 * Admin Topbar Component
 * Search, notifications, user avatar
 */

'use client';

import { Search, Bell, User } from 'lucide-react';
import { useState } from 'react';

interface AdminTopbarProps {
    title?: string;
}

export default function AdminTopbar({ title }: AdminTopbarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Page Title */}
            {title && (
                <h2 className="text-xl font-semibold text-white font-display">{title}</h2>
            )}

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-white/5 border border-white/10 rounded-input pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-150"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors duration-150 group">
                    <Bell className="w-5 h-5 text-white/60 group-hover:text-primary-400 transition-colors duration-150" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                </button>

                {/* User Avatar */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-150 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm">
                        <p className="text-white font-semibold">Admin</p>
                        <p className="text-white/60 text-xs">admin@aelvynor</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
