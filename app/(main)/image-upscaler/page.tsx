'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultDisplay from '@/components/ResultDisplay';

export default function ImageUpscalerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [upscaledUrl, setUpscaledUrl] = useState('');
    const [scale, setScale] = useState(2);

    const upscale = async () => {
        if (!file) return;
        setLoading(true); setError(''); setUpscaledUrl('');
        try {
            const fd = new FormData();
            fd.append('image', file);
            fd.append('scale', String(scale));
            const res = await fetch('/api/upscale', { method: 'POST', body: fd });
            if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
            const blob = await res.blob();
            setUpscaledUrl(URL.createObjectURL(blob));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Upscaling failed');
        } finally {
            setLoading(false);
        }
    };

    const download = () => {
        const a = document.createElement('a');
        a.href = upscaledUrl;
        a.download = `upscaled-${scale}x-${file?.name || 'image.jpg'}`;
        a.click();
    };

    return (
        <div className="page-container">
            <div className="animate-fade-up" style={{ marginBottom: 32 }}>
                <div className="icon-ring" style={{ background: '#eef2ff', border: '1px solid #c7d2fe', marginBottom: 16 }}>
                    <span style={{ color: '#4f46e5', fontSize: 20 }}>✦</span>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>Image Upscaler</h1>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>AI-powered image enhancement using server-side sharp processing.</p>
            </div>

            <div className="section-card animate-fade-up" style={{ animationDelay: '50ms' }}>
                <FileUpload accept="image/*" onFile={setFile} label="Upload an image" hint="JPG, PNG, WebP" />

                <div style={{ margin: '16px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Scale Factor</span>
                        <span style={{ fontSize: 22, fontWeight: 800, color: '#4f46e5' }}>{scale}×</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[2, 3, 4].map(s => (
                            <button key={s} onClick={() => setScale(s)} style={{
                                flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                border: `1px solid ${scale === s ? '#4f46e5' : '#e5e7ec'}`,
                                background: scale === s ? '#eef2ff' : '#fff',
                                color: scale === s ? '#4f46e5' : '#6b7280',
                                transition: 'all 0.15s',
                            }}>
                                {s}× {s === 2 ? '(Recommended)' : s === 3 ? '(High)' : '(Ultra)'}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="btn-primary" style={{ width: '100%' }} onClick={upscale} disabled={!file || loading}>
                    {loading ? (
                        <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} className="animate-spin" /> Upscaling…</>
                    ) : `Upscale ${scale}×`}
                </button>
                {error && <p style={{ marginTop: 10, padding: '8px 12px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }}>{error}</p>}
            </div>

            {upscaledUrl && (
                <div className="animate-fade-up" style={{ marginTop: 16, animationDelay: '100ms' }}>
                    <ResultDisplay title={`upscaled-${scale}x.jpg`}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <img src={upscaledUrl} alt="Upscaled" style={{ borderRadius: 12, border: '1px solid #e5e7eb', width: '100%', objectFit: 'contain', maxHeight: 400 }} />
                            <button className="btn-primary" style={{ width: '100%' }} onClick={download}>⬇ Download Upscaled Image</button>
                        </div>
                    </ResultDisplay>
                </div>
            )}
        </div>
    );
}
