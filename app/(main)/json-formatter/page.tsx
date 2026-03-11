'use client';

import { useState } from 'react';
import ResultDisplay from '@/components/ResultDisplay';
import { isValidJson, formatJson } from '@/utils/helpers';

export default function JsonFormatterPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const format = () => {
        if (!input.trim()) return;
        if (!isValidJson(input)) { setError('Invalid JSON — check your syntax'); setOutput(''); return; }
        setError(''); setOutput(formatJson(input));
    };

    const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const clear = () => { setInput(''); setOutput(''); setError(''); };

    return (
        <div className="page-container-md" style={{ maxWidth: 960 }}>
            <div className="animate-fade-up" style={{ marginBottom: 32 }}>
                <div className="icon-ring" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)', marginBottom: 16 }}>
                    <span style={{ color: '#06b6d4', fontFamily: 'monospace', fontWeight: 900, fontSize: 16 }}>{'{}'}</span>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>JSON Formatter</h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>Validate, beautify, and inspect JSON with syntax error detection.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="animate-fade-up">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Raw JSON</span>
                        <button onClick={clear} style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
                    </div>
                    <textarea className="input" style={{ height: 320, fontFamily: 'monospace', fontSize: 13, color: '#34d399', resize: 'vertical' }}
                        placeholder={'{\n  "key": "value"\n}'} value={input} onChange={e => setInput(e.target.value)} spellCheck={false} />
                    <button className="btn-primary" style={{ width: '100%' }} onClick={format} disabled={!input.trim()}>Format JSON</button>
                    {error && <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#fb7185', fontSize: 13 }}>✕ {error}</div>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Formatted</span>
                        {output && <button onClick={copy} style={{ fontSize: 12, color: '#06b6d4', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>{copied ? '✓ Copied' : '⊕ Copy'}</button>}
                    </div>
                    {output ? (
                        <ResultDisplay title="formatted.json">
                            <pre style={{ fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap', color: '#34d399', margin: 0, maxHeight: 280, overflow: 'auto' }}>{output}</pre>
                        </ResultDisplay>
                    ) : (
                        <div style={{ height: 320, borderRadius: 14, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Formatted output appears here</p>
                        </div>
                    )}
                    {output && (
                        <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', fontSize: 12 }}>
                            ✓ Valid JSON · {output.split('\n').length} lines · {new Blob([output]).size} bytes
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
