'use client';

import { useState } from 'react';
import ResultDisplay from '@/components/ResultDisplay';

export default function QrGeneratorPage() {
    const [text, setText] = useState('');
    const [size, setSize] = useState(256);
    const [qrCode, setQrCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generate = async () => {
        if (!text.trim()) return;
        setLoading(true); setError(''); setQrCode('');
        try {
            const res = await fetch('/api/qr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, size }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setQrCode(data.qrCode);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to generate QR code');
        } finally {
            setLoading(false);
        }
    };

    const download = () => {
        const a = document.createElement('a');
        a.href = qrCode;
        a.download = 'qr-code.png';
        a.click();
    };

    return (
        <div className="page-container">
            <div className="animate-fade-up" style={{ marginBottom: 32 }}>
                <div className="icon-ring" style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)', marginBottom: 16 }}>
                    <span style={{ color: '#a855f7', fontSize: 20 }}>⊞</span>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>QR Generator</h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>Create QR codes for URLs, text, Wi-Fi passwords, or any content.</p>
            </div>

            <div className="section-card animate-fade-up" style={{ animationDelay: '50ms' }}>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Content</label>
                    <textarea
                        className="input"
                        placeholder="Enter URL, text, or any content…"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        rows={3}
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Size</label>
                        <span style={{ fontSize: 22, fontWeight: 800, color: '#a855f7' }}>{size}px</span>
                    </div>
                    <input type="range" min={128} max={512} step={64} value={size} onChange={e => setSize(+e.target.value)}
                        style={{ width: '100%', height: 6, appearance: 'none', borderRadius: 4, background: `linear-gradient(to right, #a855f7 ${((size - 128) / 384) * 100}%, rgba(255,255,255,0.1) 0%)`, cursor: 'pointer' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        <span>128px</span><span>512px</span>
                    </div>
                </div>

                <button className="btn-primary" style={{ width: '100%' }} onClick={generate} disabled={!text.trim() || loading}>
                    {loading ? 'Generating…' : 'Generate QR Code'}
                </button>
                {error && <p style={{ marginTop: 10, padding: '8px 12px', borderRadius: 10, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#fb7185', fontSize: 13 }}>{error}</p>}
            </div>

            {qrCode && (
                <div className="animate-fade-up" style={{ marginTop: 16, animationDelay: '100ms' }}>
                    <ResultDisplay title="qr-code.png">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                            <img src={qrCode} alt="QR Code" style={{ borderRadius: 12, border: '1px solid var(--border)', maxWidth: '100%', background: '#fff', padding: 8 }} />
                            <button className="btn-primary" style={{ width: '100%' }} onClick={download}>⬇ Download QR Code</button>
                        </div>
                    </ResultDisplay>
                </div>
            )}
        </div>
    );
}
