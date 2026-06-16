import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'episodes', 'view');
  if (denied) return denied;

  const episode = await prisma.episode.findUnique({
    where: { id },
    include: {
      season: true,
      tasks: { include: { assignedTo: { select: { id: true, name: true } } }, orderBy: { sortOrder: 'asc' } },
      assets: { include: { uploadedBy: { select: { id: true, name: true } } } },
      deliveries: { include: { vendor: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
      risks: { orderBy: { severity: 'desc' } },
      notes: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
      vendorAssignments: { include: { vendor: true } },
      stageHistory: { include: { transitionedBy: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!episode) {
    return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
  }

  const stages = await prisma.episodeStage.findMany({ where: { episodeId: id } });

  return NextResponse.json({ data: { ...episode, stages } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'episodes', 'edit');
  if (denied) return denied;

  const existing = await prisma.episode.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Episode not found' }, { status: 404 });

  const body = await req.json();
  const allowed = ['title', 'synopsis', 'status', 'deliveryDeadline', 'airDate', 'progress', 'currentStage'];
  const data: any = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === 'deliveryDeadline' || key === 'airDate') {
        data[key] = new Date(body[key]);
      } else {
        data[key] = body[key];
      }
    }
  }

  const episode = await prisma.episode.update({ where: { id }, data, include: { season: true } });
  await logAudit(auth.user.userId, 'update', 'episode', id, existing, body, req);

  return NextResponse.json({ data: episode });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'episodes', 'delete');
  if (denied) return denied;

  await prisma.episode.delete({ where: { id } });
  await logAudit(auth.user.userId, 'delete', 'episode', id, undefined, undefined, req);

  return NextResponse.json({ success: true });
}
