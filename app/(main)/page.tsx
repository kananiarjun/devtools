'use client';

import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import { useAuth } from '@/contexts/AuthContext';

const TOOLS = [
  {
    href: '/qr-generator',
    icon: '⊞',
    title: 'QR Generator',
    description: 'Create customizable QR codes for URLs, text, or contact info — download as PNG instantly.',
    color: '#a855f7',
    bgColor: 'rgba(168,85,247,0.12)',
    tag: 'Popular' as const,
  },
  {
    href: '/url-shortener',
    icon: '↗',
    title: 'URL Shortener',
    description: 'Shorten long URLs into compact links. Track clicks and manage links via your dashboard.',
    color: '#6363f0',
    bgColor: 'rgba(99,99,240,0.12)',
    tag: 'Popular' as const,
  },
  {
    href: '/video-downloader',
    icon: '▶',
    title: 'Video Downloader',
    description: 'Download videos from YouTube and other platforms in multiple quality options.',
    color: '#f43f5e',
    bgColor: 'rgba(244,63,94,0.12)',
    tag: 'Free' as const,
  },
  {
    href: '/video-to-audio',
    icon: '♫',
    title: 'Video to Audio',
    description: 'Extract high-quality MP3 audio from any MP4, AVI, or MOV video file using FFmpeg.',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.12)',
    tag: 'Free' as const,
  },
  {
    href: '/password-generator',
    icon: '◈',
    title: 'Password Generator',
    description: 'Generate cryptographically secure passwords with custom length, symbols, and numbers.',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    tag: 'Free' as const,
  },
  {
    href: '/json-formatter',
    icon: '{}',
    title: 'JSON Formatter',
    description: 'Validate, prettify, and inspect JSON with real-time syntax error detection.',
    color: '#06b6d4',
    bgColor: 'rgba(6,182,212,0.12)',
    tag: 'Popular' as const,
  },
  {
    href: '/image-to-pdf',
    icon: '📄',
    title: 'Image to PDF',
    description: 'Convert JPG, PNG, or WebP images to PDF files right in the browser — no upload needed.',
    color: '#ec4899',
    bgColor: 'rgba(236,72,153,0.12)',
    tag: 'Free' as const,
  },
  {
    href: '/image-upscaler',
    icon: '✦',
    title: 'Image Upscaler',
    description: 'Enhance and upscale images using AI-powered sharp processing on the server.',
    color: '#6366f1',
    bgColor: 'rgba(99,102,241,0.12)',
    tag: 'AI' as const,
  },
];

