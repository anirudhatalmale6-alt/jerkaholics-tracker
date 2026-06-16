import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate, requirePermission, logAudit } from '@/lib/api-helpers';

const STAGE_ORDER = ['writing', 'storyboard', 'animatic', 'voice', 'animation', 'cleanup', 'post', 'delivery'];

const PREREQUISITES: Record<string, (episodeId: string) => Promise<{ met: boolean; reason?: string }>> = {
  storyboard: async (episodeId) => {
    const ep = await prisma.episode.findUnique({ where: { id: episodeId } });
    if (!ep?.scriptLocked) return { met: false, reason: 'Script must be locked before storyboard begins' };
    const writingTasks = await prisma.task.findMany({ where: { episodeId, stage: 'writing', status: { not: 'done' } } });
    if (writingTasks.length > 0) return { met: false, reason: `${writingTasks.length} writing tasks not complete` };
    return { met: true };
  },
  animatic: async (episodeId) => {
    const boardTasks = await prisma.task.findMany({ where: { episodeId, stage: 'storyboard', status: { not: 'done' } } });
    if (boardTasks.length > 0) return { met: false, reason: `${boardTasks.length} storyboard tasks not complete` };
    return { met: true };
  },
  voice: async (episodeId) => {
    const animaticTasks = await prisma.task.findMany({ where: { episodeId, stage: 'animatic', status: { not: 'done' } } });
    if (animaticTasks.length > 0) return { met: false, reason: `${animaticTasks.length} animatic tasks not complete` };
    return { met: true };
  },
  animation: async (episodeId) => {
    const voiceTasks = await prisma.task.findMany({ where: { episodeId, stage: 'voice', status: { not: 'done' } } });
    if (voiceTasks.length > 0) return { met: false, reason: `${voiceTasks.length} voice tasks not complete` };
    const assignment = await prisma.vendorAssignment.findFirst({ where: { episodeId, status: { not: 'cancelled' } } });
    if (!assignment) return { met: false, reason: 'No vendor assigned to this episode' };
    return { met: true };
  },
  cleanup: async (episodeId) => {
    const animTasks = await prisma.task.findMany({ where: { episodeId, stage: 'animation', status: { not: 'done' } } });
    if (animTasks.length > 0) return { met: false, reason: `${animTasks.length} animation tasks not complete` };
    const delivery = await prisma.delivery.findFirst({ where: { episodeId, status: 'approved', deliveryType: { in: ['rough_animation', 'cleaned_animation'] } } });
    if (!delivery) return { met: false, reason: 'No approved animation delivery found' };
    return { met: true };
  },
  post: async (episodeId) => {
    const cleanupTasks = await prisma.task.findMany({ where: { episodeId, stage: 'cleanup', status: { not: 'done' } } });
    if (cleanupTasks.length > 0) return { met: false, reason: `${cleanupTasks.length} cleanup tasks not complete` };
    return { met: true };
  },
  delivery: async (episodeId) => {
    const postTasks = await prisma.task.findMany({ where: { episodeId, stage: 'post', status: { not: 'done' } } });
    if (postTasks.length > 0) return { met: false, reason: `${postTasks.length} post-production tasks not complete` };
    return { met: true };
  },
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;
  const denied = requirePermission(auth, 'episodes', 'edit');
  if (denied) return denied;

  const episode = await prisma.episode.findUnique({ where: { id } });
  if (!episode) return NextResponse.json({ error: 'Episode not found' }, { status: 404 });

  const { toStage, notes } = await req.json();
  if (!toStage || !STAGE_ORDER.includes(toStage)) {
    return NextResponse.json({ error: 'Invalid target stage' }, { status: 400 });
  }

  const currentIdx = STAGE_ORDER.indexOf(episode.currentStage);
  const targetIdx = STAGE_ORDER.indexOf(toStage);

  if (targetIdx !== currentIdx + 1) {
    return NextResponse.json({
      error: `Cannot transition from ${episode.currentStage} to ${toStage}. Next stage is ${STAGE_ORDER[currentIdx + 1]}`,
    }, { status: 409 });
  }

  const prereqCheck = PREREQUISITES[toStage];
  if (prereqCheck) {
    const result = await prereqCheck(id);
    if (!result.met) {
      return NextResponse.json({
        error: 'Prerequisites not met',
        reason: result.reason,
      }, { status: 409 });
    }
  }

  const [updated] = await Promise.all([
    prisma.episode.update({
      where: { id },
      data: { currentStage: toStage, status: 'in_progress' },
    }),
    prisma.pipelineStageHistory.create({
      data: {
        episodeId: id,
        fromStage: episode.currentStage,
        toStage,
        transitionedById: auth.user.userId,
        notes,
      },
    }),
  ]);

  await logAudit(auth.user.userId, 'stage_transition', 'episode', id, { stage: episode.currentStage }, { stage: toStage }, req);

  return NextResponse.json({ data: updated });
}
