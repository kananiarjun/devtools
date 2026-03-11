'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { formatFileSize } from '@/utils/helpers';

interface FileUploadProps {
    accept?: string;
    onFile: (file: File) => void;
    label?: string;
    hint?: string;
}

export default function FileUpload({ accept = '*', onFile, label = 'Upload a file', hint }: FileUploadProps) {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File) => { setFile(f); onFile(f); };
    const onDrop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); };
    const onChange = (e: ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) handleFile(f); };

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            style={{
                border: `2px dashed ${dragging ? '#6363f0' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 16,
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragging ? 'rgba(99,99,240,0.08)' : 'var(--bg-elevated)',
                transition: 'border-color 0.2s, background 0.2s',
            }}
        >
            <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={onChange} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: dragging ? 'rgba(99,99,240,0.18)' : 'var(--bg-tertiary)',
                    border: `1px solid ${dragging ? 'rgba(99,99,240,0.4)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    color: dragging ? '#818cf8' : 'var(--text-muted)',
                }}>
                    {dragging ? '✦' : '↑'}
                </div>
                <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>{label}</p>
                    {hint && <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>{hint}</p>}
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                        Drag & drop or <span style={{ color: '#818cf8', fontWeight: 500 }}>browse files</span>
                    </p>
                </div>
            </div>
            {file && (
                <div style={{
                    marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px', borderRadius: 10, fontSize: 13,
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399',
                }}>
                    <span>✓</span>
                    <span style={{ fontWeight: 500 }}>{file.name}</span>
                    <span style={{ color: 'rgba(52,211,153,0.6)', fontSize: 11 }}>{formatFileSize(file.size)}</span>
                </div>
            )}
        </div>
    );
}
