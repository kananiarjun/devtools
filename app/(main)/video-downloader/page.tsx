'use client';

import { useState } from 'react';

export default function VideoDownloaderPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [videoInfo, setVideoInfo] = useState<{
        title: string;
        author: string;
        duration: number;
        thumbnail: string;
        formats: Array<{ quality: string; container: string; itag: string | number; size: string }>;
        source?: string;
    } | null>(null);

    const fetchVideoInfo = async () => {
        if (!url.trim()) return;
        setLoading(true);
        setError('');
        setVideoInfo(null);

        try {
            const res = await fetch('/api/video-download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch video info');
            }

            setVideoInfo(data);
        } catch (e: any) {
            setError(e.message || 'Failed to connect to video service');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (itag: string | number) => {
        const downloadUrl = `/api/video-download?url=${encodeURIComponent(url)}&itag=${itag}`;
        window.open(downloadUrl, '_blank');
    };

    const formatDuration = (seconds: number) => {
        if (!seconds) return 'Unknown';
        const s = Math.floor(seconds);
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="page-container" style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
            <div className="animate-fade-up" style={{ marginBottom: 32, textAlign: 'center' }}>
                <div className="icon-ring" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', marginBottom: 20, margin: '0 auto 20px' }}>
                    <span style={{ color: '#3b82f6', fontSize: 24 }}>📥</span>
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>
                    Universal <span style={{ color: '#3b82f6' }}>Downloader</span>
                </h1>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 8 }}>
                    Paste a link from YouTube, FB, IG, TikTok, or any other platform.
                </p>
            </div>

            <div className="section-card animate-fade-up" style={{ padding: 32, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="url"
                            className="input"
                            placeholder="Paste video URL here..."
                            value={url}
                            onChange={e => { setUrl(e.target.value); setError(''); }}
                            onKeyDown={e => e.key === 'Enter' && fetchVideoInfo()}
                            style={{
                                width: '100%', padding: '14px 20px', borderRadius: 14,
                                background: 'var(--bg)', border: '1px solid var(--border)',
                                color: 'var(--text-primary)', fontSize: 15
                            }}
                        />
                    </div>
                    <button
                        className="btn-primary"
                        style={{
                            padding: '0 28px', borderRadius: 14, background: '#3b82f6',
                            color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer'
                        }}
                        onClick={fetchVideoInfo}
                        disabled={!url.trim() || loading}
                    >
                        {loading ? 'Analyzing...' : 'Fetch Video'}
                    </button>
                </div>
                {error && (
                    <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>✕</span> {error}
                    </div>
                )}
            </div>

            {videoInfo && (
                <div className="animate-fade-up" style={{ marginTop: 32 }}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden' }}>
                        <div style={{ display: 'md-flex', gap: 24, padding: 24 }}>
                            {videoInfo.thumbnail && (
                                <div style={{ flexShrink: 0, marginBottom: '20px' }}>
                                    <img src={videoInfo.thumbnail} alt={videoInfo.title} style={{ width: '100%', maxWidth: 280, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }} />
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20, background: '#3b82f6', color: '#fff' }}>
                                        {videoInfo.source || 'Video'}
                                    </span>
                                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>• {formatDuration(videoInfo.duration)}</span>
                                </div>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px', lineHeight: 1.3 }}>{videoInfo.title}</h2>
                                <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: '0 0 16px' }}>by {videoInfo.author}</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Download Formats</h3>
                                    {videoInfo.formats.map((f, i) => (
                                        <div key={i} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '12px 16px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.quality}</span>
                                                <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--surface)', padding: '2px 8px', borderRadius: 6 }}>{f.container.toUpperCase()}</span>
                                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.size}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDownload(f.itag)}
                                                style={{
                                                    padding: '6px 16px', borderRadius: 8, background: '#3b82f6',
                                                    color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 13
                                                }}
                                            >
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 32, padding: 20, borderRadius: 16, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: '#d97706', margin: 0, lineHeight: 1.5 }}>
                    <strong>⚠ Important:</strong> This tool is for personal use only. Please respect copyrights and YouTube's Terms of Service. Do not download content you don't have permission for.
                </p>
            </div>

            <style>{`
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-up { animation: fade-up 0.5s ease-out forwards; }
                @media (min-width: 768px) {
                    div[style*="display: md-flex"] { display: flex !important; }
                    div[style*="marginBottom: '20px'"] { margin-bottom: 0 !important; }
                }
            `}</style>
        </div>
    );
}
