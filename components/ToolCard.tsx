'use client';

import Link from 'next/link';

interface ToolCardProps {
    href: string;
    icon: string;
    title: string;
    description: string;
    color: string;
    bgColor: string;
    tag?: 'Popular' | 'AI' | 'Free';
}

export default function ToolCard({ href, icon, title, description, color, bgColor, tag }: ToolCardProps) {
    const tagClass = tag === 'Popular' ? 'tag tag-popular' : tag === 'AI' ? 'tag tag-ai' : tag === 'Free' ? 'tag tag-free' : '';

    return (
        <Link
            href={href}
            className="tool-card-link"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: 24,
                height: '100%',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                textDecoration: 'none',
                transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = color + '40';
                el.style.boxShadow = `0 0 0 1px ${color}25, 0 12px 40px ${color}18, 0 4px 12px rgba(0,0,0,0.3)`;
                el.style.transform = 'translateY(-4px)';
                const icon = el.querySelector('.tc-icon') as HTMLElement;
                if (icon) icon.style.boxShadow = `0 0 20px ${color}40`;
                const arrow = el.querySelector('.tc-arrow') as HTMLElement;
                if (arrow) arrow.style.transform = 'translateX(4px)';
                const shine = el.querySelector('.tc-shine') as HTMLElement;
                if (shine) shine.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'var(--border)';
                el.style.boxShadow = 'none';
                el.style.transform = 'translateY(0)';
                const icon = el.querySelector('.tc-icon') as HTMLElement;
                if (icon) icon.style.boxShadow = 'none';
                const arrow = el.querySelector('.tc-arrow') as HTMLElement;
                if (arrow) arrow.style.transform = 'translateX(0)';
                const shine = el.querySelector('.tc-shine') as HTMLElement;
                if (shine) shine.style.opacity = '0';
            }}
        >
            {/* Shine overlay */}
            <div className="tc-shine" style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: `radial-gradient(ellipse at top left, ${color}08 0%, transparent 60%)`,
                opacity: 0, transition: 'opacity 0.3s',
                borderRadius: 'inherit',
            }} />

            {/* Top accent bar */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${color}00, ${color}90, ${color}00)`,
                borderRadius: '20px 20px 0 0',
                opacity: 0,
                transition: 'opacity 0.25s',
            }} className="tc-top-bar" />

            {/* Header: icon + tag */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div
                    className="tc-icon"
                    style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: bgColor,
                        border: `1px solid ${color}25`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        transition: 'box-shadow 0.25s, transform 0.25s',
                    }}
                >
                    {icon}
                </div>
                {tag && <span className={tagClass}>{tag}</span>}
            </div>

            {/* Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{description}</p>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color }}>
                Open tool
                <span className="tc-arrow" style={{ transition: 'transform 0.2s', display: 'inline-block' }}>→</span>
            </div>
        </Link>
    );
}
