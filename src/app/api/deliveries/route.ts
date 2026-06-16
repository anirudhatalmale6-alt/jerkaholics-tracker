import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit, paginate } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'deliveries', 'view');
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const { skip, take, page, limit } = paginate(searchParams);

  const where: any = {};
  if (searchParams.get('episode_id')) where.episodeId = searchParams.get('episode_id');
  if (searchParams.get('vendor_id')) where.vendorId = searchParams.get('vendor_id');
  if (searchParams.get('status')) where.status = searchParams.get('status');

  const [deliveries, total] = await Promise.all([
    prisma.delivery.findMany({
      where,
      include: {
        episode: { select: { id: true, productionCode: true, title: true } },
        vendor: { select: { id: true, name: true } },
        submittedBy: { select: { id: true, name: true } },
        reviewedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.delivery.count({ where }),
  ]);

  return NextResponse.json({ data: deliveries, meta: { total, page, pages: Math.ceil(total / limit) } });
}

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'deliveries', 'deliver');
  if (denied) return denied;

  const body = await req.json();
  const { episodeId, deliveryType, notes, filePath } = body;

  if (!episodeId || !deliveryType) {
    return NextResponse.json({ error: 'episodeId and deliveryType required' }, { status: 400 });
  }

  const assignment = await prisma.vendorAssignment.findFirst({
    where: { episodeId, vendor: { users: { some: { id: auth.user.userId } } } },
  });

  const vendorId = assignment?.vendorId || body.vendorId;
  if (!vendorId) {
    return NextResponse.json({ error: 'Could not determine vendor' }, { status: 400 });
  }

  const delivery = await prisma.delivery.create({
    data: {
      episodeId,
      vendorId,
      deliveryType,
      status: 'submitted',
      submittedAt: new Date(),
      submittedById: auth.user.userId,
      filePath,
      notes,
    },
    include: { episode: { select: { productionCode: true } }, vendor: { select: { name: true } } },
  });

  await logAudit(auth.user.userId, 'create', 'delivery', delivery.id, undefined, body, req);
  return NextResponse.json({ data: delivery }, { status: 201 });
}
