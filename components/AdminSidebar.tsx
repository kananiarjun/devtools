'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    user: {
        name: string;
        email: string;
    } | null;
    logout: () => void;
}

export default function AdminSidebar({ user, logout }: SidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        {
            label: 'Overview',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
            path: '/admin',
        },
        {
            label: 'Users',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
            path: '/admin/users',
        },
        {
            label: 'URL Logs',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
            path: '/admin/urls',
        },
        {
            label: 'Settings',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
            path: '/admin/settings',
        },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-[var(--bg)] border-r border-[var(--border)] fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-[var(--border)] glass-panel">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-[var(--brand)] to-purple-600 rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(99,99,240,0.3)]">
                        <span className="text-white font-black text-sm">D</span>
                    </div>
                    <div>
                        <span className="text-[var(--text-primary)] font-bold text-sm tracking-tight">DevToolsHub</span>
                        <div className="text-[10px] text-purple-400 font-medium">Admin Console</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p className="text-[10px] font-semibold text-[var(--test-muted)] uppercase tracking-widest px-4 pb-3 pt-2">Navigation</p>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            href={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <svg className={`h-4.5 w-4.5 flex-shrink-0 transition-colors ${isActive ? 'text-purple-400' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {item.icon}
                            </svg>
                            {item.label}
                            {isActive && (
                                <div className="ml-auto h-1 w-1 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-[var(--border)] space-y-3 glass-panel">
                {/* User info */}
                <div className="flex items-center gap-3 px-2">
                    <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10 ring-2 ring-white/5">
                        <span className="text-white font-bold text-sm">
                            {user?.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.name}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[var(--surface)] hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-all text-sm font-medium border border-[var(--border)] hover:border-red-500/30"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                </button>
            </div>
        </aside>
    );
}
