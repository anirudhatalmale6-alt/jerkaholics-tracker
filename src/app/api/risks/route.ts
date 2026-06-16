import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit, paginate } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'risks', 'view');
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const { skip, take, page, limit } = paginate(searchParams);

  const where: any = {};
  if (searchParams.get('episode_id')) where.episodeId = searchParams.get('episode_id');
  if (searchParams.get('severity')) where.severity = searchParams.get('severity');
  if (searchParams.get('status')) where.status = searchParams.get('status');
  if (searchParams.get('category')) where.category = searchParams.get('category');

  const [risks, total] = await Promise.all([
    prisma.risk.findMany({
      where,
      include: {
        episode: { select: { id: true, productionCode: true, title: true } },
        owner: { select: { id: true, name: true } },
      },
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
      skip,
      take,
    }),
    prisma.risk.count({ where }),
  ]);

  return NextResponse.json({ data: risks, meta: { total, page, pages: Math.ceil(total / limit) } });
}

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'risks', 'create');
  if (denied) return denied;

  const body = await req.json();
  const { episodeId, seasonId, title, description, severity, category, mitigationPlan, ownerId, dueDate } = body;

  if (!title || !description || !severity) {
    return NextResponse.json({ error: 'title, description, and severity required' }, { status: 400 });
  }

  const risk = await prisma.risk.create({
    data: {
      episodeId: episodeId || null,
      seasonId: seasonId || null,
      title,
      description,
      severity,
      category: category || 'schedule',
      mitigationPlan,
      ownerId: ownerId || auth.user.userId,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  await logAudit(auth.user.userId, 'create', 'risk', risk.id, undefined, body, req);
  return NextResponse.json({ data: risk }, { status: 201 });
}
