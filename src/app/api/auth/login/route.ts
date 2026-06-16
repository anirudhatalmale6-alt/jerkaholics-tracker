import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createAccessToken, createRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role.name,
    vendorId: user.vendorId || undefined,
  };

  const accessToken = await createAccessToken(tokenPayload);
  const refreshToken = await createRefreshToken(user.id);

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

  return NextResponse.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      roleDisplayName: user.role.displayName,
      vendorId: user.vendorId,
      avatarUrl: user.avatarUrl,
    },
  });
}
