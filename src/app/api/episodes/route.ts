import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit, paginate } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'episodes', 'view');
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const { skip, take, page, limit } = paginate(searchParams);
  const seasonId = searchParams.get('season_id');
  const status = searchParams.get('status');
  const currentStage = searchParams.get('current_stage');

  const where: any = {};
  if (seasonId) where.seasonId = seasonId;
  if (status) where.status = status;
  if (currentStage) where.currentStage = currentStage;

  const [episodes, total] = await Promise.all([
    prisma.episode.findMany({
      where,
      include: {
        season: { select: { number: true, title: true } },
        vendorAssignments: { include: { vendor: { select: { id: true, name: true } } } },
        _count: { select: { tasks: true, assets: true, risks: true } },
      },
      orderBy: [{ season: { number: 'asc' } }, { episodeNumber: 'asc' }],
      skip,
      take,
    }),
    prisma.episode.count({ where }),
  ]);

  const episodeIds = episodes.map(e => e.id);
  const allStages = await prisma.episodeStage.findMany({
    where: { episodeId: { in: episodeIds } },
  });

  const stagesByEpisode = allStages.reduce((acc, s) => {
    if (!acc[s.episodeId]) acc[s.episodeId] = [];
    acc[s.episodeId].push({ stage: s.stage, progress: s.progress });
    return acc;
  }, {} as Record<string, Array<{ stage: string; progress: number }>>);

  const data = episodes.map(ep => ({
    ...ep,
    stages: stagesByEpisode[ep.id] || [],
  }));

  return NextResponse.json({
    data,
    meta: { total, page, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'episodes', 'create');
  if (denied) return denied;

  const body = await req.json();
  const { seasonId, productionCode, episodeNumber, title, synopsis, deliveryDeadline, airDate } = body;

  if (!seasonId || !productionCode || !episodeNumber || !title || !deliveryDeadline) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const episode = await prisma.episode.create({
    data: {
      seasonId,
      productionCode,
      episodeNumber,
      title,
      synopsis,
      deliveryDeadline: new Date(deliveryDeadline),
      airDate: airDate ? new Date(airDate) : null,
      createdById: auth.user.userId,
    },
    include: { season: true },
  });

  await logAudit(auth.user.userId, 'create', 'episode', episode.id, undefined, body, req);

  return NextResponse.json({ data: episode }, { status: 201 });
}
