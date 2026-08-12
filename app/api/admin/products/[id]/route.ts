import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionToken, verifyToken } from '@/lib/auth';
import { publishCatalogUpdate } from '@/lib/realtime';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true }
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.name) data.name = String(body.name);
  if (body.slug) data.slug = String(body.slug).trim().toLowerCase().replace(/\s+/g, '-');
  if (body.description) data.description = String(body.description);
  if (body.categoryId) data.categoryId = String(body.categoryId);
  if (body.mrp !== undefined) data.mrp = Number(body.mrp);
  if (body.pricePerKg !== undefined) data.pricePerKg = Number(body.pricePerKg);
  if (body.discountPercentage !== undefined) data.discountPercentage = Number(body.discountPercentage);
  if (body.unit) data.unit = String(body.unit);
  if (body.stockKg !== undefined) data.stockKg = Number(body.stockKg);
  if (body.available !== undefined) data.available = Boolean(body.available);
  if (body.featured !== undefined) data.featured = Boolean(body.featured);
  if (body.bestseller !== undefined) data.bestseller = Boolean(body.bestseller);
  if (body.isNew !== undefined) data.isNew = Boolean(body.isNew);
  if (body.rating !== undefined) data.rating = Number(body.rating);
  if (body.reviewCount !== undefined) data.reviewCount = Number(body.reviewCount);
  if (body.primaryImage) data.primaryImage = String(body.primaryImage);
  if (body.imageUrl) data.imageUrl = String(body.imageUrl);
  if (body.tags !== undefined) data.tags = body.tags ? String(body.tags) : null;
  if (body.cleaningAvailable !== undefined) data.cleaningAvailable = Boolean(body.cleaningAvailable);
  if (body.cleaningPrice !== undefined) data.cleaningPrice = Number(body.cleaningPrice);
  if (body.status) data.status = String(body.status);
  if (body.catchDate) data.catchDate = new Date(String(body.catchDate));
  if (body.catchLocation) data.catchLocation = String(body.catchLocation);

  const product = await prisma.product.update({
    where: { id: params.id },
    data
  });

  await publishCatalogUpdate({
    event: 'catalog.product.updated',
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      pricePerKg: product.pricePerKg,
      stockKg: product.stockKg,
      catchDate: product.catchDate,
      catchLocation: product.catchLocation,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      status: product.status
    }
  });

  return NextResponse.json({ product });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await prisma.product.delete({ where: { id: params.id } });

  await publishCatalogUpdate({
    event: 'catalog.product.deleted',
    product: { id: params.id }
  });

  return NextResponse.json({ success: true });
}
