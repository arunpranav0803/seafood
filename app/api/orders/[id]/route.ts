import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionToken, verifyToken } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const customer = await prisma.customerProfile.findUnique({ where: { userId: payload.userId } });
  if (!customer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const order = await prisma.order.findFirst({
    where: { id: params.id, customerId: customer.id },
    include: { items: true, statusHistory: { orderBy: { createdAt: 'asc' } } }
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ order });
}
