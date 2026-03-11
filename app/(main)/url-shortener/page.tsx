'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isValidUrl } from '@/utils/helpers';

interface ShortenResult { shortUrl: string; shortId: string }

export default function UrlShortenerPage() {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState<ShortenResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const { token } = useAuth();

    const shorten = async () => {
        if (!url.trim() || !isValidUrl(url)) { setError('Please enter a valid URL (include https://)'); return; }
        setLoading(true); setError(''); setResult(null);
        try {
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch('/api/shorten', { method: 'POST', headers, body: JSON.stringify({ url }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setResult(data);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to shorten URL');
        } finally {
            setLoading(false);
        }
    };

    const copy = async () => {
        if (!result) return;
        await navigator.clipboard.writeText(result.shortUrl);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="page-container">
            <div className="animate-fade-up" style={{ marginBottom: 32 }}>
                <div className="icon-ring" style={{ background: 'rgba(99,99,240,0.12)', border: '1px solid rgba(99,99,240,0.2)', marginBottom: 16 }}>
                    <span style={{ color: '#818cf8', fontSize: 20 }}>↗</span>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>URL Shortener</h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>Shorten long URLs into compact links. Sign in to track clicks.</p>
            </div>

            <div className="section-card animate-fade-up" style={{ animationDelay: '50ms' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Long URL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input
                        type="url"
                        className="input"
                        style={{ flex: 1 }}
                        placeholder="https://your-very-long-url.com/path?query=value"
                        value={url}
                        onChange={e => { setUrl(e.target.value); setError(''); }}
                        onKeyDown={e => e.key === 'Enter' && shorten()}
                    />
                    <button className="btn-primary" onClick={shorten} disabled={loading || !url.trim()}
                        style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {loading ? '…' : 'Shorten'}
                    </button>
                </div>
                {error && (
                    <p style={{ marginTop: 10, padding: '8px 12px', borderRadius: 10, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#fb7185', fontSize: 13 }}>
                        {error}
                    </p>
                )}
            </div>

            {result && (
                <div className="animate-fade-up" style={{ marginTop: 16, animationDelay: '80ms' }}>
                    <div style={{ background: 'var(--surface)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 10, borderRadius: '50%', background: '#22c55e', height: 10, boxShadow: '0 0 8px #22c55e' }} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#34d399' }}>Short URL ready!</span>
                        </div>

                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 12 }}>
                            <a href={result.shortUrl} target="_blank" rel="noreferrer"
                                style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#818cf8', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {result.shortUrl}
                            </a>
                            <button className="btn-secondary" onClick={copy} style={{ flexShrink: 0 }}>
                                {copied ? '✓ Copied!' : '⊕ Copy'}
                            </button>
                        </div>

                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            Original: <span style={{ color: 'var(--text-secondary)' }}>{url.substring(0, 70)}{url.length > 70 ? '…' : ''}</span>
                        </p>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>💡 Tip: </strong>
                    Sign in to track how many times your links are clicked and manage them from your dashboard.
                </p>
            </div>
        </div>
    );
}
