import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit } from '@/lib/api-helpers';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'deliveries', 'approve');
  if (denied) return denied;

  const delivery = await prisma.delivery.findUnique({ where: { id }, include: { vendor: true } });
  if (!delivery) return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });

  const { status, qcNotes, notes } = await req.json();
  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Status must be "approved" or "rejected"' }, { status: 400 });
  }

  const updated = await prisma.delivery.update({
    where: { id },
    data: {
      status,
      qcPassed: status === 'approved',
      qcNotes,
      notes,
      reviewedById: auth.user.userId,
      reviewedAt: new Date(),
    },
  });

  if (status === 'rejected') {
    const revisionDelivery = await prisma.delivery.create({
      data: {
        episodeId: delivery.episodeId,
        vendorId: delivery.vendorId,
        deliveryType: 'revision',
        status: 'pending',
        revisionNumber: delivery.revisionNumber + 1,
        parentDeliveryId: delivery.id,
      },
    });

    if (delivery.revisionNumber + 1 >= 3) {
      await prisma.risk.create({
        data: {
          episodeId: delivery.episodeId,
          title: `Excessive revisions - ${delivery.deliveryType} (revision #${delivery.revisionNumber + 1})`,
          description: `Delivery has been rejected ${delivery.revisionNumber + 1} times. This indicates quality or communication issues with the vendor.`,
          severity: 'high',
          category: 'quality',
          status: 'identified',
          ownerId: auth.user.userId,
        },
      });
    }

    await logAudit(auth.user.userId, 'reject_delivery', 'delivery', id, { status: delivery.status }, { status, revisionId: revisionDelivery.id }, req);
  } else {
    await logAudit(auth.user.userId, 'approve_delivery', 'delivery', id, { status: delivery.status }, { status }, req);
  }

  return NextResponse.json({ data: updated });
}
