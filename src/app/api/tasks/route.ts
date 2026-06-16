import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit, paginate } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'tasks', 'view');
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const { skip, take, page, limit } = paginate(searchParams);

  const where: any = {};
  if (searchParams.get('episode_id')) where.episodeId = searchParams.get('episode_id');
  if (searchParams.get('assigned_to')) where.assignedToId = searchParams.get('assigned_to');
  if (searchParams.get('status')) where.status = searchParams.get('status');
  if (searchParams.get('stage')) where.stage = searchParams.get('stage');
  if (searchParams.get('priority')) where.priority = searchParams.get('priority');
  if (searchParams.get('department')) where.department = searchParams.get('department');
  if (searchParams.get('overdue') === 'true') {
    where.dueDate = { lt: new Date() };
    where.status = { notIn: ['done', 'blocked'] };
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        episode: { select: { id: true, productionCode: true, title: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
      skip,
      take,
    }),
    prisma.task.count({ where }),
  ]);

  return NextResponse.json({ data: tasks, meta: { total, page, pages: Math.ceil(total / limit) } });
}

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'tasks', 'create');
  if (denied) return denied;

  const body = await req.json();
  const { episodeId, title, department, stage, priority, assignedTo, dueDate, description, estimatedHours } = body;

  if (!episodeId || !title || !department || !stage) {
    return NextResponse.json({ error: 'Missing required fields: episodeId, title, department, stage' }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      episodeId,
      title,
      description,
      department,
      stage,
      priority: priority || 'medium',
      assignedToId: assignedTo || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      estimatedHours,
      createdById: auth.user.userId,
    },
    include: { episode: { select: { productionCode: true } }, assignedTo: { select: { name: true } } },
  });

  await logAudit(auth.user.userId, 'create', 'task', task.id, undefined, body, req);
  return NextResponse.json({ data: task }, { status: 201 });
}
