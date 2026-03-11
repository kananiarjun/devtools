'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultDisplay from '@/components/ResultDisplay';

export default function VideoToAudioPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const [error, setError] = useState('');

    const convert = async () => {
        if (!file) return;
        setLoading(true); setError(''); setAudioUrl('');
        try {
            const fd = new FormData();
            fd.append('video', file);
            const res = await fetch('/api/audio', { method: 'POST', body: fd });
            if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
            const blob = await res.blob();
            setAudioUrl(URL.createObjectURL(blob));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Conversion failed');
        } finally {
            setLoading(false);
        }
    };

    const download = () => {
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = `${file?.name?.replace(/\.[^/.]+$/, '') || 'audio'}.mp3`;
        a.click();
    };

    return (
        <div className="page-container">
            <div className="animate-fade-up" style={{ marginBottom: 32 }}>
                <div className="icon-ring" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', marginBottom: 16 }}>
                    <span style={{ color: '#059669', fontSize: 20 }}>♫</span>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>Video → Audio</h1>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>Extract high-quality MP3 audio from any video file via FFmpeg.</p>
            </div>

            <div className="section-card animate-fade-up" style={{ animationDelay: '50ms' }}>
                <FileUpload accept="video/*" onFile={setFile} label="Upload a video file" hint="MP4, AVI, MOV, MKV" />
                <button className="btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={convert} disabled={!file || loading}>
                    {loading ? (
                        <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} className="animate-spin" /> Converting…</>
                    ) : 'Convert to MP3'}
                </button>
                {error && <p style={{ marginTop: 10, padding: '8px 12px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }}>{error}</p>}
            </div>

            {audioUrl && (
                <div className="animate-fade-up" style={{ marginTop: 16, animationDelay: '100ms' }}>
                    <ResultDisplay title="audio.mp3">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>♫</div>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: 0 }}>Conversion complete</p>
                                    <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Preview and download below</p>
                                </div>
                            </div>
                            <audio controls style={{ width: '100%', borderRadius: 12 }} src={audioUrl} />
                            <button className="btn-primary" style={{ width: '100%' }} onClick={download}>⬇ Download MP3</button>
                        </div>
                    </ResultDisplay>
                </div>
            )}

            <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7ec' }}>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    <strong style={{ color: '#374151' }}>⚙ Server requirement: </strong>
                    Requires FFmpeg installed on the server.
                </p>
            </div>
        </div>
    );
}
