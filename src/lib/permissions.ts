type Resource = 'seasons' | 'episodes' | 'tasks' | 'assets' | 'deliveries' |
  'risks' | 'characters' | 'vendors' | 'reports' | 'users' | 'notes' | 'settings';

type Action = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'deliver' |
  'upload' | 'assign' | 'export' | 'manage_users';

type Scope = 'all' | 'own' | 'assigned' | 'vendor_scoped';

interface Permission {
  resource: string;
  action: string;
  scope: string;
}

interface UserContext {
  userId: string;
  role: string;
  vendorId?: string | null;
  permissions: Permission[];
}

export function hasPermission(
  user: UserContext,
  resource: Resource,
  action: Action
): { allowed: boolean; scope: Scope } {
  if (user.role === 'admin') {
    return { allowed: true, scope: 'all' };
  }

  const perm = user.permissions.find(
    p => p.resource === resource && p.action === action
  );

  if (!perm) {
    return { allowed: false, scope: 'all' };
  }

  return { allowed: true, scope: perm.scope as Scope };
}

export function canAccessResource(
  user: UserContext,
  resource: Resource,
  action: Action,
  resourceOwnerId?: string,
  resourceVendorId?: string
): boolean {
  const { allowed, scope } = hasPermission(user, resource, action);
  if (!allowed) return false;

  switch (scope) {
    case 'all':
      return true;
    case 'own':
      return resourceOwnerId === user.userId;
    case 'assigned':
      return resourceOwnerId === user.userId;
    case 'vendor_scoped':
      return !!user.vendorId && user.vendorId === resourceVendorId;
    default:
      return false;
  }
}

export const ROLE_DEFINITIONS = {
  admin: {
    displayName: 'Administrator',
    description: 'Full system access',
  },
  executive_producer: {
    displayName: 'Executive Producer',
    description: 'Oversight, approvals, read-all access',
  },
  showrunner: {
    displayName: 'Showrunner',
    description: 'Creative lead, manages writers and story',
  },
  producer: {
    displayName: 'Producer',
    description: 'Day-to-day production management',
  },
  production_coord: {
    displayName: 'Production Coordinator',
    description: 'Schedules, assignments, logistics',
  },
  writer: {
    displayName: 'Writer',
    description: 'Script creation and revision',
  },
  storyboard_artist: {
    displayName: 'Storyboard Artist',
    description: 'Storyboard creation',
  },
  audio_engineer: {
    displayName: 'Audio Engineer',
    description: 'Voice recording and audio post',
  },
  vendor_lead: {
    displayName: 'Vendor Lead',
    description: 'External studio lead (scoped to their vendor)',
  },
  qc_reviewer: {
    displayName: 'QC Reviewer',
    description: 'Quality control review and approval',
  },
  network_reviewer: {
    displayName: 'Network Reviewer',
    description: 'Network notes and final approval',
  },
} as const;

