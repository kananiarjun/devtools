'use client';

import { useState } from 'react';
import ResultDisplay from '@/components/ResultDisplay';

export default function PasswordGeneratorPage() {
    const [length, setLength] = useState(16);
    const [useSymbols, setUseSymbols] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useUpper, setUseUpper] = useState(true);
    const [password, setPassword] = useState('');
    const [copied, setCopied] = useState(false);

    const generate = () => {
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let charset = lower + (useUpper ? upper : '');
        if (useNumbers) charset += nums;
        if (useSymbols) charset += syms;
        const arr = new Uint32Array(length);
        crypto.getRandomValues(arr);
        setPassword(Array.from(arr, v => charset[v % charset.length]).join(''));
        setCopied(false);
    };

    const copy = async () => {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const strength = !password ? 0 : Math.min(Math.floor(password.length / 6) + (useSymbols ? 1 : 0) + (useNumbers ? 1 : 0) + (useUpper ? 1 : 0), 5);
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][strength];
    const strengthColor = ['', '#f43f5e', '#f59e0b', '#84cc16', '#22c55e', '#10b981'][strength];

    const OPTIONS = [
        { label: 'Uppercase', sub: 'A–Z', val: useUpper, set: setUseUpper },
        { label: 'Numbers', sub: '0–9', val: useNumbers, set: setUseNumbers },
        { label: 'Symbols', sub: '!@#$', val: useSymbols, set: setUseSymbols },
    ];

    return (
        <div className="page-container">
            <div className="animate-fade-up" style={{ marginBottom: 32 }}>
                <div className="icon-ring" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 16 }}>
                    <span style={{ color: '#f59e0b', fontSize: 20 }}>◈</span>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>Password Generator</h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>
                    Cryptographically secure passwords using{' '}
                    <code style={{ fontSize: 12, background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-secondary)' }}>crypto.getRandomValues</code>
                </p>
            </div>

            <div className="section-card animate-fade-up" style={{ animationDelay: '50ms' }}>
                <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Password Length</span>
                        <span style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>{length}</span>
                    </div>
                    <input type="range" min={8} max={64} value={length} onChange={e => setLength(+e.target.value)}
                        style={{ width: '100%', height: 6, appearance: 'none', borderRadius: 4, background: `linear-gradient(to right, #f59e0b ${((length - 8) / 56) * 100}%, rgba(255,255,255,0.1) 0%)`, cursor: 'pointer' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        <span>8</span><span>64</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                    {OPTIONS.map(opt => (
                        <button key={opt.label} onClick={() => opt.set(!opt.val)} style={{
                            padding: 12, borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                            border: `1px solid ${opt.val ? 'rgba(245,158,11,0.4)' : 'var(--border)'}`,
                            background: opt.val ? 'rgba(245,158,11,0.1)' : 'var(--bg-elevated)', transition: 'all 0.15s',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: opt.val ? '#f59e0b' : 'var(--text-secondary)' }}>{opt.label}</span>
                                <div style={{ width: 16, height: 16, borderRadius: '50%', background: opt.val ? '#f59e0b' : 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {opt.val && <span style={{ color: '#fff', fontSize: 9, fontWeight: 900 }}>✓</span>}
                                </div>
                            </div>
                            <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)', margin: 0 }}>{opt.sub}</p>
                        </button>
                    ))}
                </div>

                <button className="btn-primary" style={{ width: '100%' }} onClick={generate}>Generate Password</button>
            </div>

            {password && (
                <div className="animate-fade-up" style={{ marginTop: 16, animationDelay: '100ms' }}>
                    <ResultDisplay title="password.txt">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: 15, letterSpacing: '0.1em', wordBreak: 'break-all', color: 'var(--text-primary)' }}>
                                {password}
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Strength</span>
                                    <span style={{ color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 3 }}>
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < strength ? strengthColor : 'var(--bg-tertiary)', transition: 'background 0.3s' }} />
                                    ))}
                                </div>
                            </div>
                            <button className="btn-secondary" style={{ width: '100%' }} onClick={copy}>
                                {copied ? '✓ Copied!' : '⊕ Copy Password'}
                            </button>
                        </div>
                    </ResultDisplay>
                </div>
            )}
        </div>
    );
}
