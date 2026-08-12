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
  const { name, slug, imageUrl, displayOrder, enabled } = body as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  if (name) data.name = String(name).trim();
  if (slug) data.slug = String(slug).trim().toLowerCase().replace(/\s+/g, '-');
  if (imageUrl) data.imageUrl = String(imageUrl);
  if (displayOrder !== undefined) data.displayOrder = Number(displayOrder);
  if (enabled !== undefined) data.enabled = Boolean(enabled);

  const category = await prisma.category.update({
    where: { id: params.id },
    data
  });

  return NextResponse.json({ category });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const token = getSessionToken();
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
