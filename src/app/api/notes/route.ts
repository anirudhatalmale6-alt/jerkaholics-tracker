import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, paginate } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'notes', 'view');
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const { skip, take, page, limit } = paginate(searchParams);

  const where: any = {};
  if (searchParams.get('episode_id')) where.episodeId = searchParams.get('episode_id');
  if (searchParams.get('task_id')) where.taskId = searchParams.get('task_id');
  if (searchParams.get('type')) where.type = searchParams.get('type');

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where,
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.note.count({ where }),
  ]);

  return NextResponse.json({ data: notes, meta: { total, page, pages: Math.ceil(total / limit) } });
}

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'notes', 'create');
  if (denied) return denied;

  const body = await req.json();
  const { episodeId, taskId, deliveryId, assetId, content, type, isInternal } = body;

  if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 });
  if (!episodeId && !taskId && !deliveryId && !assetId) {
    return NextResponse.json({ error: 'Must specify episodeId, taskId, deliveryId, or assetId' }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: {
      episodeId, taskId, deliveryId, assetId,
      authorId: auth.user.userId,
      content,
      type: type || 'general',
      isInternal: isInternal || false,
    },
    include: { author: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ data: note }, { status: 201 });
}
