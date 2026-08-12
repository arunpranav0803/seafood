import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, setSessionCookie } from '@/lib/auth';
import { validateEmail, validatePassword } from '@/lib/validation';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !validateEmail(email) || !password || !validatePassword(password)) {
    return NextResponse.json({ error: 'Invalid signup details' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'CUSTOMER'
    }
  });

  await prisma.customerProfile.create({ data: { userId: user.id, fullName: 'New Customer' } });

  const role = user.role as 'CUSTOMER' | 'ADMIN';
  const token = signToken({ userId: user.id, role });
  setSessionCookie(token);

  return NextResponse.json({ user: { id: user.id, role } });
}
