import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      roles: true,
      traits: true,
      assets: { include: { uploadedBy: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
      appearances: { include: { episode: { select: { id: true, productionCode: true, title: true } } } },
    },
  });

  if (!character) return NextResponse.json({ error: 'Character not found' }, { status: 404 });

  const missingAssetTypes = ['reference', 'model_sheet', 'expression_sheet', 'turnaround', 'color_key']
    .filter(t => !character.assets.some(a => a.type === t && a.status === 'approved'));

  return NextResponse.json({ data: character, missingAssetTypes });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'characters', 'edit');
  if (denied) return denied;

  const body = await req.json();
  const data: any = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.voiceActor !== undefined) data.voiceActor = body.voiceActor;
  if (body.description !== undefined) data.description = body.description;
  if (body.type !== undefined) data.type = body.type;

  if (body.roles) {
    await prisma.characterRole.deleteMany({ where: { characterId: id } });
    await prisma.characterRole.createMany({
      data: body.roles.map((r: string) => ({ characterId: id, roleName: r })),
    });
  }

  if (body.traits) {
    await prisma.characterTrait.deleteMany({ where: { characterId: id } });
    await prisma.characterTrait.createMany({
      data: body.traits.map((t: string) => ({ characterId: id, trait: t })),
    });
  }

  const character = await prisma.character.update({
    where: { id },
    data,
    include: { roles: true, traits: true },
  });

  await logAudit(auth.user.userId, 'update', 'character', id, undefined, body, req);
  return NextResponse.json({ data: character });
}
