import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ===== ROLES =====
  const roles: Record<string, any> = {};
  const roleDefs = [
    { name: 'admin', displayName: 'Administrator', description: 'Full system access', isSystem: true },
    { name: 'executive_producer', displayName: 'Executive Producer', description: 'Oversight, approvals, read-all access', isSystem: true },
    { name: 'showrunner', displayName: 'Showrunner', description: 'Creative lead, manages writers and story', isSystem: true },
    { name: 'producer', displayName: 'Producer', description: 'Day-to-day production management', isSystem: true },
    { name: 'production_coord', displayName: 'Production Coordinator', description: 'Schedules, assignments, logistics', isSystem: true },
    { name: 'writer', displayName: 'Writer', description: 'Script creation and revision', isSystem: true },
    { name: 'storyboard_artist', displayName: 'Storyboard Artist', description: 'Storyboard creation', isSystem: true },
    { name: 'audio_engineer', displayName: 'Audio Engineer', description: 'Voice recording and audio post', isSystem: true },
    { name: 'vendor_lead', displayName: 'Vendor Lead', description: 'External studio lead', isSystem: true },
    { name: 'qc_reviewer', displayName: 'QC Reviewer', description: 'Quality control review and approval', isSystem: true },
    { name: 'network_reviewer', displayName: 'Network Reviewer', description: 'Network notes and final approval', isSystem: true },
  ];

  for (const r of roleDefs) {
    roles[r.name] = await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r,
    });
  }

  // ===== PERMISSIONS =====
  const permDefs: { role: string; resource: string; action: string; scope: string }[] = [
    // Executive Producer
    ...['seasons', 'episodes', 'tasks', 'assets', 'deliveries', 'risks', 'characters', 'vendors', 'reports', 'users', 'notes'].map(r => ({ role: 'executive_producer', resource: r, action: 'view', scope: 'all' })),
    { role: 'executive_producer', resource: 'episodes', action: 'approve', scope: 'all' },
    { role: 'executive_producer', resource: 'assets', action: 'approve', scope: 'all' },
    { role: 'executive_producer', resource: 'deliveries', action: 'approve', scope: 'all' },
    { role: 'executive_producer', resource: 'risks', action: 'edit', scope: 'all' },
    { role: 'executive_producer', resource: 'reports', action: 'export', scope: 'all' },
    { role: 'executive_producer', resource: 'notes', action: 'create', scope: 'all' },
    // Producer
    ...['seasons', 'episodes', 'tasks', 'assets', 'deliveries', 'risks', 'characters', 'vendors', 'reports', 'users', 'notes'].map(r => ({ role: 'producer', resource: r, action: 'view', scope: 'all' })),
    ...['episodes', 'tasks', 'assets', 'risks', 'characters', 'vendors', 'notes'].map(r => ({ role: 'producer', resource: r, action: 'create', scope: 'all' })),
    ...['seasons', 'episodes', 'tasks', 'risks', 'characters', 'vendors'].map(r => ({ role: 'producer', resource: r, action: 'edit', scope: 'all' })),
    { role: 'producer', resource: 'tasks', action: 'assign', scope: 'all' },
    { role: 'producer', resource: 'tasks', action: 'delete', scope: 'all' },
    { role: 'producer', resource: 'episodes', action: 'approve', scope: 'all' },
    { role: 'producer', resource: 'assets', action: 'upload', scope: 'all' },
    { role: 'producer', resource: 'assets', action: 'approve', scope: 'all' },
    { role: 'producer', resource: 'deliveries', action: 'approve', scope: 'all' },
    { role: 'producer', resource: 'vendors', action: 'assign', scope: 'all' },
    { role: 'producer', resource: 'reports', action: 'export', scope: 'all' },
    // Showrunner
    ...['seasons', 'episodes', 'tasks', 'assets', 'deliveries', 'risks', 'characters', 'vendors', 'reports', 'users', 'notes'].map(r => ({ role: 'showrunner', resource: r, action: 'view', scope: 'all' })),
    ...['episodes', 'tasks', 'characters', 'notes'].map(r => ({ role: 'showrunner', resource: r, action: 'create', scope: 'all' })),
    ...['episodes', 'tasks', 'characters'].map(r => ({ role: 'showrunner', resource: r, action: 'edit', scope: 'all' })),
    { role: 'showrunner', resource: 'tasks', action: 'assign', scope: 'all' },
    { role: 'showrunner', resource: 'episodes', action: 'approve', scope: 'all' },
    { role: 'showrunner', resource: 'assets', action: 'upload', scope: 'all' },
    { role: 'showrunner', resource: 'assets', action: 'approve', scope: 'all' },
    { role: 'showrunner', resource: 'deliveries', action: 'approve', scope: 'all' },
    { role: 'showrunner', resource: 'vendors', action: 'assign', scope: 'all' },
    { role: 'showrunner', resource: 'risks', action: 'create', scope: 'all' },
    { role: 'showrunner', resource: 'risks', action: 'edit', scope: 'all' },
    { role: 'showrunner', resource: 'reports', action: 'export', scope: 'all' },
    // Production Coordinator
    ...['seasons', 'episodes', 'tasks', 'assets', 'deliveries', 'risks', 'characters', 'vendors', 'reports', 'users', 'notes'].map(r => ({ role: 'production_coord', resource: r, action: 'view', scope: 'all' })),
    ...['tasks', 'risks', 'notes'].map(r => ({ role: 'production_coord', resource: r, action: 'create', scope: 'all' })),
    ...['episodes', 'tasks', 'risks', 'vendors'].map(r => ({ role: 'production_coord', resource: r, action: 'edit', scope: 'all' })),
    { role: 'production_coord', resource: 'tasks', action: 'assign', scope: 'all' },
    { role: 'production_coord', resource: 'assets', action: 'upload', scope: 'all' },
    { role: 'production_coord', resource: 'vendors', action: 'assign', scope: 'all' },
    // Writer
    ...['seasons', 'episodes', 'characters'].map(r => ({ role: 'writer', resource: r, action: 'view', scope: 'all' })),
    { role: 'writer', resource: 'tasks', action: 'view', scope: 'own' },
    { role: 'writer', resource: 'tasks', action: 'edit', scope: 'own' },
    { role: 'writer', resource: 'assets', action: 'view', scope: 'own' },
    { role: 'writer', resource: 'assets', action: 'upload', scope: 'own' },
    { role: 'writer', resource: 'notes', action: 'view', scope: 'own' },
    { role: 'writer', resource: 'notes', action: 'create', scope: 'all' },
    // Vendor Lead
    ...['episodes', 'tasks', 'assets', 'deliveries', 'risks', 'characters', 'vendors', 'reports', 'users', 'notes'].map(r => ({ role: 'vendor_lead', resource: r, action: 'view', scope: 'vendor_scoped' })),
    { role: 'vendor_lead', resource: 'tasks', action: 'edit', scope: 'vendor_scoped' },
    { role: 'vendor_lead', resource: 'assets', action: 'upload', scope: 'vendor_scoped' },
    { role: 'vendor_lead', resource: 'deliveries', action: 'deliver', scope: 'vendor_scoped' },
    { role: 'vendor_lead', resource: 'notes', action: 'create', scope: 'vendor_scoped' },
    // QC Reviewer
    ...['seasons', 'episodes', 'tasks', 'assets', 'deliveries', 'risks', 'characters', 'vendors', 'notes'].map(r => ({ role: 'qc_reviewer', resource: r, action: 'view', scope: 'all' })),
    { role: 'qc_reviewer', resource: 'episodes', action: 'approve', scope: 'all' },
    { role: 'qc_reviewer', resource: 'assets', action: 'approve', scope: 'all' },
    { role: 'qc_reviewer', resource: 'deliveries', action: 'approve', scope: 'all' },
    { role: 'qc_reviewer', resource: 'notes', action: 'create', scope: 'all' },
    // Network Reviewer
    ...['seasons', 'episodes', 'assets', 'deliveries', 'characters', 'reports', 'notes'].map(r => ({ role: 'network_reviewer', resource: r, action: 'view', scope: 'all' })),
    { role: 'network_reviewer', resource: 'episodes', action: 'approve', scope: 'all' },
    { role: 'network_reviewer', resource: 'assets', action: 'approve', scope: 'all' },
    { role: 'network_reviewer', resource: 'deliveries', action: 'approve', scope: 'all' },
    { role: 'network_reviewer', resource: 'reports', action: 'export', scope: 'all' },
    { role: 'network_reviewer', resource: 'notes', action: 'create', scope: 'all' },
  ];

  for (const p of permDefs) {
    await prisma.permission.upsert({
      where: {
        roleId_resource_action: {
          roleId: roles[p.role].id,
          resource: p.resource,
          action: p.action,
        },
      },
      update: { scope: p.scope },
      create: {
        roleId: roles[p.role].id,
        resource: p.resource,
        action: p.action,
        scope: p.scope,
      },
    });
  }

  // ===== VENDORS =====
  const vendors: Record<string, any> = {};
  const vendorDefs = [
    { name: 'Studio Yotta', country: 'Japan', qualityScore: 95, deliveryScore: 92, status: 'active', specialization: 'High-quality 2D animation, action sequences' },
    { name: 'Rough Draft Korea', country: 'South Korea', qualityScore: 90, deliveryScore: 88, status: 'active', specialization: 'Comedy animation, expressive character acting' },
    { name: 'Hong Ying Animation', country: 'China', qualityScore: 87, deliveryScore: 85, status: 'active', specialization: 'Background art, atmospheric scenes' },
  ];
  for (const v of vendorDefs) {
    vendors[v.name] = await prisma.vendor.upsert({
      where: { id: v.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: { id: v.name.toLowerCase().replace(/\s+/g, '-'), ...v },
    });
  }

  // ===== USERS =====
  const pw = hashSync('password123', 12);
  const users: Record<string, any> = {};
  const userDefs = [
    { email: 'admin@jerkaholics.com', name: 'System Admin', role: 'admin' },
    { email: 'ep@jerkaholics.com', name: 'Executive Producer', role: 'executive_producer' },
    { email: 'showrunner@jerkaholics.com', name: 'Lead Showrunner', role: 'showrunner' },
    { email: 'producer@jerkaholics.com', name: 'Line Producer', role: 'producer' },
    { email: 'coord@jerkaholics.com', name: 'Production Coordinator', role: 'production_coord' },
    { email: 'jake@jerkaholics.com', name: 'Jake Morrison', role: 'writer' },
    { email: 'maya@jerkaholics.com', name: 'Maya Rodriguez', role: 'writer' },
    { email: 'chris@jerkaholics.com', name: 'Chris Park', role: 'writer' },
    { email: 'sarah@jerkaholics.com', name: 'Sarah Chen', role: 'producer' },
    { email: 'tommy.n@jerkaholics.com', name: 'Tommy Nguyen', role: 'producer' },
    { email: 'yotta@jerkaholics.com', name: 'Yotta Lead', role: 'vendor_lead', vendorId: vendors['Studio Yotta'].id },
    { email: 'roughdraft@jerkaholics.com', name: 'RDK Lead', role: 'vendor_lead', vendorId: vendors['Rough Draft Korea'].id },
    { email: 'hongying@jerkaholics.com', name: 'HY Lead', role: 'vendor_lead', vendorId: vendors['Hong Ying Animation'].id },
    { email: 'qc@jerkaholics.com', name: 'QC Lead', role: 'qc_reviewer' },
    { email: 'network@adultswim.com', name: 'Network Rep', role: 'network_reviewer' },
  ];

  for (const u of userDefs) {
    users[u.email] = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        passwordHash: pw,
        roleId: roles[u.role].id,
        vendorId: u.vendorId || null,
      },
    });
  }

  // ===== SEASONS =====
  const seasons: Record<number, any> = {};
  const seasonDefs = [
    { number: 1, title: 'Season 1', episodeCount: 8, status: 'in_production', startDate: new Date('2026-05-01') },
    { number: 2, title: 'Season 2', episodeCount: 8, status: 'pre_production', startDate: new Date('2027-03-01') },
    { number: 3, title: 'Season 3', episodeCount: 7, status: 'pre_production', startDate: new Date('2028-03-01') },
  ];
  for (const s of seasonDefs) {
    seasons[s.number] = await prisma.season.upsert({
      where: { number: s.number },
      update: {},
      create: s,
    });
  }

  // ===== EPISODES =====
  const vendorMap: Record<string, string> = {
    'Studio Yotta': vendors['Studio Yotta'].id,
    'Rough Draft Korea': vendors['Rough Draft Korea'].id,
    'Hong Ying Animation': vendors['Hong Ying Animation'].id,
  };

  const episodeDefs = [
    // Season 1
    { code: 'JERK-101', num: 1, season: 1, title: 'Departed', synopsis: "The boys use Mr. Wither's teleportation device.", status: 'in_progress', stage: 'animation', progress: 62, deadline: '2027-01-15', airDate: '2027-03-15', vendor: 'Studio Yotta', scriptLocked: true },
    { code: 'JERK-102', num: 2, season: 1, title: 'Store Clerks', synopsis: "Tommy's behavior causes problems at the grocery store and the town.", status: 'in_progress', stage: 'storyboard', progress: 38, deadline: '2027-02-01', airDate: '2027-03-22', vendor: 'Rough Draft Korea', scriptLocked: true },
    { code: 'JERK-103', num: 3, season: 1, title: 'The Pete Life of Pete', synopsis: 'Pete tells the story of his depressed life.', status: 'in_progress', stage: 'writing', progress: 22, deadline: '2027-02-15', airDate: '2027-03-29', vendor: 'Hong Ying Animation', scriptLocked: false },
    { code: 'JERK-104', num: 4, season: 1, title: "Open House's Brilliance of Sitcoms and Comedy", synopsis: 'Tommy tries to find the true meaning of comedy.', status: 'in_progress', stage: 'writing', progress: 15, deadline: '2027-03-01', airDate: '2027-04-05', vendor: 'Studio Yotta', scriptLocked: false },
    { code: 'JERK-105', num: 5, season: 1, title: 'Forget Me Lot', synopsis: 'The boys go to a cemetery.', status: 'in_progress', stage: 'writing', progress: 8, deadline: '2027-03-15', airDate: '2027-04-12', vendor: 'Rough Draft Korea', scriptLocked: false },
    { code: 'JERK-106', num: 6, season: 1, title: 'Grounded Hole', synopsis: 'The boys go underground.', status: 'in_progress', stage: 'writing', progress: 5, deadline: '2027-03-30', airDate: '2027-04-19', vendor: 'Hong Ying Animation', scriptLocked: false },
    { code: 'JERK-107', num: 7, season: 1, title: 'Say Please to The Bees!', synopsis: 'The boys prepare symphonies to bees, but are attacked in the process.', status: 'in_progress', stage: 'writing', progress: 3, deadline: '2027-04-01', airDate: '2027-04-26', vendor: 'Studio Yotta', scriptLocked: false },
    { code: 'JERK-108', num: 8, season: 1, title: 'Another Brilliant Episode', synopsis: "The characters realize they're from a cartoon.", status: 'in_progress', stage: 'writing', progress: 2, deadline: '2027-04-15', airDate: '2027-05-03', vendor: 'Rough Draft Korea', scriptLocked: false },
    // Season 2
    { code: 'JERK-201', num: 1, season: 2, title: 'Vacation', synopsis: "Tommy and the gang goes on a vacation, only to realize it's not what it seems.", status: 'not_started', stage: 'writing', progress: 0, deadline: '2028-01-15', airDate: '2028-03-14', vendor: 'Studio Yotta', scriptLocked: false },
    { code: 'JERK-202', num: 2, season: 2, title: 'Warned on the 4th of July', synopsis: "Tommy gets illegal fireworks, while Mrs. Harris is on the boy's tails.", status: 'not_started', stage: 'writing', progress: 0, deadline: '2028-02-01', airDate: '2028-03-21', vendor: 'Rough Draft Korea', scriptLocked: false },
    { code: 'JERK-203', num: 3, season: 2, title: "Topher's Origin Story of Being a Dead End Accountant", synopsis: 'Topher is tired of being an accountant and tries to have fun in his life.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2028-02-15', airDate: '2028-03-28', vendor: 'Hong Ying Animation', scriptLocked: false },
    { code: 'JERK-204', num: 4, season: 2, title: 'Ghosts', synopsis: 'Tommy, Dante and Kevin hunt for ghosts.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2028-03-01', airDate: '2028-04-04', vendor: 'Studio Yotta', scriptLocked: false },
    { code: 'JERK-205', num: 5, season: 2, title: 'Trippy Trippy Bang Bang', synopsis: 'The boys go on a strange adventure when Tommy invents a wheel of Trippy Doom.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2028-03-15', airDate: '2028-04-11', vendor: 'Rough Draft Korea', scriptLocked: false },
    { code: 'JERK-206', num: 6, season: 2, title: 'Back to the Future of the Future', synopsis: 'Tommy meets alternate reality versions of himself.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2028-03-30', airDate: '2028-04-18', vendor: 'Hong Ying Animation', scriptLocked: false },
    { code: 'JERK-207', num: 7, season: 2, title: 'Copy Machines', synopsis: "Tommy's antics causes the printers to go awry.", status: 'not_started', stage: 'writing', progress: 0, deadline: '2028-04-01', airDate: '2028-04-25', vendor: 'Studio Yotta', scriptLocked: false },
    { code: 'JERK-208', num: 8, season: 2, title: 'So Long, Restaurant', synopsis: 'The gang spends time at a restaurant.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2028-04-15', airDate: '2028-05-02', vendor: 'Rough Draft Korea', scriptLocked: false },
    // Season 3
    { code: 'JERK-301', num: 1, season: 3, title: 'All Tophers Are Off', synopsis: 'Topher switches between modes.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2029-01-15', airDate: '2029-03-13', vendor: 'Studio Yotta', scriptLocked: false },
    { code: 'JERK-302', num: 2, season: 3, title: 'The Accountant of Bol', synopsis: 'Topher is crowned to the king of Bol.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2029-02-01', airDate: '2029-03-20', vendor: 'Rough Draft Korea', scriptLocked: false },
    { code: 'JERK-303', num: 3, season: 3, title: 'The Light Show Is...Just Lights', synopsis: 'The boys go to the light show.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2029-02-15', airDate: '2029-03-27', vendor: 'Hong Ying Animation', scriptLocked: false },
    { code: 'JERK-304', num: 4, season: 3, title: 'Act 4, Scene 5', synopsis: 'Tommy builds experimental devices that go haywire.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2029-03-01', airDate: '2029-04-03', vendor: 'Studio Yotta', scriptLocked: false },
    { code: 'JERK-305', num: 5, season: 3, title: 'Jerks in Love', synopsis: 'Tommy studies and makes everyone a couple at his high school.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2029-03-15', airDate: '2029-04-10', vendor: 'Rough Draft Korea', scriptLocked: false },
    { code: 'JERK-306', num: 6, season: 3, title: 'Al Dante', synopsis: 'Tina takes the boys on the ultimate vacation, which turns out to be hellish.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2029-03-30', airDate: '2029-04-17', vendor: 'Hong Ying Animation', scriptLocked: false },
    { code: 'JERK-307', num: 7, season: 3, title: 'Lottery of Misfortune', synopsis: 'A mom tries to get her lottery ticket back.', status: 'not_started', stage: 'writing', progress: 0, deadline: '2029-04-01', airDate: '2029-04-24', vendor: 'Studio Yotta', scriptLocked: false },
  ];

  const episodes: Record<string, any> = {};
  for (const ep of episodeDefs) {
    const created = await prisma.episode.upsert({
      where: { productionCode: ep.code },
      update: {},
      create: {
        seasonId: seasons[ep.season].id,
        productionCode: ep.code,
        episodeNumber: ep.num,
        title: ep.title,
        synopsis: ep.synopsis,
        status: ep.status,
        currentStage: ep.stage,
        progress: ep.progress,
        deliveryDeadline: new Date(ep.deadline),
        airDate: new Date(ep.airDate),
        scriptLocked: ep.scriptLocked,
        createdById: users['producer@jerkaholics.com'].id,
      },
    });
    episodes[ep.code] = created;

    // Create vendor assignment
    await prisma.vendorAssignment.upsert({
      where: { vendorId_episodeId: { vendorId: vendorMap[ep.vendor], episodeId: created.id } },
      update: {},
      create: {
        vendorId: vendorMap[ep.vendor],
        episodeId: created.id,
        assignedById: users['producer@jerkaholics.com'].id,
        status: ep.progress > 0 ? 'in_progress' : 'assigned',
      },
    });

    // Create episode stage records
    const stages = ['writing', 'storyboard', 'animatic', 'voice', 'animation', 'cleanup', 'post', 'delivery'];
    const stageProgress: Record<string, Record<string, number>> = {
      'JERK-101': { writing: 100, storyboard: 100, animatic: 100, voice: 85, animation: 40, cleanup: 0, post: 0, delivery: 0 },
      'JERK-102': { writing: 100, storyboard: 55, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 },
      'JERK-103': { writing: 75, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 },
      'JERK-104': { writing: 50, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 },
      'JERK-105': { writing: 30, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 },
      'JERK-106': { writing: 15, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 },
      'JERK-107': { writing: 10, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 },
      'JERK-108': { writing: 5, storyboard: 0, animatic: 0, voice: 0, animation: 0, cleanup: 0, post: 0, delivery: 0 },
    };

    for (const stage of stages) {
      const prog = stageProgress[ep.code]?.[stage] ?? 0;
      await prisma.episodeStage.upsert({
        where: { episodeId_stage: { episodeId: created.id, stage } },
        update: { progress: prog },
        create: { episodeId: created.id, stage, progress: prog },
      });
    }
  }

  // ===== CHARACTERS =====
  const charDefs = [
    { name: 'Tommy', voiceActor: 'Danny Pudi', type: 'main', description: "The ringleader of the group. A fast-talking, scheming troublemaker with wild ideas and zero impulse control. Wears oversized round glasses and a brown t-shirt. Blonde messy hair.", roles: ['Tommy'], traits: ['Impulsive', 'Creative', 'Chaotic', 'Fast-talking'], firstEp: 'JERK-101' },
    { name: 'Kevin', voiceActor: 'Andy Samberg', type: 'main', description: "Tommy's best friend and reluctant partner in crime. Wears a dark beanie and blue hoodie over a red shirt. Dark spiky hair. Often the voice of reason that nobody listens to.", roles: ['Kevin', 'Jerry', 'Alternate Kevin #2', 'Paper Kevin', 'Older Kevin'], traits: ['Cautious', 'Loyal', 'Anxious', 'Sarcastic'], firstEp: 'JERK-101' },
    { name: 'Dante', voiceActor: 'Kenan Thompson', type: 'main', description: 'The third member of the group. Pale complexion with white/silver hair and distinctive red eyes. Wears a dark jacket over a maroon shirt. Dry wit and deadpan delivery.', roles: ['Dante', 'Marvin', 'Lifeguard', 'Alternate Dante #1', 'Panicked Reporter', 'Paper Dante'], traits: ['Deadpan', 'Mysterious', 'Blunt', 'Unpredictable'], firstEp: 'JERK-101' },
    { name: 'Pete', voiceActor: 'H. Jon Benjamin', type: 'recurring', description: "A depressed and melancholic character who tells the story of his life. Central to Episode 103 'The Pete Life of Pete'. H. Jon Benjamin also voices the Narrator, Bartender, and Eddie.", roles: ['Pete', 'Narrator', 'Bartender', 'Eddie'], traits: ['Depressed', 'Introspective', 'Relatable'], firstEp: 'JERK-103' },
    { name: 'Topher', voiceActor: 'Jason Schwartzman', type: 'recurring', description: 'A recurring character who is a bored accountant. Has multiple storylines across seasons including becoming the King of Bol and switching between modes.', roles: ['Topher', 'Young Topher'], traits: ['Bored', 'Adventurous', 'Dual-natured'], firstEp: 'JERK-203' },
    { name: 'Mrs. Harris', voiceActor: 'Rhea Perlman', type: 'recurring', description: 'An older woman who keeps a watchful eye on the boys. Stern-faced with gray curly hair.', roles: ['Mrs. Harris', 'Elderly Lady #1'], traits: ['Stern', 'Watchful', 'Persistent'], firstEp: 'JERK-101' },
    { name: 'Tina', voiceActor: 'Wendi McLendon-Covey', type: 'recurring', description: 'Takes the boys on what seems like the ultimate vacation in Episode 306 "Al Dante" - which turns out to be hellish.', roles: ['Tina'], traits: ['Deceptive', 'Adventurous'], firstEp: 'JERK-306' },
    { name: 'Mr. Withers', voiceActor: 'Jeff Goldblum', type: 'recurring', description: 'Owner of the teleportation device used in the pilot episode "Departed". An eccentric inventor-type character.', roles: ['Mr. Withers'], traits: ['Eccentric', 'Inventive'], firstEp: 'JERK-101' },
  ];

  for (const ch of charDefs) {
    const char = await prisma.character.create({
      data: {
        name: ch.name,
        voiceActor: ch.voiceActor,
        description: ch.description,
        type: ch.type,
        firstAppearanceId: episodes[ch.firstEp]?.id,
      },
    });

    for (const role of ch.roles) {
      await prisma.characterRole.create({ data: { characterId: char.id, roleName: role } });
    }
    for (const trait of ch.traits) {
      await prisma.characterTrait.create({ data: { characterId: char.id, trait } });
    }
  }

  // ===== TASKS =====
  const taskDefs = [
    { title: 'Finalize character redesigns (main cast)', epCode: 'JERK-101', dept: 'Design', stage: 'animation', status: 'in_progress', priority: 'high', assignee: 'coord@jerkaholics.com', dueDate: '2026-06-20' },
    { title: 'Record voice session - Departed', epCode: 'JERK-101', dept: 'Audio', stage: 'voice', status: 'in_progress', priority: 'critical', assignee: 'coord@jerkaholics.com', dueDate: '2026-06-18' },
    { title: 'Storyboard revisions Act 2 - Store Clerks', epCode: 'JERK-102', dept: 'Storyboard', stage: 'storyboard', status: 'review', priority: 'high', assignee: 'coord@jerkaholics.com', dueDate: '2026-06-22' },
    { title: 'Background style guide update', epCode: 'JERK-101', dept: 'Design', stage: 'animation', status: 'todo', priority: 'medium', assignee: 'coord@jerkaholics.com', dueDate: '2026-06-25' },
    { title: 'Script draft - The Pete Life of Pete', epCode: 'JERK-103', dept: 'Writing', stage: 'writing', status: 'in_progress', priority: 'high', assignee: 'jake@jerkaholics.com', dueDate: '2026-06-30' },
    { title: 'Animation asset handoff - Departed', epCode: 'JERK-101', dept: 'Production', stage: 'animation', status: 'in_progress', priority: 'critical', assignee: 'coord@jerkaholics.com', dueDate: '2026-06-17' },
    { title: 'Color script approval', epCode: 'JERK-101', dept: 'Design', stage: 'animation', status: 'review', priority: 'medium', assignee: 'sarah@jerkaholics.com', dueDate: '2026-06-28' },
    { title: 'FX library - Adult Swim distortions', epCode: 'JERK-101', dept: 'Animation', stage: 'animation', status: 'todo', priority: 'medium', assignee: 'coord@jerkaholics.com', dueDate: '2026-07-15' },
    { title: 'Opening title sequence animatic', epCode: 'JERK-101', dept: 'Animation', stage: 'animatic', status: 'todo', priority: 'high', assignee: 'yotta@jerkaholics.com', dueDate: '2026-07-01' },
    { title: "Script outline - Open House's Brilliance", epCode: 'JERK-104', dept: 'Writing', stage: 'writing', status: 'in_progress', priority: 'medium', assignee: 'maya@jerkaholics.com', dueDate: '2026-07-05' },
    { title: 'QC review - Departed layout pass', epCode: 'JERK-101', dept: 'QC', stage: 'animation', status: 'todo', priority: 'high', assignee: 'qc@jerkaholics.com', dueDate: '2026-07-10' },
    { title: 'Vendor contract finalization', epCode: 'JERK-101', dept: 'Production', stage: 'animation', status: 'in_progress', priority: 'critical', assignee: 'producer@jerkaholics.com', dueDate: '2026-06-20' },
  ];

  for (const t of taskDefs) {
    await prisma.task.create({
      data: {
        episodeId: episodes[t.epCode].id,
        title: t.title,
        department: t.dept,
        stage: t.stage,
        status: t.status,
        priority: t.priority,
        assignedToId: users[t.assignee]?.id,
        dueDate: new Date(t.dueDate),
        createdById: users['producer@jerkaholics.com'].id,
      },
    });
  }

  // ===== RISKS =====
  const riskDefs = [
    { title: 'Voice recording delay - Lead actor scheduling', epCode: 'JERK-101', severity: 'high', category: 'schedule', description: 'Lead voice actor has conflicting schedule, may delay final voice recording session for Departed.', mitigation: 'Explore remote recording options; schedule backup session dates.', owner: 'coord@jerkaholics.com', status: 'mitigating' },
    { title: 'Vendor contract negotiation stalling', epCode: null, severity: 'critical', category: 'vendor', description: 'Animation vendor contracts not yet finalized. Could delay handoff pipeline.', mitigation: 'Escalate to EP. Set hard deadline for contract signing.', owner: 'producer@jerkaholics.com', status: 'identified' },
    { title: 'Storyboard revision overload - Store Clerks', epCode: 'JERK-102', severity: 'medium', category: 'quality', description: 'Episode 102 boards have gone through 3 revision cycles. Team bandwidth at risk.', mitigation: 'Lock board direction after next pass. Add freelance support if needed.', owner: 'coord@jerkaholics.com', status: 'mitigating' },
    { title: 'Character redesign scope creep', epCode: 'JERK-101', severity: 'medium', category: 'schedule', description: 'Main character set still in revision. Could cascade delays to animation.', mitigation: 'Set final approval date. Lock designs after showrunner sign-off.', owner: 'coord@jerkaholics.com', status: 'identified' },
  ];

  for (const r of riskDefs) {
    await prisma.risk.create({
      data: {
        episodeId: r.epCode ? episodes[r.epCode]?.id : null,
        seasonId: !r.epCode ? seasons[1].id : null,
        title: r.title,
        description: r.description,
        severity: r.severity,
        status: r.status,
        category: r.category,
        mitigationPlan: r.mitigation,
        ownerId: users[r.owner].id,
      },
    });
  }

  // ===== CHARACTER ASSETS =====
  const adminId = users['admin@jerkaholics.com'].id;
  const tommy = await prisma.character.findFirst({ where: { name: 'Tommy' } });
  const kevin = await prisma.character.findFirst({ where: { name: 'Kevin' } });
  const dante = await prisma.character.findFirst({ where: { name: 'Dante' } });
  const mrsHarris = await prisma.character.findFirst({ where: { name: 'Mrs. Harris' } });

  if (tommy) {
    const tommyAssets = [
      { name: 'Tommy - Main Reference', type: 'reference', version: 'v3.2', status: 'approved', category: 'character' },
      { name: 'Tommy - Model Sheet (Full Body)', type: 'model_sheet', version: 'v2.1', status: 'approved', category: 'character' },
      { name: 'Tommy - Expression Sheet', type: 'expression_sheet', version: 'v1.4', status: 'pending', category: 'character' },
      { name: 'Tommy - Turnaround', type: 'turnaround', version: 'v2.0', status: 'approved', category: 'character' },
      { name: 'Tommy - Color Key', type: 'color_key', version: 'v1.1', status: 'approved', category: 'character' },
    ];
    for (const a of tommyAssets) {
      await prisma.asset.create({ data: { ...a, characterId: tommy.id, filePath: `/assets/characters/tommy/${a.type}.png`, uploadedById: adminId } });
    }
  }
  if (kevin) {
    const kevinAssets = [
      { name: 'Kevin - Main Reference', type: 'reference', version: 'v3.0', status: 'approved', category: 'character' },
      { name: 'Kevin - Model Sheet (Full Body)', type: 'model_sheet', version: 'v2.0', status: 'approved', category: 'character' },
      { name: 'Kevin - Expression Sheet', type: 'expression_sheet', version: 'v1.2', status: 'pending', category: 'character' },
      { name: 'Kevin - Turnaround', type: 'turnaround', version: 'v2.0', status: 'approved', category: 'character' },
    ];
    for (const a of kevinAssets) {
      await prisma.asset.create({ data: { ...a, characterId: kevin.id, filePath: `/assets/characters/kevin/${a.type}.png`, uploadedById: adminId } });
    }
  }
  if (dante) {
    const danteAssets = [
      { name: 'Dante - Main Reference', type: 'reference', version: 'v3.1', status: 'approved', category: 'character' },
      { name: 'Dante - Model Sheet (Full Body)', type: 'model_sheet', version: 'v2.0', status: 'approved', category: 'character' },
      { name: 'Dante - Expression Sheet', type: 'expression_sheet', version: 'v1.3', status: 'approved', category: 'character' },
    ];
    for (const a of danteAssets) {
      await prisma.asset.create({ data: { ...a, characterId: dante.id, filePath: `/assets/characters/dante/${a.type}.png`, uploadedById: adminId } });
    }
  }
  if (mrsHarris) {
    await prisma.asset.create({ data: { name: 'Mrs. Harris - Main Reference', type: 'reference', version: 'v2.0', status: 'approved', category: 'character', characterId: mrsHarris.id, filePath: '/assets/characters/mrs-harris/reference.png', uploadedById: adminId } });
    await prisma.asset.create({ data: { name: 'Mrs. Harris - Expression Sheet', type: 'expression_sheet', version: 'v1.0', status: 'pending', category: 'character', characterId: mrsHarris.id, filePath: '/assets/characters/mrs-harris/expression_sheet.png', uploadedById: adminId } });
  }

  console.log('Seed complete!');
  console.log(`  Roles: ${Object.keys(roles).length}`);
  console.log(`  Users: ${Object.keys(users).length}`);
  console.log(`  Seasons: ${Object.keys(seasons).length}`);
  console.log(`  Episodes: ${Object.keys(episodes).length}`);
  console.log(`  Vendors: ${Object.keys(vendors).length}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
