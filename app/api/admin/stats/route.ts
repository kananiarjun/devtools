import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get overall stats
    const totalUsers = await prisma.user.count();
    const totalUrls = await prisma.url.count();
    const totalActivities = await prisma.activity.count();
    const totalInputs = await prisma.userInput.count();

    // Get recent activity
    const recentActivities = await prisma.activity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    const normalizedRecentActivities = recentActivities.map((activity) => ({
      ...activity,
      user: {
        username: activity.user.name,
        email: activity.user.email,
      },
    }));

    // Get user growth data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    const recentUrls = await prisma.url.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalUrls,
        totalActivities,
        totalInputs,
        recentUsers,
        recentUrls,
      },
      recentActivities: normalizedRecentActivities,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get admin stats' },
      { status: 500 }
    );
  }
}
