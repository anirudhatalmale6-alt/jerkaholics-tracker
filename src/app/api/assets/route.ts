import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, paginate } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'assets', 'view');
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const { skip, take, page, limit } = paginate(searchParams);

  const where: any = {};
  if (searchParams.get('episode_id')) where.episodeId = searchParams.get('episode_id');
  if (searchParams.get('character_id')) where.characterId = searchParams.get('character_id');
  if (searchParams.get('category')) where.category = searchParams.get('category');
  if (searchParams.get('type')) where.type = searchParams.get('type');
  if (searchParams.get('status')) where.status = searchParams.get('status');

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: {
        episode: { select: { id: true, productionCode: true } },
        character: { select: { id: true, name: true } },
        uploadedBy: { select: { id: true, name: true } },
        approvedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.asset.count({ where }),
  ]);

  return NextResponse.json({ data: assets, meta: { total, page, pages: Math.ceil(total / limit) } });
}
