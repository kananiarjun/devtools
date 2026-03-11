import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export async function trackActivity(userId: string, action: string, metadata?: any, ipAddress?: string, userAgent?: string) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        action,
        metadata: metadata || {},
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to track activity:', error);
  }
}

export async function trackUserInput(userId: string, tool: string, input: any, output?: any, ipAddress?: string, userAgent?: string) {
  try {
    await prisma.userInput.create({
      data: {
        userId,
        tool,
        input,
        output,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to track user input:', error);
  }
}

export async function createAdmin(email: string, username: string, password: string) {
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: {
      email,
      name: username,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
}
