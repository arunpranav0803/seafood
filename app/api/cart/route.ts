import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionToken, verifyToken } from '@/lib/auth';

export async function GET() {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const customer = await prisma.customerProfile.findUnique({
    where: { userId: payload.userId },
    include: { cart: { include: { items: { include: { product: true } } } } }
  });

  if (!customer || !customer.cart) {
    return NextResponse.json({ cart: { items: [] } });
  }

  return NextResponse.json({ cart: customer.cart });
}

export async function POST(request: Request) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { productId, quantityKg } = body as { productId?: string; quantityKg?: number };

  if (!productId || !quantityKg || quantityKg < 1) {
    return NextResponse.json({ error: 'Invalid item data' }, { status: 400 });
  }

  const customer = await prisma.customerProfile.findUnique({ where: { userId: payload.userId } });
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  const cart = await prisma.cart.upsert({
    where: { customerId: customer.id },
    create: { customerId: customer.id },
    update: {}
  });

  const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantityKg: existingItem.quantityKg + quantityKg }
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantityKg }
    });
  }

  return NextResponse.json({ success: true });
}
