import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/api-helpers';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const user = await prisma.user.findUnique({
    where: { id: auth.user.userId },
    include: { role: { include: { permissions: true } }, vendor: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      roleDisplayName: user.role.displayName,
      vendorId: user.vendorId,
      vendor: user.vendor ? { id: user.vendor.id, name: user.vendor.name } : null,
      avatarUrl: user.avatarUrl,
      permissions: user.role.permissions.map(p => ({
        resource: p.resource,
        action: p.action,
        scope: p.scope,
      })),
    },
  });
}
