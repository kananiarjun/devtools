'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const TOOLS = [
  { href: '/qr-generator', label: 'QR Generator', icon: '⊞', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  { href: '/url-shortener', label: 'URL Shortener', icon: '↗', color: '#6363f0', bg: 'rgba(99,99,240,0.12)' },
  { href: '/video-downloader', label: 'Video Downloader', icon: '▶', color: '#f43f5e', bg: 'rgba(244,63,94,0.12)' },
  { href: '/video-to-audio', label: 'Video to Audio', icon: '♫', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { href: '/password-generator', label: 'Password Gen', icon: '◈', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { href: '/json-formatter', label: 'JSON Formatter', icon: '{}', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  { href: '/image-to-pdf', label: 'Image to PDF', icon: '📄', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  { href: '/image-upscaler', label: 'Image Upscaler', icon: '✦', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const isActiveTool = TOOLS.some(t => t.href === path);
  const displayName = (user as any)?.username || (user as any)?.name || '';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'background 0.3s, box-shadow 0.3s, border-color 0.3s',
        background: scrolled
          ? 'rgba(10,14,26,0.85)'
          : 'rgba(10,14,26,0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 no-underline group" onClick={() => setMobileOpen(false)}>
          <span className="logo-mark"><img src="/icon.svg" alt="DevTools Hub" width={36} height={36} /></span>
          <span className="font-bold text-[15px] hidden sm:block" style={{ color: 'var(--text-primary)' }}>
            DevTools <span style={{ background: 'linear-gradient(135deg, #818cf8, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          <NavLink href="/" active={path === '/'}>Home</NavLink>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setToolsOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 10,
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                border: 'none',
                background: isActiveTool || toolsOpen ? 'rgba(99,99,240,0.15)' : 'transparent',
                color: isActiveTool || toolsOpen ? '#818cf8' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActiveTool && !toolsOpen) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!isActiveTool && !toolsOpen) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                }
              }}
            >
              Tools
              <svg
                style={{
                  width: 12, height: 12,
                  transition: 'transform 0.2s',
                  transform: toolsOpen ? 'rotate(180deg)' : 'none',
                }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {toolsOpen && (
              <div className="animate-slide-down" style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
                transform: 'translateX(-50%)',
                width: 400,
                background: 'rgba(15,20,35,0.96)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 18,
                padding: '10px 8px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,99,240,0.1) inset',
                zIndex: 50,
              }}>
                <p style={{ padding: '4px 12px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  Available Tools
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {TOOLS.map(t => (
                    <Link key={t.href} href={t.href} onClick={() => setToolsOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 9,
                        padding: '9px 10px', borderRadius: 12,
                        textDecoration: 'none',
                        background: path === t.href ? t.bg : 'transparent',
                        color: path === t.href ? t.color : 'rgba(255,255,255,0.65)',
                        transition: 'all 0.15s',
                        fontSize: 13, fontWeight: path === t.href ? 600 : 400,
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.background = t.bg;
                        (e.currentTarget as HTMLAnchorElement).style.color = t.color;
                      }}
                      onMouseLeave={e => {
                        if (path !== t.href) {
                          (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                          (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)';
                        }
                      }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: t.bg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 13, flexShrink: 0,
                      }}>{t.icon}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {user && <NavLink href="/dashboard" active={path === '/dashboard'}>Dashboard</NavLink>}
          {user && (user as any).role === 'ADMIN' && (
            <NavLink href="/admin" active={path === '/admin'}>Admin</NavLink>
          )}
        </div>

        {/* Desktop User Area */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {!loading && user && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', paddingRight: 4 }}>
                <div style={{
                  height: 30, width: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6363f0, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
                  boxShadow: '0 0 0 2px rgba(99,99,240,0.3)',
                }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)', maxWidth: 96, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
              </div>
              <button onClick={handleLogout} className="btn-destructive" style={{ fontSize: 12, padding: '6px 12px' }}>
                Log out
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          style={{
            display: 'none',
            padding: '7px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          className="nav-hamburger"
          aria-label="Toggle menu"
        >
          <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="animate-slide-down" style={{
          borderTop: '1px solid var(--border)',
          background: 'rgba(10,14,26,0.97)',
          backdropFilter: 'blur(20px)',
          padding: '16px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
            {TOOLS.map(t => (
              <Link key={t.href} href={t.href} onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px', borderRadius: 12,
                  textDecoration: 'none', fontSize: 13, fontWeight: 500,
                  background: path === t.href ? t.bg : 'var(--bg-elevated)',
                  color: path === t.href ? t.color : 'var(--text-secondary)',
                  border: `1px solid ${path === t.href ? t.color + '30' : 'var(--border)'}`,
                  transition: 'all 0.15s',
                }}
              >
                <span>{t.icon}</span>{t.label}
              </Link>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {user && (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{
                display: 'block', textAlign: 'center', padding: '10px',
                borderRadius: 10, fontSize: 13, fontWeight: 500,
                color: 'var(--text-secondary)', background: 'var(--bg-elevated)',
                border: '1px solid var(--border)', textDecoration: 'none',
              }}>Dashboard</Link>
            )}
            {user && (user as any).role === 'ADMIN' && (
              <Link href="/admin" onClick={() => setMobileOpen(false)} style={{
                display: 'block', textAlign: 'center', padding: '10px',
                borderRadius: 10, fontSize: 13, fontWeight: 500,
                color: '#c084fc', background: 'rgba(168,85,247,0.1)',
                border: '1px solid rgba(168,85,247,0.2)', textDecoration: 'none',
              }}>Admin Panel</Link>
            )}
            {!loading && user && (
              <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="btn-destructive" style={{ width: '100%', padding: '10px', justifyContent: 'center' }}>
                Log out ({displayName})
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      padding: '6px 12px', borderRadius: 10, fontSize: 13,
      fontWeight: active ? 600 : 500, textDecoration: 'none',
      background: active ? 'rgba(99,99,240,0.15)' : 'transparent',
      color: active ? '#818cf8' : 'var(--text-secondary)',
      transition: 'all 0.15s',
      display: 'inline-flex', alignItems: 'center',
    }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
        }
      }}
    >
      {children}
    </Link>
  );
}
