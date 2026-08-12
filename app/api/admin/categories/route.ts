import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionToken, verifyToken } from '@/lib/auth';

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' }
  });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { name, slug, imageUrl, displayOrder, enabled } = body as Record<string, unknown>;

  if (!name) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }

  const normalizedSlug = slug
    ? String(slug).trim().toLowerCase().replace(/\s+/g, '-')
    : String(name).trim().toLowerCase().replace(/\s+/g, '-');

  const category = await prisma.category.create({
    data: {
      name: String(name).trim(),
      slug: normalizedSlug,
      imageUrl: String(imageUrl ?? ''),
      displayOrder: Number(displayOrder ?? 0),
      enabled: enabled === false ? false : true
    }
  });

  return NextResponse.json({ category });
}
