import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      episode: { select: { id: true, productionCode: true, title: true } },
      assignedTo: { select: { id: true, name: true } },
      notes: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  return NextResponse.json({ data: task });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'tasks', 'edit');
  if (denied) return denied;

  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  const body = await req.json();
  const data: any = {};

  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.status !== undefined) {
    data.status = body.status;
    if (body.status === 'in_progress' && !existing.startedAt) data.startedAt = new Date();
    if (body.status === 'done') data.completedAt = new Date();
  }
  if (body.priority !== undefined) data.priority = body.priority;
  if (body.assignedTo !== undefined) data.assignedToId = body.assignedTo;
  if (body.dueDate !== undefined) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  if (body.actualHours !== undefined) data.actualHours = body.actualHours;

  const task = await prisma.task.update({ where: { id }, data });
  await logAudit(auth.user.userId, 'update', 'task', id, existing, body, req);

  return NextResponse.json({ data: task });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'tasks', 'delete');
  if (denied) return denied;

  await prisma.task.delete({ where: { id } });
  await logAudit(auth.user.userId, 'delete', 'task', id, undefined, undefined, req);

  return NextResponse.json({ success: true });
}
