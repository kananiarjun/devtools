import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken, trackActivity } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { name: username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? 'Email already exists' : 'Username already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name: username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    const authUser = {
      id: user.id,
      email: user.email,
      username: user.name,
      role: user.role,
    };

    // Track signup activity
    await trackActivity(user.id, 'signup', { email, username });

    // Generate token
    const token = generateToken(authUser);

    const response = NextResponse.json({
      message: 'User created successfully',
      user: {
        ...authUser,
        createdAt: user.createdAt,
      },
      token,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
