import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
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
      category: { select: { name: true, slug: true } }
    }
  });

  return NextResponse.json({ products });
}
