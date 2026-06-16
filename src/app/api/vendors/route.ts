import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'vendors', 'view');
  if (denied) return denied;

  const vendors = await prisma.vendor.findMany({
    include: {
      assignments: { include: { episode: { select: { id: true, productionCode: true, title: true, progress: true } } } },
      _count: { select: { deliveries: true, users: true } },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ data: vendors });
}

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'vendors', 'create');
  if (denied) return denied;

  const body = await req.json();
  const { name, country, contactName, contactEmail, specialization } = body;

  if (!name) return NextResponse.json({ error: 'Vendor name required' }, { status: 400 });

  const vendor = await prisma.vendor.create({
    data: { name, country, contactName, contactEmail, specialization },
  });

  await logAudit(auth.user.userId, 'create', 'vendor', vendor.id, undefined, body, req);
  return NextResponse.json({ data: vendor }, { status: 201 });
}
