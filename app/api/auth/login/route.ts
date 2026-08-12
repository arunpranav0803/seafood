import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken, setSessionCookie } from '@/lib/auth';
import { validateEmail, validatePassword } from '@/lib/validation';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !validateEmail(email) || !password || !validatePassword(password)) {
    return NextResponse.json({ error: 'Invalid login credentials' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const role = user.role as 'CUSTOMER' | 'ADMIN';
  const token = signToken({ userId: user.id, role });
  setSessionCookie(token);
  return NextResponse.json({ user: { id: user.id, role } });
}
