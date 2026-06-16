import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const vendors = await prisma.vendor.findMany({
    include: {
      assignments: {
        include: { episode: { select: { progress: true, status: true } } },
      },
      deliveries: {
        select: { status: true, revisionNumber: true, submittedAt: true, reviewedAt: true },
      },
    },
  });

  const data = vendors.map(v => {
    const totalDeliveries = v.deliveries.length;
    const approved = v.deliveries.filter(d => d.status === 'approved').length;
    const rejected = v.deliveries.filter(d => d.status === 'rejected').length;
    const avgProgress = v.assignments.length > 0
      ? Math.round(v.assignments.reduce((s, a) => s + a.episode.progress, 0) / v.assignments.length)
      : 0;

    return {
      id: v.id,
      name: v.name,
      country: v.country,
      qualityScore: v.qualityScore,
      deliveryScore: v.deliveryScore,
      overall: Math.round((v.qualityScore + v.deliveryScore) / 2),
      episodesAssigned: v.assignments.length,
      avgEpisodeProgress: avgProgress,
      totalDeliveries,
      approvedDeliveries: approved,
      rejectedDeliveries: rejected,
      approvalRate: totalDeliveries > 0 ? Math.round((approved / totalDeliveries) * 100) : 0,
      revisionRate: totalDeliveries > 0 ? Math.round((rejected / totalDeliveries) * 100) : 0,
      status: v.status,
    };
  });

  return NextResponse.json({ data });
}
