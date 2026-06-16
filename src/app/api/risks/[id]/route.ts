import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const risk = await prisma.risk.findUnique({
    where: { id },
    include: {
      episode: { select: { id: true, productionCode: true, title: true } },
      owner: { select: { id: true, name: true } },
    },
  });

  if (!risk) return NextResponse.json({ error: 'Risk not found' }, { status: 404 });
  return NextResponse.json({ data: risk });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'risks', 'edit');
  if (denied) return denied;

  const existing = await prisma.risk.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Risk not found' }, { status: 404 });

  const body = await req.json();
  const data: any = {};
  if (body.severity !== undefined) data.severity = body.severity;
  if (body.status !== undefined) {
    data.status = body.status;
    if (body.status === 'resolved') data.resolvedAt = new Date();
  }
  if (body.mitigationPlan !== undefined) data.mitigationPlan = body.mitigationPlan;
  if (body.dueDate !== undefined) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  if (body.description !== undefined) data.description = body.description;

  const risk = await prisma.risk.update({ where: { id }, data });
  await logAudit(auth.user.userId, 'update', 'risk', id, existing, body, req);

  return NextResponse.json({ data: risk });
}
