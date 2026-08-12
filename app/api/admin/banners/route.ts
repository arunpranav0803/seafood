import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionToken, verifyToken } from '@/lib/auth';

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json({ banners });
}

export async function POST(request: Request) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { title, slug, subtitle, ctaLabel, ctaDestination, imageUrl, displayOrder, enabled } = body as Record<string, unknown>;

  if (!title || !ctaLabel || !imageUrl) {
    return NextResponse.json({ error: 'Title, CTA label, and image URL are required' }, { status: 400 });
  }

  const normalizedSlug = slug
    ? String(slug).trim().toLowerCase().replace(/\s+/g, '-')
    : String(title).trim().toLowerCase().replace(/\s+/g, '-');

  const banner = await prisma.banner.create({
    data: {
      title: String(title).trim(),
      slug: normalizedSlug,
      subtitle: String(subtitle ?? ''),
      ctaLabel: String(ctaLabel).trim(),
      ctaDestination: String(ctaDestination ?? ''),
      imageUrl: String(imageUrl).trim(),
      displayOrder: Number(displayOrder ?? 0),
      enabled: enabled === false ? false : true,
      startDate: new Date()
    }
  });

  return NextResponse.json({ banner });
}
