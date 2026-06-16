import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, paginate } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const { skip, take, page, limit } = paginate(searchParams);

  const where: any = { userId: auth.user.userId };
  if (searchParams.get('is_read') === 'false') where.isRead = false;

  const [notifications, total, unread] = await Promise.all([
    prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId: auth.user.userId, isRead: false } }),
  ]);

  return NextResponse.json({
    data: notifications,
    meta: { total, page, pages: Math.ceil(total / limit), unreadCount: unread },
  });
}

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const { action } = await req.json();

  if (action === 'mark_all_read') {
    const { count } = await prisma.notification.updateMany({
      where: { userId: auth.user.userId, isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true, count });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
