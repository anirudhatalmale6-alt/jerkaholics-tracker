import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, TokenPayload, getUserWithPermissions } from './auth';
import { hasPermission } from './permissions';
import { prisma } from './db';

export interface AuthenticatedRequest {
  user: TokenPayload;
  permissions: { resource: string; action: string; scope: string }[];
}

export async function authenticate(req: NextRequest): Promise<AuthenticatedRequest | NextResponse> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const user = await getUserWithPermissions(payload.userId);
  if (!user || !user.isActive) {
    return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 });
  }

  return {
    user: payload,
    permissions: user.role.permissions.map(p => ({
      resource: p.resource,
      action: p.action,
      scope: p.scope,
    })),
  };
}

export function requirePermission(
  auth: AuthenticatedRequest,
  resource: string,
  action: string
): NextResponse | null {
  const { allowed } = hasPermission(
    {
      userId: auth.user.userId,
      role: auth.user.role,
      vendorId: auth.user.vendorId,
      permissions: auth.permissions,
    },
    resource as any,
    action as any
  );

  if (!allowed) {
    return NextResponse.json(
      { error: `Forbidden: requires ${action} permission on ${resource}` },
      { status: 403 }
    );
  }
  return null;
}

export async function logAudit(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  oldValues?: object,
  newValues?: object,
  req?: NextRequest
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      resourceType,
      resourceId,
      oldValues: oldValues ? JSON.stringify(oldValues) : null,
      newValues: newValues ? JSON.stringify(newValues) : null,
      ipAddress: req?.headers.get('x-forwarded-for') || req?.headers.get('x-real-ip'),
      userAgent: req?.headers.get('user-agent'),
    },
  });
}

export function paginate(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25')));
  return { skip: (page - 1) * limit, take: limit, page, limit };
}