const FEATURES = [
  { icon: '⚡', title: 'Instant results', desc: 'All tools run fast — no waiting, no queue.', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { icon: '🔒', title: 'No data stored', desc: 'Files and tool inputs are processed and discarded.', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { icon: '🛠', title: 'Open source', desc: 'Built with Next.js, Prisma, and Tailwind CSS.', color: '#6363f0', bg: 'rgba(99,99,240,0.12)' },
  { icon: '📊', title: 'Activity tracking', desc: 'Signed-in users get full history in their dashboard.', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div style={{ width: '100%' }}>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0e1a',
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 15% -15%, rgba(99,99,240,0.28) 0%, transparent 55%),
          radial-gradient(ellipse 70% 55% at 85% 110%, rgba(168,85,247,0.2) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 50% 60%, rgba(6,182,212,0.05) 0%, transparent 60%)
        `,
      }}>
        {/* Decorative grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />

        {/* Floating orbs */}
        <div className="animate-float" style={{ position: 'absolute', top: '10%', right: '8%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(168,85,247,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div className="animate-float-d" style={{ position: 'absolute', bottom: '-5%', left: '5%', width: 220, height: 220, borderRadius: '50%', background: 'rgba(99,99,240,0.1)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div className="animate-float" style={{ position: 'absolute', top: '55%', left: '55%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(6,182,212,0.07)', filter: 'blur(40px)', pointerEvents: 'none', animationDelay: '2s' }} />

        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '96px 24px 88px', textAlign: 'center' }}>

          {/* Badge */}
          <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.65)', marginBottom: 32 }}>
            <span className="animate-dot-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
            8 free tools · No credit card required
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up" style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 24, color: '#fff', animationDelay: '60ms' }}>
            The developer toolkit
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #a855f7 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>that saves you time</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up" style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7, animationDelay: '120ms' }}>
            QR codes, URL shortening, video downloading, password generation, JSON formatting, image conversion — all free, all in one place.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, animationDelay: '180ms' }}>
            <Link href="/qr-generator" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 14, fontSize: 15,
              fontWeight: 700, color: '#fff', textDecoration: 'none',
              background: 'linear-gradient(135deg, #6363f0 0%, #a855f7 100%)',
              boxShadow: '0 4px 24px rgba(99,99,240,0.5), 0 0 0 1px rgba(255,255,255,0.08) inset',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(99,99,240,0.7), 0 0 0 1px rgba(255,255,255,0.12) inset'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 24px rgba(99,99,240,0.5), 0 0 0 1px rgba(255,255,255,0.08) inset'; (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; }}
            >
              Start using tools
              <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/auth/signup" style={{
              display: user ? 'none' : 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 14, fontSize: 15,
              fontWeight: 600, color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)'; }}
            >
              Create free account
            </Link>
            {user && (
              <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 14, fontSize: 15,
                fontWeight: 600, color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)'; }}
              >
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="animate-fade-up" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, marginTop: 56, animationDelay: '240ms' }}>
            {[
              { value: '8', label: 'Free tools' },
              { value: '100%', label: 'Browser-side' },
              { value: '0', label: 'Data stored' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools Grid ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999, background: 'rgba(99,99,240,0.12)', border: '1px solid rgba(99,99,240,0.2)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#818cf8', marginBottom: 18 }}>
            ✦ All Tools
          </div>
          <h2 className="animate-fade-up" style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 12, animationDelay: '60ms' }}>
            Everything you need, nothing you don't
          </h2>
          <p className="animate-fade-up" style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 480, margin: '0 auto', lineHeight: 1.7, animationDelay: '120ms' }}>
            Pick a tool and get results in seconds — no installs, no signups required for most features.
          </p>
        </div>

        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {TOOLS.map(tool => (
            <div key={tool.href} className="animate-fade-up" style={{ height: '100%' }}>
              <ToolCard {...tool} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Strip ── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 32 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: f.bg, border: `1px solid ${f.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                  boxShadow: `0 0 20px ${f.color}15`,
                }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14, marginBottom: 4 }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: '#0d1020',
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 10% 50%, rgba(99,99,240,0.25) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 90% 50%, rgba(168,85,247,0.2) 0%, transparent 55%)
          `,
          border: '1px solid rgba(99,99,240,0.2)',
          borderRadius: 28, padding: '72px 32px', textAlign: 'center',
          boxShadow: '0 0 80px rgba(99,99,240,0.1)',
        }}>
          {/* Decorative */}
          <div className="animate-float" style={{ position: 'absolute', top: '-40px', right: '10%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(168,85,247,0.12)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div className="animate-float-d" style={{ position: 'absolute', bottom: '-30px', left: '8%', width: 130, height: 130, borderRadius: '50%', background: 'rgba(99,99,240,0.12)', filter: 'blur(35px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 12 }}>Ready to build faster?</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 36, maxWidth: 440, margin: '0 auto 36px', fontSize: 16, lineHeight: 1.7 }}>
              Create a free account to unlock activity tracking, dashboard analytics, and URL management.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Link href="/auth/signup" style={{
                padding: '13px 28px', borderRadius: 14, fontSize: 15,
                fontWeight: 700, color: '#fff', textDecoration: 'none',
                background: 'linear-gradient(135deg, #6363f0, #a855f7)',
                boxShadow: '0 4px 20px rgba(99,99,240,0.45)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(99,99,240,0.65)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(99,99,240,0.45)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; }}
              >
                Sign up — it's free
              </Link>
              <Link href="/auth/login" style={{
                padding: '12px 24px', borderRadius: 14, fontSize: 15,
                fontWeight: 600, color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'; }}
              >
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
