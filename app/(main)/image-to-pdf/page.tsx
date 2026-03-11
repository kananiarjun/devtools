'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultDisplay from '@/components/ResultDisplay';

export default function ImageToPdfPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    const convert = async () => {
        if (!file) return;
        setLoading(true); setError(''); setDone(false);
        try {
            const { jsPDF } = await import('jspdf');
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgData = e.target?.result as string;
                const img = new Image();
                img.onload = () => {
                    const pdf = new jsPDF({
                        orientation: img.width > img.height ? 'landscape' : 'portrait',
                        unit: 'px',
                        format: [img.width, img.height],
                    });
                    pdf.addImage(imgData, 'JPEG', 0, 0, img.width, img.height);
                    pdf.save(`${file.name.replace(/\.[^/.]+$/, '')}.pdf`);
                    setDone(true);
                    setLoading(false);
                };
                img.src = imgData;
            };
            reader.readAsDataURL(file);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Conversion failed');
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="animate-fade-up" style={{ marginBottom: 32 }}>
                <div className="icon-ring" style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', marginBottom: 16 }}>
                    <span style={{ color: '#db2777', fontSize: 20 }}>📄</span>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>Image to PDF</h1>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>Convert images to PDF directly in your browser — no server upload needed.</p>
            </div>

            <div className="section-card animate-fade-up" style={{ animationDelay: '50ms' }}>
                <FileUpload accept="image/*" onFile={setFile} label="Upload an image" hint="JPG, PNG, WebP, GIF" />
                <button className="btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={convert} disabled={!file || loading}>
                    {loading ? 'Converting…' : 'Convert to PDF'}
                </button>
                {error && <p style={{ marginTop: 10, padding: '8px 12px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }}>{error}</p>}
            </div>

            {done && (
                <div className="animate-fade-up" style={{ marginTop: 16 }}>
                    <ResultDisplay title="image.pdf">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fdf2f8', border: '1px solid #fbcfe8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777', fontSize: 18 }}>📄</div>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: 0 }}>PDF generated!</p>
                                    <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Your download should have started automatically.</p>
                                </div>
                            </div>
                            <button className="btn-secondary" style={{ width: '100%' }} onClick={convert}>Convert another</button>
                        </div>
                    </ResultDisplay>
                </div>
            )}

            <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: '#f9fafb', border: '1px solid #e5e7ec' }}>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    <strong style={{ color: '#374151' }}>🔒 Privacy: </strong>
                    Conversion happens entirely in your browser. No files leave your device.
                </p>
            </div>
        </div>
    );
}
