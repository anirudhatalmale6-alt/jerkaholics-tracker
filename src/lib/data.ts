export type EpisodeStatus = 'writing' | 'storyboard' | 'animatic' | 'voice' | 'animation' | 'cleanup' | 'post' | 'delivery' | 'approved';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type VendorStatus = 'active' | 'pending' | 'overdue' | 'completed';

export interface Episode {
  id: string;
  number: number;
  season: number;
  title: string;
  synopsis: string;
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

// Season 1 - 8 episodes
// Season 2 - 8 episodes
// Season 3 - 7 episodes
export const EPISODES: Episode[] = [
  // ===== SEASON 1 =====
  {
    id: 'JERK-101', number: 101, season: 1,
    title: 'Departed',
    synopsis: 'The boys use Mr. Wither\'s teleportation device.',
    status: 'animation', progress: 62,
    writer: 'Jake Morrison', director: 'Sarah Chen', vendor: 'Studio Yotta',
    airDate: '2027-03-15', scriptDeadline: '2026-05-01', boardDeadline: '2026-06-15',
    animationDeadline: '2026-09-01', deliveryDeadline: '2027-01-15',
    stages: { writing: 100, storyboard: 100, animatic: 100, voice: 85, animation: 40, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-102', number: 102, season: 1,
    title: 'Store Clerks',
    synopsis: 'Tommy\'s behavior causes problems at the grocery store and the town.',
    status: 'storyboard', progress: 38,
    writer: 'Maya Rodriguez', director: 'Sarah Chen', vendor: 'Rough Draft Korea',
    airDate: '2027-03-22', scriptDeadline: '2026-05-15', boardDeadline: '2026-07-01',
    animationDeadline: '2026-09-15', deliveryDeadline: '2027-02-01',
    stages: { writing: 100, storyboard: 55, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-103', number: 103, season: 1,
    title: 'The Pete Life of Pete',
    synopsis: 'Pete tells the story of his depressed life.',
    status: 'writing', progress: 22,
    writer: 'Jake Morrison', director: 'Tommy Nguyen', vendor: 'Hong Ying Animation',
    airDate: '2027-03-29', scriptDeadline: '2026-06-01', boardDeadline: '2026-07-15',
    animationDeadline: '2026-10-01', deliveryDeadline: '2027-02-15',
    stages: { writing: 75, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-104', number: 104, season: 1,
    title: 'Open House\'s Brilliance of Sitcoms and Comedy',
    synopsis: 'Tommy tries to find the true meaning of comedy.',
    status: 'writing', progress: 15,
    writer: 'Maya Rodriguez', director: 'Tommy Nguyen', vendor: 'Studio Yotta',
    airDate: '2027-04-05', scriptDeadline: '2026-06-15', boardDeadline: '2026-08-01',
    animationDeadline: '2026-10-15', deliveryDeadline: '2027-03-01',
    stages: { writing: 50, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-105', number: 105, season: 1,
    title: 'Forget Me Lot',
    synopsis: 'The boys go to a cemetery.',
    status: 'writing', progress: 8,
    writer: 'Chris Park', director: 'Sarah Chen', vendor: 'Rough Draft Korea',
    airDate: '2027-04-12', scriptDeadline: '2026-07-01', boardDeadline: '2026-08-15',
    animationDeadline: '2026-11-01', deliveryDeadline: '2027-03-15',
    stages: { writing: 30, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-106', number: 106, season: 1,
    title: 'Grounded Hole',
    synopsis: 'The boys go underground.',
    status: 'writing', progress: 5,
    writer: 'Jake Morrison', director: 'Tommy Nguyen', vendor: 'Hong Ying Animation',
    airDate: '2027-04-19', scriptDeadline: '2026-07-15', boardDeadline: '2026-09-01',
    animationDeadline: '2026-11-15', deliveryDeadline: '2027-03-30',
    stages: { writing: 15, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-107', number: 107, season: 1,
    title: 'Say Please to The Bees!',
    synopsis: 'The boys prepare symphonies to bees, but are attacked in the process.',
    status: 'writing', progress: 3,
    writer: 'Maya Rodriguez', director: 'Sarah Chen', vendor: 'Studio Yotta',
    airDate: '2027-04-26', scriptDeadline: '2026-08-01', boardDeadline: '2026-09-15',
    animationDeadline: '2026-12-01', deliveryDeadline: '2027-04-01',
    stages: { writing: 10, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-108', number: 108, season: 1,
    title: 'Another Brilliant Episode',
    synopsis: 'The characters realize they\'re from a cartoon.',
    status: 'writing', progress: 2,
    writer: 'Jake Morrison', director: 'Tommy Nguyen', vendor: 'Rough Draft Korea',
    airDate: '2027-05-03', scriptDeadline: '2026-08-15', boardDeadline: '2026-10-01',
    animationDeadline: '2026-12-15', deliveryDeadline: '2027-04-15',
    stages: { writing: 5, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  // ===== SEASON 2 =====
  {
    id: 'JERK-201', number: 201, season: 2,
    title: 'Vacation',
    synopsis: 'Tommy and the gang goes on a vacation, only to realize it\'s not what it seems.',
    status: 'writing', progress: 0,
    writer: 'Jake Morrison', director: 'Sarah Chen', vendor: 'Studio Yotta',
    airDate: '2028-03-14', scriptDeadline: '2027-03-01', boardDeadline: '2027-05-01',
    animationDeadline: '2027-08-01', deliveryDeadline: '2028-01-15',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-202', number: 202, season: 2,
    title: 'Warned on the 4th of July',
    synopsis: 'Tommy gets illegal fireworks, while Mrs. Harris is on the boy\'s tails.',
    status: 'writing', progress: 0,
    writer: 'Maya Rodriguez', director: 'Tommy Nguyen', vendor: 'Rough Draft Korea',
    airDate: '2028-03-21', scriptDeadline: '2027-03-15', boardDeadline: '2027-05-15',
    animationDeadline: '2027-08-15', deliveryDeadline: '2028-02-01',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-203', number: 203, season: 2,
    title: 'Topher\'s Origin Story of Being a Dead End Accountant',
    synopsis: 'Topher is tired of being an accountant and tries to have fun in his life.',
    status: 'writing', progress: 0,
    writer: 'Chris Park', director: 'Sarah Chen', vendor: 'Hong Ying Animation',
    airDate: '2028-03-28', scriptDeadline: '2027-04-01', boardDeadline: '2027-06-01',
    animationDeadline: '2027-09-01', deliveryDeadline: '2028-02-15',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-204', number: 204, season: 2,
    title: 'Ghosts',
    synopsis: 'Tommy, Dante and Kevin hunt for ghosts.',
    status: 'writing', progress: 0,
    writer: 'Jake Morrison', director: 'Tommy Nguyen', vendor: 'Studio Yotta',
    airDate: '2028-04-04', scriptDeadline: '2027-04-15', boardDeadline: '2027-06-15',
    animationDeadline: '2027-09-15', deliveryDeadline: '2028-03-01',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-205', number: 205, season: 2,
    title: 'Trippy Trippy Bang Bang',
    synopsis: 'The boys go on a strange adventure when Tommy invents a wheel of Trippy Doom.',
    status: 'writing', progress: 0,
    writer: 'Maya Rodriguez', director: 'Sarah Chen', vendor: 'Rough Draft Korea',
    airDate: '2028-04-11', scriptDeadline: '2027-05-01', boardDeadline: '2027-07-01',
    animationDeadline: '2027-10-01', deliveryDeadline: '2028-03-15',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-206', number: 206, season: 2,
    title: 'Back to the Future of the Future',
    synopsis: 'Tommy meets alternate reality versions of himself.',
    status: 'writing', progress: 0,
    writer: 'Chris Park', director: 'Tommy Nguyen', vendor: 'Hong Ying Animation',
    airDate: '2028-04-18', scriptDeadline: '2027-05-15', boardDeadline: '2027-07-15',
    animationDeadline: '2027-10-15', deliveryDeadline: '2028-03-30',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-207', number: 207, season: 2,
    title: 'Copy Machines',
    synopsis: 'Tommy\'s antics causes the printers to go awry.',
    status: 'writing', progress: 0,
    writer: 'Jake Morrison', director: 'Sarah Chen', vendor: 'Studio Yotta',
    airDate: '2028-04-25', scriptDeadline: '2027-06-01', boardDeadline: '2027-08-01',
    animationDeadline: '2027-11-01', deliveryDeadline: '2028-04-01',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-208', number: 208, season: 2,
    title: 'So Long, Restaurant',
    synopsis: 'The gang spends time at a restaurant.',
    status: 'writing', progress: 0,
    writer: 'Maya Rodriguez', director: 'Tommy Nguyen', vendor: 'Rough Draft Korea',
    airDate: '2028-05-02', scriptDeadline: '2027-06-15', boardDeadline: '2027-08-15',
    animationDeadline: '2027-11-15', deliveryDeadline: '2028-04-15',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  // ===== SEASON 3 =====
  {
    id: 'JERK-301', number: 301, season: 3,
    title: 'All Tophers Are Off',
    synopsis: 'Topher switches between modes.',
    status: 'writing', progress: 0,
    writer: 'Jake Morrison', director: 'Sarah Chen', vendor: 'Studio Yotta',
    airDate: '2029-03-13', scriptDeadline: '2028-03-01', boardDeadline: '2028-05-01',
    animationDeadline: '2028-08-01', deliveryDeadline: '2029-01-15',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-302', number: 302, season: 3,
    title: 'The Accountant of Bol',
    synopsis: 'Topher is crowned to the king of Bol.',
    status: 'writing', progress: 0,
    writer: 'Maya Rodriguez', director: 'Tommy Nguyen', vendor: 'Rough Draft Korea',
    airDate: '2029-03-20', scriptDeadline: '2028-03-15', boardDeadline: '2028-05-15',
    animationDeadline: '2028-08-15', deliveryDeadline: '2029-02-01',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-303', number: 303, season: 3,
    title: 'The Light Show Is...Just Lights',
    synopsis: 'The boys go to the light show.',
    status: 'writing', progress: 0,
    writer: 'Chris Park', director: 'Sarah Chen', vendor: 'Hong Ying Animation',
    airDate: '2029-03-27', scriptDeadline: '2028-04-01', boardDeadline: '2028-06-01',
    animationDeadline: '2028-09-01', deliveryDeadline: '2029-02-15',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-304', number: 304, season: 3,
    title: 'Act 4, Scene 5',
    synopsis: 'Tommy builds experimental devices that go haywire.',
    status: 'writing', progress: 0,
    writer: 'Jake Morrison', director: 'Tommy Nguyen', vendor: 'Studio Yotta',
    airDate: '2029-04-03', scriptDeadline: '2028-04-15', boardDeadline: '2028-06-15',
    animationDeadline: '2028-09-15', deliveryDeadline: '2029-03-01',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-305', number: 305, season: 3,
    title: 'Jerks in Love',
    synopsis: 'Tommy studies and makes everyone a couple at his high school.',
    status: 'writing', progress: 0,
    writer: 'Maya Rodriguez', director: 'Sarah Chen', vendor: 'Rough Draft Korea',
    airDate: '2029-04-10', scriptDeadline: '2028-05-01', boardDeadline: '2028-07-01',
    animationDeadline: '2028-10-01', deliveryDeadline: '2029-03-15',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-306', number: 306, season: 3,
    title: 'Al Dante',
    synopsis: 'Tina takes the boys on the ultimate vacation, which turns out to be hellish.',
    status: 'writing', progress: 0,
    writer: 'Chris Park', director: 'Tommy Nguyen', vendor: 'Hong Ying Animation',
    airDate: '2029-04-17', scriptDeadline: '2028-05-15', boardDeadline: '2028-07-15',
    animationDeadline: '2028-10-15', deliveryDeadline: '2029-03-30',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
  {
    id: 'JERK-307', number: 307, season: 3,
    title: 'Lottery of Misfortune',
    synopsis: 'A mom tries to get her lottery ticket back.',
    status: 'writing', progress: 0,
    writer: 'Jake Morrison', director: 'Sarah Chen', vendor: 'Studio Yotta',
    airDate: '2029-04-24', scriptDeadline: '2028-06-01', boardDeadline: '2028-08-01',
    animationDeadline: '2028-11-01', deliveryDeadline: '2029-04-01',
    stages: { writing: 0, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 }
  },
];

export const SEASONS = [1, 2, 3] as const;

export function getEpisodesBySeason(season: number): Episode[] {
  return EPISODES.filter(ep => ep.season === season);
}

export const TASKS: Task[] = [
  { id: 'T-001', title: 'Finalize character redesigns (main cast)', episode: 'JERK-101', assignee: 'Art Dept', department: 'Design', priority: 'high', status: 'in_progress', dueDate: '2026-06-20', createdAt: '2026-06-01' },
  { id: 'T-002', title: 'Record voice session - Departed', episode: 'JERK-101', assignee: 'Audio Team', department: 'Audio', priority: 'critical', status: 'in_progress', dueDate: '2026-06-18', createdAt: '2026-06-05' },
  { id: 'T-003', title: 'Storyboard revisions Act 2 - Store Clerks', episode: 'JERK-102', assignee: 'Board Team', department: 'Storyboard', priority: 'high', status: 'review', dueDate: '2026-06-22', createdAt: '2026-06-08' },
  { id: 'T-004', title: 'Background style guide update', episode: 'ALL', assignee: 'Art Dept', department: 'Design', priority: 'medium', status: 'todo', dueDate: '2026-06-25', createdAt: '2026-06-10' },
  { id: 'T-005', title: 'Script draft - The Pete Life of Pete', episode: 'JERK-103', assignee: 'Jake Morrison', department: 'Writing', priority: 'high', status: 'in_progress', dueDate: '2026-06-30', createdAt: '2026-06-01' },
  { id: 'T-006', title: 'Animation asset handoff - Departed', episode: 'JERK-101', assignee: 'Production Coord', department: 'Production', priority: 'critical', status: 'in_progress', dueDate: '2026-06-17', createdAt: '2026-06-10' },
  { id: 'T-007', title: 'Color script approval', episode: 'JERK-101', assignee: 'Sarah Chen', department: 'Design', priority: 'medium', status: 'review', dueDate: '2026-06-28', createdAt: '2026-06-12' },
  { id: 'T-008', title: 'FX library - Adult Swim distortions', episode: 'ALL', assignee: 'FX Team', department: 'Animation', priority: 'medium', status: 'todo', dueDate: '2026-07-15', createdAt: '2026-06-14' },
  { id: 'T-009', title: 'Opening title sequence animatic', episode: 'ALL', assignee: 'Studio Yotta', department: 'Animation', priority: 'high', status: 'todo', dueDate: '2026-07-01', createdAt: '2026-06-10' },
  { id: 'T-010', title: 'Script outline - Open House\'s Brilliance', episode: 'JERK-104', assignee: 'Maya Rodriguez', department: 'Writing', priority: 'medium', status: 'in_progress', dueDate: '2026-07-05', createdAt: '2026-06-12' },
  { id: 'T-011', title: 'QC review - Departed layout pass', episode: 'JERK-101', assignee: 'QC Team', department: 'QC', priority: 'high', status: 'todo', dueDate: '2026-07-10', createdAt: '2026-06-14' },
  { id: 'T-012', title: 'Vendor contract finalization', episode: 'ALL', assignee: 'Producer', department: 'Production', priority: 'critical', status: 'in_progress', dueDate: '2026-06-20', createdAt: '2026-06-01' },
];

export const VENDORS: Vendor[] = [
  {
    id: 'V-001',
    name: 'Studio Yotta',
    country: 'Japan',
    assignedEpisodes: ['JERK-101', 'JERK-104', 'JERK-107', 'JERK-201', 'JERK-204', 'JERK-207', 'JERK-301', 'JERK-304', 'JERK-307'],
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
    assignedEpisodes: ['JERK-102', 'JERK-105', 'JERK-108', 'JERK-202', 'JERK-205', 'JERK-208', 'JERK-302', 'JERK-305'],
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
    assignedEpisodes: ['JERK-103', 'JERK-106', 'JERK-203', 'JERK-206', 'JERK-303', 'JERK-306'],
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
    description: 'Lead voice actor has conflicting schedule, may delay final voice recording session for Departed.',
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
    title: 'Storyboard revision overload - Store Clerks',
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
  { id: 'CE-01', title: 'Voice Recording - Departed', date: '2026-06-18', type: 'recording', episode: 'JERK-101', assignee: 'Audio Team' },
  { id: 'CE-02', title: 'Storyboard Deadline - Departed', date: '2026-06-15', type: 'deadline', episode: 'JERK-101' },
  { id: 'CE-03', title: 'Asset Handoff - Departed to Studio Yotta', date: '2026-06-17', type: 'delivery', episode: 'JERK-101' },
  { id: 'CE-04', title: 'Script Deadline - The Pete Life of Pete', date: '2026-06-30', type: 'deadline', episode: 'JERK-103' },
  { id: 'CE-05', title: 'Board Deadline - Store Clerks', date: '2026-07-01', type: 'deadline', episode: 'JERK-102' },
  { id: 'CE-06', title: 'Animation Delivery - Departed Layout', date: '2026-07-15', type: 'delivery', episode: 'JERK-101' },
  { id: 'CE-07', title: 'QC Review - Departed', date: '2026-07-10', type: 'review', episode: 'JERK-101' },
  { id: 'CE-08', title: 'Writers Room - Forget Me Lot / Grounded Hole', date: '2026-06-20', type: 'review' },
  { id: 'CE-09', title: 'Vendor Check-in Call', date: '2026-06-19', type: 'review' },
  { id: 'CE-10', title: 'Network Pitch - Season 1 Overview', date: '2026-07-20', type: 'delivery' },
  { id: 'CE-11', title: 'Script Deadline - Open House\'s Brilliance', date: '2026-07-05', type: 'deadline', episode: 'JERK-104' },
  { id: 'CE-12', title: 'Air Date - Departed (Pilot)', date: '2027-03-15', type: 'airdate', episode: 'JERK-101' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'N-01', message: 'JERK-101 "Departed" voice recording due in 3 days', type: 'warning', time: '2h ago', read: false },
  { id: 'N-02', message: 'Storyboard for JERK-102 "Store Clerks" submitted for review', type: 'info', time: '4h ago', read: false },
  { id: 'N-03', message: 'Vendor contract deadline approaching - action required', type: 'error', time: '6h ago', read: false },
  { id: 'N-04', message: 'Character redesigns approved by showrunner', type: 'success', time: '1d ago', read: true },
  { id: 'N-05', message: 'Animation package for "Departed" uploaded by Studio Yotta', type: 'success', time: '1d ago', read: true },
  { id: 'N-06', message: 'New task assigned: QC review Departed layout pass', type: 'info', time: '2d ago', read: true },
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

export function getSeasonProgress(season?: number): number {
  const eps = season ? EPISODES.filter(ep => ep.season === season) : EPISODES;
  if (eps.length === 0) return 0;
  const total = eps.reduce((sum, ep) => sum + ep.progress, 0);
  return Math.round(total / eps.length);
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
