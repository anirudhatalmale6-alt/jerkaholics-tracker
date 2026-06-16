import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const vendor = await prisma.vendor.findUnique({
    where: { id },
    include: {
      assignments: { include: { episode: { select: { id: true, productionCode: true, title: true, progress: true, currentStage: true } } } },
      deliveries: { include: { episode: { select: { productionCode: true, title: true } } }, orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });

  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

  const totalDeliveries = await prisma.delivery.count({ where: { vendorId: id } });
  const approvedDeliveries = await prisma.delivery.count({ where: { vendorId: id, status: 'approved' } });
  const rejectedDeliveries = await prisma.delivery.count({ where: { vendorId: id, status: 'rejected' } });

  return NextResponse.json({
    data: vendor,
    performance: {
      totalDeliveries,
      approvedDeliveries,
      rejectedDeliveries,
      approvalRate: totalDeliveries > 0 ? Math.round((approvedDeliveries / totalDeliveries) * 100) : 0,
      revisionRate: totalDeliveries > 0 ? Math.round((rejectedDeliveries / totalDeliveries) * 100) : 0,
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'vendors', 'edit');
  if (denied) return denied;

  const body = await req.json();
  const allowed = ['contactName', 'contactEmail', 'contactPhone', 'status', 'notes', 'specialization'];
  const data: any = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const vendor = await prisma.vendor.update({ where: { id }, data });
  await logAudit(auth.user.userId, 'update', 'vendor', id, undefined, body, req);

  return NextResponse.json({ data: vendor });
}
