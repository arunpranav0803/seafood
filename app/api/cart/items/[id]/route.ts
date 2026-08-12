import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionToken, verifyToken } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const quantityKg = Number(body.quantityKg ?? 0);
  if (!quantityKg || quantityKg < 1) {
    return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
  }

  const cartItem = await prisma.cartItem.update({
    where: { id: params.id },
    data: { quantityKg }
  });

  return NextResponse.json({ cartItem });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await prisma.cartItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
