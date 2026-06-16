import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const where: any = {};
  if (searchParams.get('vendor_id')) where.vendorId = searchParams.get('vendor_id');
  if (searchParams.get('episode_id')) where.episodeId = searchParams.get('episode_id');

  const assignments = await prisma.vendorAssignment.findMany({
    where,
    include: {
      vendor: { select: { id: true, name: true } },
      episode: { select: { id: true, productionCode: true, title: true, progress: true, currentStage: true } },
      assignedBy: { select: { id: true, name: true } },
    },
    orderBy: { assignedAt: 'desc' },
  });

  return NextResponse.json({ data: assignments });
}

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'vendors', 'assign');
  if (denied) return denied;

  const body = await req.json();
  const { vendorId, episodeId, dueDate, notes } = body;

  if (!vendorId || !episodeId) {
    return NextResponse.json({ error: 'vendorId and episodeId required' }, { status: 400 });
  }

  const existing = await prisma.vendorAssignment.findFirst({
    where: { episodeId, status: { not: 'cancelled' } },
  });

  if (existing) {
    return NextResponse.json({ error: 'Episode already assigned to a vendor' }, { status: 409 });
  }

  const assignment = await prisma.vendorAssignment.create({
    data: {
      vendorId,
      episodeId,
      assignedById: auth.user.userId,
      dueDate: dueDate ? new Date(dueDate) : null,
      notes,
    },
    include: { vendor: { select: { name: true } }, episode: { select: { productionCode: true } } },
  });

  await logAudit(auth.user.userId, 'create', 'vendor_assignment', assignment.id, undefined, body, req);
  return NextResponse.json({ data: assignment }, { status: 201 });
}
