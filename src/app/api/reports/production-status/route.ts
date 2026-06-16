import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const seasonId = searchParams.get('season_id');

  const where: any = {};
  if (seasonId) where.seasonId = seasonId;

  const episodes = await prisma.episode.findMany({
    where,
    include: {
      season: { select: { number: true } },
      vendorAssignments: { include: { vendor: { select: { name: true } } } },
      tasks: { select: { status: true, dueDate: true } },
      risks: { where: { status: { not: 'resolved' } }, select: { severity: true, title: true } },
    },
    orderBy: [{ season: { number: 'asc' } }, { episodeNumber: 'asc' }],
  });

  const data = episodes.map(ep => {
    const now = Date.now();
    const deadline = new Date(ep.deliveryDeadline).getTime();
    const daysRemaining = Math.ceil((deadline - now) / 86400000);
    const blockedTasks = ep.tasks.filter(t => t.status === 'blocked').length;
    const overdueTasks = ep.tasks.filter(t => t.dueDate && new Date(t.dueDate).getTime() < now && !['done', 'blocked'].includes(t.status)).length;

    const riskPenalty = ep.risks.reduce((sum, r) => {
      const penalties: Record<string, number> = { critical: 20, high: 10, medium: 5, low: 2 };
      return sum + (penalties[r.severity] || 0);
    }, 0);

    const confidenceScore = Math.max(0, Math.min(100,
      ep.progress + (daysRemaining > 0 ? (ep.progress / (100 - ep.progress + 1)) * 10 : -20) - riskPenalty - (overdueTasks * 5)
    ));

    return {
      id: ep.id,
      productionCode: ep.productionCode,
      title: ep.title,
      season: ep.season.number,
      stage: ep.currentStage,
      progress: ep.progress,
      vendor: ep.vendorAssignments[0]?.vendor?.name || 'Unassigned',
      deadline: ep.deliveryDeadline,
      daysRemaining,
      confidenceScore: Math.round(confidenceScore),
      blockingItems: [
        ...ep.risks.filter(r => r.severity === 'critical').map(r => `RISK: ${r.title}`),
        ...(blockedTasks > 0 ? [`${blockedTasks} blocked task(s)`] : []),
        ...(overdueTasks > 0 ? [`${overdueTasks} overdue task(s)`] : []),
      ],
      totalTasks: ep.tasks.length,
      completedTasks: ep.tasks.filter(t => t.status === 'done').length,
      activeRisks: ep.risks.length,
    };
  });

  return NextResponse.json({ data });
}
