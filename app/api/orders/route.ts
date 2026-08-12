import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionToken, verifyToken } from '@/lib/auth';
import { publishOrderUpdate, publishNotification } from '@/lib/realtime';

export async function POST(request: Request) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { addressId } = body as { addressId?: string };

  if (!addressId) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  const customer = await prisma.customerProfile.findUnique({
    where: { userId: payload.userId },
    include: { cart: { include: { items: { include: { product: true } } } } }
  });

  if (!customer || !customer.cart || customer.cart.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.customerId !== customer.id) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  let subtotal = 0;
  for (const item of customer.cart.items) {
    if (item.quantityKg > item.product.stockKg) {
      return NextResponse.json({ error: `${item.product.name} is unavailable in the requested quantity` }, { status: 400 });
    }
    subtotal += item.product.pricePerKg * item.quantityKg;
  }

  const deliveryFee = 60;
  const discount = 0;
  const totalAmount = subtotal + deliveryFee - discount;

  const order = await prisma.order.create({
    data: {
      orderNumber: `SF${Date.now()}`,
      customerId: customer.id,
      addressId: address.id,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      paymentStatus: 'COMPLETED',
      orderStatus: 'PENDING',
      items: {
        create: customer.cart.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          pricePerKg: item.product.pricePerKg,
          quantityKg: item.quantityKg,
          subtotal: item.product.pricePerKg * item.quantityKg
        }))
      },
      statusHistory: {
        create: {
          status: 'PENDING',
          message: 'Order received and awaiting confirmation',
          updatedBy: payload.userId
        }
      }
    }
  });

  await prisma.cartItem.deleteMany({ where: { cartId: customer.cart.id } });

  await publishOrderUpdate(order.id, { orderId: order.id, status: order.orderStatus });
  await publishNotification(payload.userId, {
    title: 'Order placed',
    body: `Your seafood order ${order.orderNumber} is confirmed in the system.`,
    orderId: order.id
  });

  return NextResponse.json({ order });
}

export async function GET() {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const customer = await prisma.customerProfile.findUnique({ where: { userId: payload.userId } });
  if (!customer) {
    return NextResponse.json({ orders: [] });
  }

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ orders });
}
