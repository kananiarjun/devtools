'use client';
import { ReactNode } from 'react';

interface ResultDisplayProps {
    title?: string;
    children: ReactNode;
    className?: string;
}

export default function ResultDisplay({ title = 'output', children, className = '' }: ResultDisplayProps) {
    return (
        <div className={`result-panel ${className}`}>
            <div className="result-panel-header">
                <div className="traffic-lights">
                    <span className="tl-r" />
                    <span className="tl-y" />
                    <span className="tl-g" />
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9ca3af' }}>{title}</span>
            </div>
            <div style={{ padding: 20 }}>{children}</div>
        </div>
    );
}
