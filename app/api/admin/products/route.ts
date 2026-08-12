import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionToken, verifyToken } from '@/lib/auth';
import { publishCatalogUpdate } from '@/lib/realtime';

export async function POST(request: Request) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const {
    name,
    slug,
    description,
    categoryId,
    mrp,
    pricePerKg,
    discountPercentage,
    unit,
    stockKg,
    available,
    featured,
    bestseller,
    isNew,
    rating,
    reviewCount,
    catchDate,
    catchLocation,
    imageUrl,
    primaryImage,
    tags,
    cleaningAvailable,
    cleaningPrice,
    status
  } = body as Record<string, unknown>;

  if (!name || !description || !categoryId || !pricePerKg || !stockKg || !catchDate || !catchLocation || !imageUrl) {
    return NextResponse.json({ error: 'Missing required product data' }, { status: 400 });
  }

  const normalizedSlug = slug
    ? String(slug).trim().toLowerCase().replace(/\s+/g, '-')
    : String(name).trim().toLowerCase().replace(/\s+/g, '-');

  const product = await prisma.product.create({
    data: {
      name: String(name),
      slug: normalizedSlug,
      description: String(description),
      categoryId: String(categoryId),
      mrp: Number(mrp ?? 0),
      pricePerKg: Number(pricePerKg),
      discountPercentage: Number(discountPercentage ?? 0),
      unit: String(unit ?? 'kg'),
      stockKg: Number(stockKg),
      available: available === false ? false : true,
      featured: featured === true,
      bestseller: bestseller === true,
      isNew: isNew === true,
      rating: Number(rating ?? 4.8),
      reviewCount: Number(reviewCount ?? 0),
      catchDate: new Date(String(catchDate)),
      catchLocation: String(catchLocation),
      imageUrl: String(imageUrl),
      primaryImage: String(primaryImage ?? imageUrl),
      tags: tags ? String(tags) : null,
      cleaningAvailable: cleaningAvailable === true,
      cleaningPrice: Number(cleaningPrice ?? 0),
      status: String(status ?? 'PUBLISHED'),
      publishedAt: new Date()
    }
  });

  await publishCatalogUpdate({
    event: 'catalog.product.created',
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
