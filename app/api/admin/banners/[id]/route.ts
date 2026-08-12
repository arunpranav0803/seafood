import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionToken, verifyToken } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { title, slug, subtitle, ctaLabel, ctaDestination, imageUrl, displayOrder, enabled } = body as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  if (title) data.title = String(title).trim();
  if (slug) data.slug = String(slug).trim().toLowerCase().replace(/\s+/g, '-');
  if (subtitle !== undefined) data.subtitle = String(subtitle);
  if (ctaLabel) data.ctaLabel = String(ctaLabel).trim();
  if (ctaDestination !== undefined) data.ctaDestination = String(ctaDestination);
  if (imageUrl) data.imageUrl = String(imageUrl).trim();
  if (displayOrder !== undefined) data.displayOrder = Number(displayOrder);
  if (enabled !== undefined) data.enabled = Boolean(enabled);

  const banner = await prisma.banner.update({ where: { id: params.id }, data });
  return NextResponse.json({ banner });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await prisma.banner.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
