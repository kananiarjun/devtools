'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

function AuthInput({ id, label, type, placeholder, value, onChange, autoComplete, extra }: {
  id: string; label: string; type: string; placeholder: string;
  value: string; onChange: (v: string) => void; autoComplete?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{label}</label>
        {extra}
      </div>
      <input
        id={id} type={type} autoComplete={autoComplete} required placeholder={placeholder}
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 16px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12, fontSize: 15, color: '#fff',
          outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
          fontFamily: 'inherit',
        }}
        onFocus={e => {
          (e.target as HTMLInputElement).style.borderColor = 'rgba(99,99,240,0.6)';
          (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(99,99,240,0.15)';
        }}
        onBlur={e => {
          (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)';
          (e.target as HTMLInputElement).style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    } else {
      setShowSuccessModal(true);
    }
    setLoading(false);
  };

  const handleGoToDashboard = () => {
    if (!user) return;
    const redirect = searchParams.get('redirect');
    const role = user.role;
    if (role === 'ADMIN') {
      router.replace(redirect?.startsWith('/admin') ? redirect : '/admin');
    } else {
      router.replace(!redirect?.startsWith('/admin') && redirect ? redirect : '/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', background: 'var(--bg)',
      backgroundImage: `
        radial-gradient(ellipse 70% 50% at 20% 20%, rgba(99,99,240,0.15) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 80% 80%, rgba(168,85,247,0.12) 0%, transparent 60%)
      `,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36, justifyContent: 'center' }}>
          <div style={{ height: 40, width: 40, background: 'linear-gradient(135deg, #6363f0, #a855f7)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,99,240,0.45)' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>D</span>
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 18 }}>
            DevTools<span style={{ background: 'linear-gradient(135deg, #818cf8, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hub</span>
          </span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign up for free</Link>
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: 32,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#fb7185', padding: '10px 14px', borderRadius: 12, marginBottom: 24, fontSize: 13, fontWeight: 500 }}>
              <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <AuthInput id="email" label="Email address" type="email" placeholder="you@company.com" value={email} onChange={setEmail} autoComplete="email" />
            <AuthInput
              id="password" label="Password" type="password" placeholder="••••••••"
              value={password} onChange={setPassword} autoComplete="current-password"
              extra={<a href="#" style={{ fontSize: 12, color: '#818cf8', fontWeight: 500, textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'} onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'}>Forgot password?</a>}
            />

            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '13px 24px', borderRadius: 12,
              fontSize: 15, fontWeight: 700, color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'rgba(99,99,240,0.4)' : 'linear-gradient(135deg, #6363f0, #a855f7)',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(99,99,240,0.45)',
              transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
            }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(99,99,240,0.6)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(99,99,240,0.45)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
            >
              {loading ? (
                <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="animate-spin" />Signing in…</>
              ) : (
                <>Sign in to Dashboard <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 20, lineHeight: 1.6 }}>
          By signing in you agree to our{' '}
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Terms of Service</a>{' '}and{' '}
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Privacy Policy</a>.
        </p>
      </div>

      {showSuccessModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          animation: 'fade-in 0.3s ease-out'
        }}>
          <div style={{
            width: '100%', maxWidth: 400, background: '#161b27',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
            padding: 40, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            animation: 'scale-in 0.3s cubic-bezier(0.16,1,0.3,1)'
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 32, margin: '0 auto 24px', color: '#22c55e'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>Welcome back!</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, lineHeight: 1.6 }}>
              You have successfully signed in to your account.
            </p>
            <button
              onClick={handleGoToDashboard}
              style={{
                width: '100%', padding: '14px 24px', borderRadius: 12, fontSize: 16, fontWeight: 700,
                color: '#fff', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #6363f0, #a855f7)',
                boxShadow: '0 4px 20px rgba(99,99,240,0.4)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(99,99,240,0.6)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(99,99,240,0.4)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      <style>{`input::placeholder { color: rgba(255,255,255,0.2); }`}</style>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
