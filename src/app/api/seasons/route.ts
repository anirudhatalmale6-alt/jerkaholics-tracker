import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'seasons', 'view');
  if (denied) return denied;

  const seasons = await prisma.season.findMany({
    include: {
      episodes: {
        select: { id: true, productionCode: true, title: true, progress: true, currentStage: true, status: true },
        orderBy: { episodeNumber: 'asc' },
      },
      _count: { select: { episodes: true, risks: true } },
    },
    orderBy: { number: 'asc' },
  });

  const data = seasons.map(s => ({
    ...s,
    progress: s.episodes.length > 0
      ? Math.round(s.episodes.reduce((sum, ep) => sum + ep.progress, 0) / s.episodes.length)
      : 0,
  }));

  return NextResponse.json({ data });
}
