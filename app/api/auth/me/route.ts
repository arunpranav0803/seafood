import { NextResponse } from 'next/server';
import { getSessionToken, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const token = getSessionToken();
  if (!token) {
    return NextResponse.json({ user: null });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ user: null });
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true, createdAt: true }
  });
  return NextResponse.json({ user });
}
