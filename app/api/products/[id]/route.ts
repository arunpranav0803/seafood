import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      pricePerKg: true,
      stockKg: true,
      catchDate: true,
      catchLocation: true,
      imageUrl: true,
      status: true,
      category: { select: { name: true, slug: true } }
    }
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}
