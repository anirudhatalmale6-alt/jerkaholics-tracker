export type EpisodeStatus = 'writing' | 'storyboard' | 'animatic' | 'voice' | 'animation' | 'cleanup' | 'post' | 'delivery' | 'approved';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type VendorStatus = 'active' | 'pending' | 'overdue' | 'completed';

export interface Episode {
  id: string;
  number: number;
  title: string;
  status: EpisodeStatus;
  progress: number;
  writer: string;
  director: string;
  vendor: string;
  airDate: string;
  scriptDeadline: string;
  boardDeadline: string;
  animationDeadline: string;
  deliveryDeadline: string;
  stages: {
    writing: number;
    storyboard: number;
    animatic: number;
    voice: number;
    animation: number;
    cleanup: number;
    post: number;
    delivery: number;
  };
}

export interface Task {
  id: string;
  title: string;
  episode: string;
  assignee: string;
  department: string;
  priority: TaskPriority;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  dueDate: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  country: string;
  assignedEpisodes: string[];
  status: VendorStatus;
  deliveryScore: number;
  qualityScore: number;
  activeTasks: number;
  completedTasks: number;
  nextDelivery: string;
}

export interface RiskItem {
  id: string;
  title: string;
  episode: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  mitigation: string;
  owner: string;
  status: 'open' | 'mitigating' | 'resolved';
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'deadline' | 'recording' | 'delivery' | 'review' | 'airdate';
  episode?: string;
  assignee?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  time: string;
  read: boolean;
}

