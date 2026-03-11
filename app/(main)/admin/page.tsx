'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Stats {
  totalUsers: number;
  totalUrls: number;
  totalActivities: number;
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string; _count: { urls: number; activities: number } }[];
}

export default function AdminPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-24">
        <div className="h-10 w-10 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-[var(--test-muted)] text-sm">Loading admin panel…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-24 text-center px-6">
        <div className="h-14 w-14 bg-red-500/10 rounded-full flex items-center justify-center text-2xl mb-4 text-red-500">⚠</div>
        <p className="font-semibold text-red-500 mb-2">{error}</p>
        <p className="text-[var(--text-muted)] text-sm">Make sure you're signed in as an admin.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pb-16">
      {/* Header */}
      <div className="py-10 border-b border-[var(--border)] mb-10 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[12px] font-semibold mb-2 border border-purple-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
            Admin Panel
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Platform Overview</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Manage users and monitor platform metrics.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: '👤', color: 'text-blue-400', glow: 'rgba(96, 165, 250, 0.4)' },
          { label: 'Total Short URLs', value: stats?.totalUrls ?? 0, icon: '↗', color: 'text-green-400', glow: 'rgba(52, 211, 153, 0.4)' },
          { label: 'Total Activities', value: stats?.totalActivities ?? 0, icon: '▤', color: 'text-purple-400', glow: 'rgba(168, 85, 247, 0.4)' },
        ].map(s => (
          <div key={s.label} className="bg-[var(--surface)] hover:bg-[var(--bg-elevated)] rounded-3xl border border-[var(--border)] p-8 transition-all hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgb(0,0,0,0.25)] glass-panel group">
            <div className="flex items-center justify-between mb-5">
              <div className="h-12 w-12 rounded-2xl bg-[var(--bg)] flex items-center justify-center text-xl border border-[var(--border)] group-hover:border-[var(--brand)] transition-colors">{s.icon}</div>
              <span className={`text-2xl font-extrabold ${s.color}`} style={{ textShadow: `0 0 15px ${s.glow}` }}>{s.value.toLocaleString()}</span>
            </div>
            <p className="font-bold text-[var(--text-primary)] text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] overflow-hidden glass-panel">
        <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--border)]">
          <h2 className="font-bold text-[var(--text-primary)] text-lg">Recent Users</h2>
          <span className="text-xs text-[var(--text-muted)]">{stats?.recentUsers?.length ?? 0} shown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg)]/50">
                <th className="text-left px-8 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">User</th>
                <th className="text-left px-8 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Email</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Role</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">URLs</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Activities</th>
                <th className="text-right px-8 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {(stats?.recentUsers ?? []).map(u => (
                <tr key={u.id} className="hover:bg-[var(--bg)]/40 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--brand)] to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-[0_4px_12px_rgba(99,99,240,0.2)]">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-light)] transition-colors">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[var(--text-secondary)] truncate max-w-xs">{u.email}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right text-[var(--text-primary)] font-bold">{u._count.urls}</td>
                  <td className="px-6 py-5 text-right text-[var(--text-primary)] font-bold">{u._count.activities}</td>
                  <td className="px-8 py-5 text-right text-[var(--text-muted)] text-xs font-medium">
                    {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {(stats?.recentUsers ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
