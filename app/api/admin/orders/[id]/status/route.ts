import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionToken, verifyToken } from '@/lib/auth';
import { publishOrderUpdate, publishNotification } from '@/lib/realtime';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { status, message } = body as { status?: string; message?: string };
  if (!status) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  }

  const validStatuses = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'READY_FOR_DISPATCH',
    'DISPATCHED',
    'REACHED',
    'DELIVERED',
    'CANCELLED'
  ];

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { orderStatus: status as any },
    include: { customer: true }
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: order.id,
      status: status as any,
      message: message ?? `Order status updated to ${status}`,
      updatedBy: payload.userId
    }
  });

  await publishOrderUpdate(order.id, { orderId: order.id, status: order.orderStatus });

  await publishNotification(order.customer.userId, {
    title: 'Order status updated',
    body: `Your seafood order ${order.orderNumber} is now ${status.toLowerCase().replace(/_/g, ' ')}.`,
    orderId: order.id
  });

  return NextResponse.json({ order });
}
