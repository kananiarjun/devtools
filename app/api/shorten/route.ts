import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import { isValidUrl } from '@/utils/helpers';
import { verifyToken, trackActivity } from '@/lib/auth';

// In-memory fallback storage
const memoryStore = new Map<string, { originalUrl: string; shortId: string; createdAt: Date }>();

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url || !isValidUrl(url)) {
            return NextResponse.json({ error: 'A valid URL is required' }, { status: 400 });
        }

        // Get user from token if available
        const authHeader = request.headers.get('authorization');
        let userId = null;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyToken(token);
            userId = decoded?.id || null;
        }

        try {
            // Check if URL already shortened
            const existing = await prisma.url.findFirst({
                where: { 
                    originalUrl: url,
                    ...(userId && { userId }) // Only check user's URLs if logged in
                }
            });
            
            if (existing) {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
                return NextResponse.json({ shortUrl: `${baseUrl}/s/${existing.shortId}` });
            }

            const shortId = nanoid(7);
            const urlData: any = { originalUrl: url, shortId };
            if (userId) urlData.userId = userId;

            await prisma.url.create({ data: urlData });

            // Track activity if user is logged in
            if (userId) {
                const userAgent = request.headers.get('user-agent') || undefined;
                const forwarded = request.headers.get('x-forwarded-for');
                const ipAddress = forwarded ? forwarded.split(',')[0] : undefined;
                
                await trackActivity(userId, 'url_created', { originalUrl: url, shortId }, ipAddress, userAgent);
            }

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            return NextResponse.json({ shortUrl: `${baseUrl}/s/${shortId}`, shortId });
        } catch (dbError) {
            console.warn('PostgreSQL unavailable, using in-memory storage:', dbError);
            
            // Check memory store for existing URL
            const existing = Array.from(memoryStore.values()).find(item => item.originalUrl === url);
            if (existing) {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
                return NextResponse.json({ shortUrl: `${baseUrl}/s/${existing.shortId}` });
            }

            const shortId = nanoid(7);
            memoryStore.set(shortId, { originalUrl: url, shortId, createdAt: new Date() });

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            return NextResponse.json({ shortUrl: `${baseUrl}/s/${shortId}`, shortId });
        }
    } catch (error) {
        console.error('URL shortening error:', error);
        return NextResponse.json({ error: 'Failed to shorten URL' }, { status: 500 });
    }
}
