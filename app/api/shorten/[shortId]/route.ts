import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { trackActivity } from '@/lib/auth';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ shortId: string }> }
) {
    try {
        const { shortId } = await params;
        const userAgent = _request.headers.get('user-agent') || undefined;
        const forwarded = _request.headers.get('x-forwarded-for');
        const ipAddress = forwarded ? forwarded.split(',')[0] : undefined;

        const urlDoc = await prisma.url.update({
            where: { shortId },
            data: { clicks: { increment: 1 } },
            include: { user: true }
        });

        if (!urlDoc) {
            return NextResponse.json({ error: 'Short URL not found' }, { status: 404 });
        }

        // Track activity if URL belongs to a user
        if (urlDoc.userId && urlDoc.user) {
            await trackActivity(
                urlDoc.userId, 
                'url_accessed', 
                { 
                    shortId, 
                    originalUrl: urlDoc.originalUrl,
                    totalClicks: urlDoc.clicks 
                }, 
                ipAddress, 
                userAgent
            );
        }

        return NextResponse.redirect(urlDoc.originalUrl, { status: 302 });
    } catch (error) {
        console.error('Redirect error:', error);
        return NextResponse.json({ error: 'Redirect failed' }, { status: 500 });
    }
}
