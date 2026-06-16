import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const [
    seasons,
    totalEpisodes,
    totalTasks,
    overdueTasks,
    activeRisks,
    criticalRisks,
    recentActivity,
  ] = await Promise.all([
    prisma.season.findMany({
      include: {
        episodes: { select: { progress: true, status: true, currentStage: true } },
      },
      orderBy: { number: 'asc' },
    }),
    prisma.episode.count(),
    prisma.task.count(),
    prisma.task.count({
      where: { dueDate: { lt: new Date() }, status: { notIn: ['done', 'blocked'] } },
    }),
    prisma.risk.count({ where: { status: { not: 'resolved' } } }),
    prisma.risk.count({ where: { severity: 'critical', status: { not: 'resolved' } } }),
    prisma.auditLog.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const upcomingDeadlines = await prisma.episode.findMany({
    where: {
      deliveryDeadline: { gte: new Date(), lte: new Date(Date.now() + 30 * 86400000) },
      status: { not: 'delivered' },
    },
    select: { productionCode: true, title: true, deliveryDeadline: true, progress: true },
    orderBy: { deliveryDeadline: 'asc' },
    take: 10,
  });

  const tasksByStatus = await prisma.task.groupBy({
    by: ['status'],
    _count: { _all: true },
  });

  const seasonProgress = seasons.map(s => ({
    number: s.number,
    title: s.title,
    episodeCount: s.episodes.length,
    progress: s.episodes.length > 0
      ? Math.round(s.episodes.reduce((sum, ep) => sum + ep.progress, 0) / s.episodes.length)
      : 0,
    stageBreakdown: s.episodes.reduce((acc, ep) => {
      acc[ep.currentStage] = (acc[ep.currentStage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  }));

  return NextResponse.json({
    data: {
      seasonProgress,
      totalEpisodes,
      totalTasks,
      overdueTasks,
      activeRisks,
      criticalRisks,
      tasksByStatus: tasksByStatus.reduce((acc, t) => { acc[t.status] = t._count._all; return acc; }, {} as Record<string, number>),
      upcomingDeadlines,
      recentActivity,
    },
  });
}
