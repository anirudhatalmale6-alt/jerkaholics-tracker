import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyRefreshToken, createAccessToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();
  if (!refreshToken) {
    return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 });
  }

  const accessToken = await createAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role.name,
    vendorId: user.vendorId || undefined,
  });

  return NextResponse.json({ accessToken });
}
