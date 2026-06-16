import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'characters', 'view');
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  const where: any = {};
  if (type) where.type = type;

  const characters = await prisma.character.findMany({
    where,
    include: {
      roles: true,
      traits: true,
      assets: { include: { uploadedBy: { select: { name: true } } } },
      _count: { select: { appearances: true } },
    },
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  });

  return NextResponse.json({ data: characters });
}

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'characters', 'create');
  if (denied) return denied;

  const body = await req.json();
  const { name, voiceActor, description, type, firstAppearanceId, roles, traits } = body;

  if (!name) return NextResponse.json({ error: 'Character name required' }, { status: 400 });

  const character = await prisma.character.create({
    data: {
      name,
      voiceActor,
      description,
      type: type || 'recurring',
      firstAppearanceId,
      roles: roles ? { create: roles.map((r: string) => ({ roleName: r })) } : undefined,
      traits: traits ? { create: traits.map((t: string) => ({ trait: t })) } : undefined,
    },
    include: { roles: true, traits: true },
  });

  await logAudit(auth.user.userId, 'create', 'character', character.id, undefined, body, req);
  return NextResponse.json({ data: character }, { status: 201 });
}