export const ROLE_PERMISSIONS: Record<string, { resource: Resource; action: Action; scope: Scope }[]> = {
  admin: [], // admin bypasses permission checks
  executive_producer: [
    { resource: 'seasons', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'approve', scope: 'all' },
    { resource: 'tasks', action: 'view', scope: 'all' },
    { resource: 'assets', action: 'view', scope: 'all' },
    { resource: 'assets', action: 'approve', scope: 'all' },
    { resource: 'deliveries', action: 'view', scope: 'all' },
    { resource: 'deliveries', action: 'approve', scope: 'all' },
    { resource: 'risks', action: 'view', scope: 'all' },
    { resource: 'risks', action: 'edit', scope: 'all' },
    { resource: 'characters', action: 'view', scope: 'all' },
    { resource: 'vendors', action: 'view', scope: 'all' },
    { resource: 'reports', action: 'view', scope: 'all' },
    { resource: 'reports', action: 'export', scope: 'all' },
    { resource: 'users', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'create', scope: 'all' },
  ],
  showrunner: [
    { resource: 'seasons', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'create', scope: 'all' },
    { resource: 'episodes', action: 'edit', scope: 'all' },
    { resource: 'episodes', action: 'approve', scope: 'all' },
    { resource: 'tasks', action: 'view', scope: 'all' },
    { resource: 'tasks', action: 'create', scope: 'all' },
    { resource: 'tasks', action: 'edit', scope: 'all' },
    { resource: 'tasks', action: 'assign', scope: 'all' },
    { resource: 'assets', action: 'view', scope: 'all' },
    { resource: 'assets', action: 'upload', scope: 'all' },
    { resource: 'assets', action: 'approve', scope: 'all' },
    { resource: 'deliveries', action: 'view', scope: 'all' },
    { resource: 'deliveries', action: 'approve', scope: 'all' },
    { resource: 'risks', action: 'view', scope: 'all' },
    { resource: 'risks', action: 'create', scope: 'all' },
    { resource: 'risks', action: 'edit', scope: 'all' },
    { resource: 'characters', action: 'view', scope: 'all' },
    { resource: 'characters', action: 'create', scope: 'all' },
    { resource: 'characters', action: 'edit', scope: 'all' },
    { resource: 'vendors', action: 'view', scope: 'all' },
    { resource: 'vendors', action: 'assign', scope: 'all' },
    { resource: 'reports', action: 'view', scope: 'all' },
    { resource: 'reports', action: 'export', scope: 'all' },
    { resource: 'users', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'create', scope: 'all' },
  ],
  producer: [
    { resource: 'seasons', action: 'view', scope: 'all' },
    { resource: 'seasons', action: 'edit', scope: 'all' },
    { resource: 'episodes', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'create', scope: 'all' },
    { resource: 'episodes', action: 'edit', scope: 'all' },
    { resource: 'episodes', action: 'approve', scope: 'all' },
    { resource: 'tasks', action: 'view', scope: 'all' },
    { resource: 'tasks', action: 'create', scope: 'all' },
    { resource: 'tasks', action: 'edit', scope: 'all' },
    { resource: 'tasks', action: 'assign', scope: 'all' },
    { resource: 'tasks', action: 'delete', scope: 'all' },
    { resource: 'assets', action: 'view', scope: 'all' },
    { resource: 'assets', action: 'upload', scope: 'all' },
    { resource: 'assets', action: 'approve', scope: 'all' },
    { resource: 'deliveries', action: 'view', scope: 'all' },
    { resource: 'deliveries', action: 'approve', scope: 'all' },
    { resource: 'risks', action: 'view', scope: 'all' },
    { resource: 'risks', action: 'create', scope: 'all' },
    { resource: 'risks', action: 'edit', scope: 'all' },
    { resource: 'characters', action: 'view', scope: 'all' },
    { resource: 'characters', action: 'create', scope: 'all' },
    { resource: 'characters', action: 'edit', scope: 'all' },
    { resource: 'vendors', action: 'view', scope: 'all' },
    { resource: 'vendors', action: 'create', scope: 'all' },
    { resource: 'vendors', action: 'edit', scope: 'all' },
    { resource: 'vendors', action: 'assign', scope: 'all' },
    { resource: 'reports', action: 'view', scope: 'all' },
    { resource: 'reports', action: 'export', scope: 'all' },
    { resource: 'users', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'create', scope: 'all' },
  ],
  production_coord: [
    { resource: 'seasons', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'edit', scope: 'all' },
    { resource: 'tasks', action: 'view', scope: 'all' },
    { resource: 'tasks', action: 'create', scope: 'all' },
    { resource: 'tasks', action: 'edit', scope: 'all' },
    { resource: 'tasks', action: 'assign', scope: 'all' },
    { resource: 'assets', action: 'view', scope: 'all' },
    { resource: 'assets', action: 'upload', scope: 'all' },
    { resource: 'deliveries', action: 'view', scope: 'all' },
    { resource: 'risks', action: 'view', scope: 'all' },
    { resource: 'risks', action: 'create', scope: 'all' },
    { resource: 'risks', action: 'edit', scope: 'all' },
    { resource: 'characters', action: 'view', scope: 'all' },
    { resource: 'vendors', action: 'view', scope: 'all' },
    { resource: 'vendors', action: 'edit', scope: 'all' },
    { resource: 'vendors', action: 'assign', scope: 'all' },
    { resource: 'reports', action: 'view', scope: 'all' },
    { resource: 'users', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'create', scope: 'all' },
  ],
  writer: [
    { resource: 'seasons', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'view', scope: 'all' },
    { resource: 'tasks', action: 'view', scope: 'own' },
    { resource: 'tasks', action: 'edit', scope: 'own' },
    { resource: 'assets', action: 'view', scope: 'own' },
    { resource: 'assets', action: 'upload', scope: 'own' },
    { resource: 'characters', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'view', scope: 'own' },
    { resource: 'notes', action: 'create', scope: 'all' },
  ],
  storyboard_artist: [
    { resource: 'seasons', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'view', scope: 'all' },
    { resource: 'tasks', action: 'view', scope: 'own' },
    { resource: 'tasks', action: 'edit', scope: 'own' },
    { resource: 'assets', action: 'view', scope: 'own' },
    { resource: 'assets', action: 'upload', scope: 'own' },
    { resource: 'characters', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'view', scope: 'own' },
    { resource: 'notes', action: 'create', scope: 'all' },
  ],
  audio_engineer: [
    { resource: 'seasons', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'view', scope: 'all' },
    { resource: 'tasks', action: 'view', scope: 'own' },
    { resource: 'tasks', action: 'edit', scope: 'own' },
    { resource: 'assets', action: 'view', scope: 'own' },
    { resource: 'assets', action: 'upload', scope: 'own' },
    { resource: 'characters', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'view', scope: 'own' },
    { resource: 'notes', action: 'create', scope: 'all' },
  ],
  vendor_lead: [
    { resource: 'episodes', action: 'view', scope: 'vendor_scoped' },
    { resource: 'tasks', action: 'view', scope: 'vendor_scoped' },
    { resource: 'tasks', action: 'edit', scope: 'vendor_scoped' },
    { resource: 'assets', action: 'view', scope: 'vendor_scoped' },
    { resource: 'assets', action: 'upload', scope: 'vendor_scoped' },
    { resource: 'deliveries', action: 'view', scope: 'vendor_scoped' },
    { resource: 'deliveries', action: 'deliver', scope: 'vendor_scoped' },
    { resource: 'risks', action: 'view', scope: 'vendor_scoped' },
    { resource: 'characters', action: 'view', scope: 'vendor_scoped' },
    { resource: 'vendors', action: 'view', scope: 'vendor_scoped' },
    { resource: 'reports', action: 'view', scope: 'vendor_scoped' },
    { resource: 'users', action: 'view', scope: 'vendor_scoped' },
    { resource: 'notes', action: 'view', scope: 'vendor_scoped' },
    { resource: 'notes', action: 'create', scope: 'vendor_scoped' },
  ],
  qc_reviewer: [
    { resource: 'seasons', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'approve', scope: 'all' },
    { resource: 'tasks', action: 'view', scope: 'all' },
    { resource: 'assets', action: 'view', scope: 'all' },
    { resource: 'assets', action: 'approve', scope: 'all' },
    { resource: 'deliveries', action: 'view', scope: 'all' },
    { resource: 'deliveries', action: 'approve', scope: 'all' },
    { resource: 'risks', action: 'view', scope: 'all' },
    { resource: 'characters', action: 'view', scope: 'all' },
    { resource: 'vendors', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'create', scope: 'all' },
  ],
  network_reviewer: [
    { resource: 'seasons', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'view', scope: 'all' },
    { resource: 'episodes', action: 'approve', scope: 'all' },
    { resource: 'assets', action: 'view', scope: 'all' },
    { resource: 'assets', action: 'approve', scope: 'all' },
    { resource: 'deliveries', action: 'view', scope: 'all' },
    { resource: 'deliveries', action: 'approve', scope: 'all' },
    { resource: 'characters', action: 'view', scope: 'all' },
    { resource: 'reports', action: 'view', scope: 'all' },
    { resource: 'reports', action: 'export', scope: 'all' },
    { resource: 'notes', action: 'view', scope: 'all' },
    { resource: 'notes', action: 'create', scope: 'all' },
  ],
};
