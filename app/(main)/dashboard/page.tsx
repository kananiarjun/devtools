'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Activity {
  id: string;
  action: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

const ACTION_CONFIG: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  url_created: { color: '#6363f0', bg: 'rgba(99,99,240,0.15)', icon: '↗', label: 'Short URL created' },
  login: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '→', label: 'Signed in' },
  signup: { color: '#a855f7', bg: 'rgba(168,85,247,0.15)', icon: '+', label: 'Account created' },
  qr_generated: { color: '#a855f7', bg: 'rgba(168,85,247,0.15)', icon: '⊞', label: 'QR code generated' },
  password_generated: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: '◈', label: 'Password generated' },
};

const QUICK_TOOLS = [
  { href: '/url-shortener', label: 'Shorten URL', icon: '↗', color: '#6363f0', bg: 'rgba(99,99,240,0.12)' },
  { href: '/qr-generator', label: 'QR Code', icon: '⊞', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  { href: '/password-generator', label: 'Password', icon: '◈', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { href: '/json-formatter', label: 'JSON Format', icon: '{}', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
];

const STATS_CONFIG = [
  { key: 'urls', label: 'Short URLs', subLabel: "Links you've shortened", icon: '↗', color: '#6363f0', statAccent: '#6363f0' },
  { key: 'activities', label: 'Total Activities', subLabel: 'Actions tracked', icon: '▤', color: '#10b981', statAccent: '#10b981' },
];

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) fetchActivities();
    else setLoading(false);
  }, [user, token]);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/user/activities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  };

  const displayName = (user as any)?.username || (user as any)?.name || 'User';

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '96px 24px' }}>
        <div style={{ width: 40, height: 40, border: '2px solid rgba(99,99,240,0.3)', borderTopColor: '#6363f0', borderRadius: '50%' }} className="animate-spin" />
        <p style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: 14 }}>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">

      {/* ── Welcome Banner ── */}
      <div className="dashboard-banner">
        <div className="animate-float" style={{ position: 'absolute', right: 24, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(168,85,247,0.1)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div className="dashboard-banner-inner" style={{ marginBottom: 6 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6363f0, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 17, fontWeight: 800,
              boxShadow: '0 0 20px rgba(99,99,240,0.4), 0 0 0 2px rgba(99,99,240,0.2)',
              flexShrink: 0,
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                Welcome back, {displayName} 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 2 }}>Here's a summary of your account activity.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="dashboard-stats">
        {/* URLs */}
        <StatCard accentColor="#6363f0" className="animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(99,99,240,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontWeight: 700, fontSize: 16 }}>↗</div>
            <span style={{ fontSize: 30, fontWeight: 900, color: '#818cf8', letterSpacing: '-0.04em' }}>{(user as any)?._count?.urls ?? 0}</span>
          </div>
          <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>Short URLs</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Links you've shortened</p>
        </StatCard>

        {/* Activities */}
        <StatCard accentColor="#10b981" className="animate-fade-up" delay="60ms">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontWeight: 700, fontSize: 16 }}>▤</div>
            <span style={{ fontSize: 30, fontWeight: 900, color: '#34d399', letterSpacing: '-0.04em' }}>{(user as any)?._count?.activities ?? 0}</span>
          </div>
          <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>Total Activities</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Actions tracked</p>
        </StatCard>

        {/* Member since */}
        <StatCard accentColor="#a855f7" className="animate-fade-up" delay="120ms">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📅</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#c084fc' }}>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '—'}
            </span>
          </div>
          <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>Member Since</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Account creation date</p>
        </StatCard>
      </div>

      {/* ── Main grid ── */}
      <div className="dashboard-main">

        {/* ── Activity Feed ── */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 18, overflow: 'hidden',
          minWidth: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 15, margin: 0 }}>Recent Activity</h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '3px 10px', borderRadius: 999, fontWeight: 500 }}>{activities.length} events</span>
          </div>

          {activities.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>📋</div>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No activity yet</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Start using tools to see your history here.</p>
            </div>
          ) : (
            <div>
              {activities.slice(0, 12).map((activity, idx) => {
                const cfg = ACTION_CONFIG[activity.action] ?? {
                  color: 'var(--text-secondary)', bg: 'var(--bg-tertiary)', icon: '·',
                  label: activity.action.replace(/_/g, ' '),
                };
                return (
                  <div key={activity.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 24px',
                    borderBottom: idx < Math.min(activities.length, 12) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: cfg.color, fontWeight: 700, fontSize: 13, flexShrink: 0,
                    }}>
                      {cfg.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{cfg.label}</p>
                      {(activity.metadata as any)?.originalUrl && (
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {String((activity.metadata as any).originalUrl).substring(0, 60)}
                        </p>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                      {new Date(activity.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Side Panel ── */}
        <div className="dashboard-side">

          {/* Quick Actions */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {QUICK_TOOLS.map(t => (
                <Link key={t.href} href={t.href} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  padding: '14px 8px', borderRadius: 14,
                  background: t.bg, border: `1px solid ${t.color}20`,
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 16px ${t.color}25`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; }}
                >
                  <span style={{ fontSize: 20, color: t.color }}>{t.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.color, textAlign: 'center', lineHeight: 1.3 }}>{t.label}</span>
                </Link>
              ))}
            </div>
            <Link href="/" style={{ marginTop: 14, display: 'block', textAlign: 'center', fontSize: 12, color: 'var(--brand-light)', fontWeight: 600, textDecoration: 'none' }}>
              View all 8 tools →
            </Link>
          </div>

          {/* Account */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>Account</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6363f0, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 16,
                boxShadow: '0 0 16px rgba(99,99,240,0.35)',
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14, margin: 0 }}>{displayName}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{user?.email}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Role</span>
              <span style={{
                padding: '3px 10px', borderRadius: 999,
                fontSize: 11, fontWeight: 700,
                background: (user as any)?.role === 'ADMIN' ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.06)',
                color: (user as any)?.role === 'ADMIN' ? '#c084fc' : 'var(--text-secondary)',
                border: `1px solid ${(user as any)?.role === 'ADMIN' ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.06)'}`,
                letterSpacing: '0.05em',
              }}>
                {(user as any)?.role ?? 'USER'}
              </span>
            </div>
            <button
              onClick={logout}
              style={{
                width: '100%', marginTop: 20, padding: '10px 16px', borderRadius: 12,
                fontSize: 13, fontWeight: 700, color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.15)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239, 68, 68, 0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239, 68, 68, 0.2)'; }}
            >
              <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

function StatCard({ children, accentColor, className = '', delay }: { children: React.ReactNode; accentColor: string; className?: string; delay?: string }) {
  return (
    <div className={className} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 18,
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.25s, box-shadow 0.25s',
      animationDelay: delay,
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accentColor}00, ${accentColor}, ${accentColor}00)`, borderRadius: '18px 18px 0 0', opacity: 0.8 }} />
      {children}
    </div>
  );
}