export const EPISODES: Episode[] = [
  {
    id: 'JERK-101',
    number: 101,
    title: 'Pilot',
    status: 'animation',
    progress: 62,
    writer: 'Jake Morrison',
    director: 'Sarah Chen',
    vendor: 'Studio Yotta',
    airDate: '2027-03-15',
    scriptDeadline: '2026-05-01',
    boardDeadline: '2026-06-15',
    animationDeadline: '2026-09-01',
    deliveryDeadline: '2027-01-15',
    stages: { writing: 100, storyboard: 100, animatic: 100, voice: 85, animation: 40, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-102',
    number: 102,
    title: 'The Setup',
    status: 'storyboard',
    progress: 38,
    writer: 'Maya Rodriguez',
    director: 'Sarah Chen',
    vendor: 'Rough Draft Korea',
    airDate: '2027-03-22',
    scriptDeadline: '2026-05-15',
    boardDeadline: '2026-07-01',
    animationDeadline: '2026-09-15',
    deliveryDeadline: '2027-02-01',
    stages: { writing: 100, storyboard: 55, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-103',
    number: 103,
    title: 'Granny Knows Best',
    status: 'writing',
    progress: 22,
    writer: 'Jake Morrison',
    director: 'Tommy Nguyen',
    vendor: 'Hong Ying Animation',
    airDate: '2027-03-29',
    scriptDeadline: '2026-06-01',
    boardDeadline: '2026-07-15',
    animationDeadline: '2026-10-01',
    deliveryDeadline: '2027-02-15',
    stages: { writing: 75, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-104',
    number: 104,
    title: 'Double Down',
    status: 'writing',
    progress: 15,
    writer: 'Maya Rodriguez',
    director: 'Tommy Nguyen',
    vendor: 'Studio Yotta',
    airDate: '2027-04-05',
    scriptDeadline: '2026-06-15',
    boardDeadline: '2026-08-01',
    animationDeadline: '2026-10-15',
    deliveryDeadline: '2027-03-01',
    stages: { writing: 50, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-105',
    number: 105,
    title: 'Night Shift',
    status: 'writing',
    progress: 8,
    writer: 'Chris Park',
    director: 'Sarah Chen',
    vendor: 'Rough Draft Korea',
    airDate: '2027-04-12',
    scriptDeadline: '2026-07-01',
    boardDeadline: '2026-08-15',
    animationDeadline: '2026-11-01',
    deliveryDeadline: '2027-03-15',
    stages: { writing: 30, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-106',
    number: 106,
    title: 'The Reckoning',
    status: 'writing',
    progress: 5,
    writer: 'Jake Morrison',
    director: 'Tommy Nguyen',
    vendor: 'Hong Ying Animation',
    airDate: '2027-04-19',
    scriptDeadline: '2026-07-15',
    boardDeadline: '2026-09-01',
    animationDeadline: '2026-11-15',
    deliveryDeadline: '2027-03-30',
    stages: { writing: 15, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-107',
    number: 107,
    title: 'Full Circle',
    status: 'writing',
    progress: 3,
    writer: 'Maya Rodriguez',
    director: 'Sarah Chen',
    vendor: 'Studio Yotta',
    airDate: '2027-04-26',
    scriptDeadline: '2026-08-01',
    boardDeadline: '2026-09-15',
    animationDeadline: '2026-12-01',
    deliveryDeadline: '2027-04-01',
    stages: { writing: 10, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-108',
    number: 108,
    title: 'Season Finale',
    status: 'writing',
    progress: 2,
    writer: 'Jake Morrison',
    director: 'Tommy Nguyen',
    vendor: 'Rough Draft Korea',
    airDate: '2027-05-03',
    scriptDeadline: '2026-08-15',
    boardDeadline: '2026-10-01',
    animationDeadline: '2026-12-15',
    deliveryDeadline: '2027-04-15',
    stages: { writing: 5, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  }
];

export const TASKS: Task[] = [
  { id: 'T-001', title: 'Finalize character redesigns (main cast)', episode: 'JERK-101', assignee: 'Art Dept', department: 'Design', priority: 'high', status: 'in_progress', dueDate: '2026-06-20', createdAt: '2026-06-01' },
  { id: 'T-002', title: 'Record voice session - Episode 101', episode: 'JERK-101', assignee: 'Audio Team', department: 'Audio', priority: 'critical', status: 'in_progress', dueDate: '2026-06-18', createdAt: '2026-06-05' },
  { id: 'T-003', title: 'Storyboard revisions Act 2', episode: 'JERK-102', assignee: 'Board Team', department: 'Storyboard', priority: 'high', status: 'review', dueDate: '2026-06-22', createdAt: '2026-06-08' },
  { id: 'T-004', title: 'Background style guide update', episode: 'ALL', assignee: 'Art Dept', department: 'Design', priority: 'medium', status: 'todo', dueDate: '2026-06-25', createdAt: '2026-06-10' },
  { id: 'T-005', title: 'Script draft - Episode 103', episode: 'JERK-103', assignee: 'Jake Morrison', department: 'Writing', priority: 'high', status: 'in_progress', dueDate: '2026-06-30', createdAt: '2026-06-01' },
  { id: 'T-006', title: 'Animation asset handoff - Ep 101', episode: 'JERK-101', assignee: 'Production Coord', department: 'Production', priority: 'critical', status: 'in_progress', dueDate: '2026-06-17', createdAt: '2026-06-10' },
  { id: 'T-007', title: 'Color script approval', episode: 'JERK-101', assignee: 'Sarah Chen', department: 'Design', priority: 'medium', status: 'review', dueDate: '2026-06-28', createdAt: '2026-06-12' },
  { id: 'T-008', title: 'FX library - Adult Swim distortions', episode: 'ALL', assignee: 'FX Team', department: 'Animation', priority: 'medium', status: 'todo', dueDate: '2026-07-15', createdAt: '2026-06-14' },
  { id: 'T-009', title: 'Opening title sequence animatic', episode: 'ALL', assignee: 'Studio Yotta', department: 'Animation', priority: 'high', status: 'todo', dueDate: '2026-07-01', createdAt: '2026-06-10' },
  { id: 'T-010', title: 'Script outline - Episode 104', episode: 'JERK-104', assignee: 'Maya Rodriguez', department: 'Writing', priority: 'medium', status: 'in_progress', dueDate: '2026-07-05', createdAt: '2026-06-12' },
  { id: 'T-011', title: 'QC review - Ep 101 layout pass', episode: 'JERK-101', assignee: 'QC Team', department: 'QC', priority: 'high', status: 'todo', dueDate: '2026-07-10', createdAt: '2026-06-14' },
  { id: 'T-012', title: 'Vendor contract finalization', episode: 'ALL', assignee: 'Producer', department: 'Production', priority: 'critical', status: 'in_progress', dueDate: '2026-06-20', createdAt: '2026-06-01' },
];

export const VENDORS: Vendor[] = [
  {
    id: 'V-001',
    name: 'Studio Yotta',
    country: 'Japan',
    assignedEpisodes: ['JERK-101', 'JERK-104', 'JERK-107'],
    status: 'active',
    deliveryScore: 92,
    qualityScore: 95,
    activeTasks: 8,
    completedTasks: 3,
    nextDelivery: '2026-07-15'
  },
  {
    id: 'V-002',
    name: 'Rough Draft Korea',
    country: 'South Korea',
    assignedEpisodes: ['JERK-102', 'JERK-105', 'JERK-108'],
    status: 'pending',
    deliveryScore: 88,
    qualityScore: 90,
    activeTasks: 2,
    completedTasks: 0,
    nextDelivery: '2026-08-01'
  },
  {
    id: 'V-003',
    name: 'Hong Ying Animation',
    country: 'China',
    assignedEpisodes: ['JERK-103', 'JERK-106'],
    status: 'pending',
    deliveryScore: 85,
    qualityScore: 87,
    activeTasks: 1,
    completedTasks: 0,
    nextDelivery: '2026-08-15'
  }
];

export const RISKS: RiskItem[] = [
  {
    id: 'R-001',
    title: 'Voice recording delay - Lead actor scheduling',
    episode: 'JERK-101',
    severity: 'high',
    category: 'Schedule',
    description: 'Lead voice actor has conflicting schedule, may delay final voice recording session.',
    mitigation: 'Explore remote recording options; schedule backup session dates.',
    owner: 'Audio Team',
    status: 'mitigating',
    createdAt: '2026-06-10'
  },
  {
    id: 'R-002',
    title: 'Vendor contract negotiation stalling',
    episode: 'ALL',
    severity: 'critical',
    category: 'Vendor',
    description: 'Animation vendor contracts not yet finalized. Could delay handoff pipeline.',
    mitigation: 'Escalate to EP. Set hard deadline for contract signing.',
    owner: 'Producer',
    status: 'open',
    createdAt: '2026-06-08'
  },
  {
    id: 'R-003',
    title: 'Storyboard revision overload - Ep 102',
    episode: 'JERK-102',
    severity: 'medium',
    category: 'Bottleneck',
    description: 'Episode 102 boards have gone through 3 revision cycles. Team bandwidth at risk.',
    mitigation: 'Lock board direction after next pass. Add freelance support if needed.',
    owner: 'Board Team',
    status: 'mitigating',
    createdAt: '2026-06-12'
  },
  {
    id: 'R-004',
    title: 'Character redesign scope creep',
    episode: 'JERK-101',
    severity: 'medium',
    category: 'Scope',
    description: 'Main character set still in revision. Could cascade delays to animation.',
    mitigation: 'Set final approval date. Lock designs after showrunner sign-off.',
    owner: 'Art Dept',
    status: 'open',
    createdAt: '2026-06-14'
  }
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'CE-01', title: 'Voice Recording - Ep 101', date: '2026-06-18', type: 'recording', episode: 'JERK-101', assignee: 'Audio Team' },
  { id: 'CE-02', title: 'Storyboard Deadline - Ep 101', date: '2026-06-15', type: 'deadline', episode: 'JERK-101' },
  { id: 'CE-03', title: 'Asset Handoff - Ep 101 to Studio Yotta', date: '2026-06-17', type: 'delivery', episode: 'JERK-101' },
  { id: 'CE-04', title: 'Script Deadline - Ep 103', date: '2026-06-30', type: 'deadline', episode: 'JERK-103' },
  { id: 'CE-05', title: 'Board Deadline - Ep 102', date: '2026-07-01', type: 'deadline', episode: 'JERK-102' },
  { id: 'CE-06', title: 'Animation Delivery - Ep 101 Layout', date: '2026-07-15', type: 'delivery', episode: 'JERK-101' },
  { id: 'CE-07', title: 'QC Review - Ep 101', date: '2026-07-10', type: 'review', episode: 'JERK-101' },
  { id: 'CE-08', title: 'Writers Room - Ep 105-106 Outline', date: '2026-06-20', type: 'review' },
  { id: 'CE-09', title: 'Vendor Check-in Call', date: '2026-06-19', type: 'review' },
  { id: 'CE-10', title: 'Network Pitch - Season 1 Overview', date: '2026-07-20', type: 'delivery' },
  { id: 'CE-11', title: 'Script Deadline - Ep 104', date: '2026-07-05', type: 'deadline', episode: 'JERK-104' },
  { id: 'CE-12', title: 'Air Date - Ep 101 (Pilot)', date: '2027-03-15', type: 'airdate', episode: 'JERK-101' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'N-01', message: 'Episode JERK-101 voice recording due in 3 days', type: 'warning', time: '2h ago', read: false },
  { id: 'N-02', message: 'Storyboard for JERK-102 submitted for review', type: 'info', time: '4h ago', read: false },
  { id: 'N-03', message: 'Vendor contract deadline approaching - action required', type: 'error', time: '6h ago', read: false },
  { id: 'N-04', message: 'Character redesigns approved by showrunner', type: 'success', time: '1d ago', read: true },
  { id: 'N-05', message: 'Animation package for JERK-101 uploaded by Studio Yotta', type: 'success', time: '1d ago', read: true },
  { id: 'N-06', message: 'New task assigned: QC review Ep 101 layout pass', type: 'info', time: '2d ago', read: true },
];

export const STAGE_LABELS: Record<string, string> = {
  writing: 'Writing',
  storyboard: 'Storyboard',
  animatic: 'Animatic',
  voice: 'Voice',
  animation: 'Animation',
  cleanup: 'Cleanup',
  post: 'Post',
  delivery: 'Delivery',
};

export const STATUS_COLORS: Record<EpisodeStatus, string> = {
  writing: '#f59e0b',
  storyboard: '#3b82f6',
  animatic: '#8b5cf6',
  voice: '#ec4899',
  animation: '#22c55e',
  cleanup: '#06b6d4',
  post: '#f97316',
  delivery: '#10b981',
  approved: '#22c55e',
};

export function getSeasonProgress(): number {
  const total = EPISODES.reduce((sum, ep) => sum + ep.progress, 0);
  return Math.round(total / EPISODES.length);
}

export function getUpcomingDeadlines(days: number = 7): CalendarEvent[] {
  const now = new Date('2026-06-15');
  const future = new Date(now);
  future.setDate(future.getDate() + days);
  return CALENDAR_EVENTS.filter(e => {
    const d = new Date(e.date);
    return d >= now && d <= future;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getOverdueTasks(): Task[] {
  const now = new Date('2026-06-15');
  return TASKS.filter(t => t.status !== 'done' && new Date(t.dueDate) < now);
}

export function getTasksByStatus() {
  return {
    todo: TASKS.filter(t => t.status === 'todo').length,
    in_progress: TASKS.filter(t => t.status === 'in_progress').length,
    review: TASKS.filter(t => t.status === 'review').length,
    done: TASKS.filter(t => t.status === 'done').length,
  };
}
