'use client';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { useApi } from '@/hooks/useApi';
import { STAGE_LABELS, STATUS_COLORS, EpisodeStatus } from '@/lib/data';

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="glass-card rounded-xl p-5 animate-slide-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{sub}</div>}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading production data...</div>
    </div>
  );
}

interface SeasonData {
  id: string;
  number: number;
  title: string;
  episodes: Array<{
    id: string;
    productionCode: string;
    title: string;
    progress: number;
    currentStage: string;
    status: string;
  }>;
  progress: number;
  _count: { episodes: number; risks: number };
}

interface DashboardData {
  data: {
    seasonProgress: Array<{
      number: number;
      title: string;
      episodeCount: number;
      progress: number;
      stageBreakdown: Record<string, number>;
    }>;
    totalEpisodes: number;
    totalTasks: number;
    overdueTasks: number;
    activeRisks: number;
    criticalRisks: number;
    tasksByStatus: Record<string, number>;
    upcomingDeadlines: Array<{
      productionCode: string;
      title: string;
      deliveryDeadline: string;
      progress: number;
    }>;
    recentActivity: Array<{
      id: string;
      action: string;
      resourceType: string;
      resourceId: string;
      createdAt: string;
      user: { name: string };
    }>;
  };
}

interface EpisodeData {
  id: string;
  productionCode: string;
  episodeNumber: number;
  title: string;
  progress: number;
  currentStage: string;
  status: string;
  vendorAssignments: Array<{ vendor: { name: string } }>;
  stages?: Array<{ stage: string; progress: number }>;
}

interface RiskData {
  id: string;
  title: string;
  severity: string;
  status: string;
  category: string;
  episode?: { productionCode: string };
  owner: { name: string };
}

interface VendorData {
  id: string;
  name: string;
  country: string;
  status: string;
  qualityScore: number;
  deliveryScore: number;
  assignments: Array<{ episode: { id: string; productionCode: string } }>;
}

interface TaskData {
  id: string;
  title: string;
  status: string;
  priority: string;
  department: string;
  dueDate: string | null;
  episode: { productionCode: string };
  assignedTo: { name: string } | null;
}

function EpisodePipeline({ ep, stageData }: { ep: EpisodeData; stageData: Record<string, number> }) {
  const stageKeys = ['writing', 'storyboard', 'animatic', 'voice', 'animation', 'cleanup', 'post', 'delivery'];

  return (
    <div className="table-row">
      <div className="flex items-center gap-4 p-4">
        <div className="w-20 flex-shrink-0">
          <div className="text-sm font-semibold text-white">{ep.productionCode}</div>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Ep {ep.episodeNumber}</div>
        </div>
        <div className="w-40 flex-shrink-0">
          <div className="text-sm text-[#d4d4d8] truncate" title={ep.title}>{ep.title}</div>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{ep.vendorAssignments?.[0]?.vendor?.name || 'Unassigned'}</div>
        </div>
        <div className="flex-1 flex gap-1">
          {stageKeys.map((stage) => {
            const val = stageData[stage] || 0;
            return (
              <div key={stage} className="flex-1 min-w-0" title={`${STAGE_LABELS[stage]}: ${val}%`}>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${val}%`,
                      background: val === 100 ? 'var(--success)' : val > 0 ? 'var(--accent)' : 'transparent'
                    }}
                  />
                </div>
                <div className="text-[9px] text-center mt-1" style={{ color: 'var(--muted)' }}>
                  {STAGE_LABELS[stage]?.slice(0, 4)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-16 text-right">
          <span className="text-sm font-semibold" style={{ color: STATUS_COLORS[ep.currentStage as EpisodeStatus] || 'var(--accent)' }}>
            {ep.progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeSeason, setActiveSeason] = useState(1);

  const { data: dashData, loading: dashLoading } = useApi<DashboardData>('/api/reports/dashboard');
  const { data: seasonsResp } = useApi<{ data: SeasonData[] }>('/api/seasons');
  const { data: episodesResp } = useApi<{ data: EpisodeData[] }>(`/api/episodes?limit=100`);
  const { data: risksResp } = useApi<{ data: RiskData[] }>('/api/risks?limit=20');
  const { data: vendorsResp } = useApi<{ data: VendorData[] }>('/api/vendors');
  const { data: tasksResp } = useApi<{ data: TaskData[] }>('/api/tasks?limit=50');

  const seasons = seasonsResp?.data || [];
  const allEpisodes = episodesResp?.data || [];
  const risks = risksResp?.data || [];
  const vendors = vendorsResp?.data || [];
  const tasks = tasksResp?.data || [];
  const dashboard = dashData?.data;

  const seasonEpisodes = useMemo(() =>
    allEpisodes.filter(ep => {
      const season = seasons.find(s => s.id === (ep as any).seasonId);
      return season?.number === activeSeason;
    }),
    [allEpisodes, seasons, activeSeason]
  );

  const stageDataMap = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    for (const ep of allEpisodes) {
      if (ep.stages) {
        map[ep.id] = {};
        for (const s of ep.stages) {
          map[ep.id][s.stage] = s.progress;
        }
      }
    }
    return map;
  }, [allEpisodes]);

  const seasonProgress = dashboard?.seasonProgress?.find(s => s.number === activeSeason)?.progress || 0;
  const totalProgress = dashboard?.seasonProgress
    ? Math.round(dashboard.seasonProgress.reduce((s, p) => s + p.progress, 0) / dashboard.seasonProgress.length)
    : 0;
  const totalEpisodes = dashboard?.totalEpisodes || allEpisodes.length;
  const tasksByStatus = dashboard?.tasksByStatus || {};
  const activeTasks = (tasksByStatus['in_progress'] || 0) + (tasksByStatus['review'] || 0);
  const queuedTasks = tasksByStatus['todo'] || 0;
  const activeVendorCount = vendors.filter(v => v.status === 'active').length;
  const openRisks = risks.filter(r => r.status !== 'resolved').length;
  const criticalRisks = risks.filter(r => r.severity === 'critical' || r.severity === 'high');
  const upcomingDeadlines = dashboard?.upcomingDeadlines || [];

  const seasonNumbers = seasons.map(s => s.number).sort((a, b) => a - b);
  const seasonTargets: Record<number, string> = { 1: 'March 2027', 2: 'March 2028', 3: 'March 2029' };

  if (dashLoading) {
    return (
      <>
        <Header title="Production Overview" />
        <LoadingState />
      </>
    );
  }

  return (
    <>
      <Header title="Production Overview" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Overall Progress" value={`${totalProgress}%`} sub={`${totalEpisodes} episodes / ${seasons.length} seasons`} color="var(--accent)" />
          <StatCard label={`S${activeSeason} Progress`} value={`${seasonProgress}%`} sub={`${seasonEpisodes.length} episodes`} color="var(--info)" />
          <StatCard label="Active Tasks" value={activeTasks} sub={`${queuedTasks} queued`} color="var(--warning)" />
          <StatCard label="Active Vendors" value={`${activeVendorCount}/${vendors.length}`} sub="Studios assigned" color="var(--success)" />
          <StatCard label="Open Risks" value={openRisks} sub={`${criticalRisks.length} high/critical`} color="var(--danger)" />
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {seasonNumbers.map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSeason(s)}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: activeSeason === s ? 'rgba(139,92,246,0.2)' : 'transparent',
                    color: activeSeason === s ? '#8b5cf6' : 'var(--muted)',
                    border: activeSeason === s ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent'
                  }}
                >
                  Season {s}
                </button>
              ))}
            </div>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Target: {seasonTargets[activeSeason]}</span>
          </div>
          <div className="flex gap-3 mb-4 text-[10px] flex-wrap" style={{ color: 'var(--muted)' }}>
            {Object.entries(STAGE_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[key as EpisodeStatus] || 'var(--accent)' }} />
                {label}
              </div>
            ))}
          </div>
          <div className="progress-bar h-3 rounded-md">
            <div className="progress-bar-fill rounded-md gradient-accent" style={{ width: `${seasonProgress}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-[10px]" style={{ color: 'var(--muted)' }}>
            <span>Development</span>
            <span>Pre-Production</span>
            <span>Production</span>
            <span>Post</span>
            <span>Delivery</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 glass-card rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--card-border)' }}>
              <span className="text-sm font-semibold text-white">Season {activeSeason} Episode Pipeline</span>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent)' }}>
                {seasonEpisodes.length} episodes
              </span>
            </div>
            <div>
              {seasonEpisodes.map(ep => (
                <EpisodePipeline key={ep.id} ep={ep} stageData={stageDataMap[ep.id] || {}} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
                <span className="text-sm font-semibold text-white">Upcoming Deadlines</span>
              </div>
              <div className="p-3 space-y-1 max-h-64 overflow-y-auto">
                {upcomingDeadlines.map((dl, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1e1e26] transition-colors">
                    <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: 'var(--warning)' }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#d4d4d8] truncate">{dl.productionCode} - {dl.title}</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                        {new Date(dl.deliveryDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' · '}{dl.progress}% complete
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingDeadlines.length === 0 && (
                  <div className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>No upcoming deadlines</div>
                )}
              </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
                <span className="text-sm font-semibold text-white">Risk Alerts</span>
              </div>
              <div className="p-3 space-y-2">
                {criticalRisks.slice(0, 5).map(risk => (
                  <div key={risk.id} className="p-3 rounded-lg" style={{ background: risk.severity === 'critical' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          background: risk.severity === 'critical' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                          color: risk.severity === 'critical' ? 'var(--danger)' : 'var(--warning)'
                        }}
                      >
                        {risk.severity}
                      </span>
                      <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{risk.episode?.productionCode || 'ALL'}</span>
                    </div>
                    <div className="text-xs text-[#d4d4d8]">{risk.title}</div>
                    <div className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>{risk.owner?.name} &middot; {risk.status}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
                <span className="text-sm font-semibold text-white">Vendor Status</span>
              </div>
              <div className="p-3 space-y-3">
                {vendors.map(v => (
                  <div key={v.id} className="p-3 rounded-lg hover:bg-[#1e1e26] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-white">{v.name}</div>
                        <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{v.country} &middot; {v.assignments?.length || 0} episodes</div>
                      </div>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: v.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                          color: v.status === 'active' ? 'var(--success)' : 'var(--warning)'
                        }}
                      >
                        {v.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Quality: </span>
                        <span className="text-[#d4d4d8] font-medium">{v.qualityScore}%</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Delivery: </span>
                        <span className="text-[#d4d4d8] font-medium">{v.deliveryScore}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--card-border)' }}>
            <span className="text-sm font-semibold text-white">Active Tasks</span>
            <div className="flex gap-4 text-[10px]">
              <span style={{ color: 'var(--muted)' }}>To Do: <span className="text-white font-medium">{tasksByStatus['todo'] || 0}</span></span>
              <span style={{ color: 'var(--muted)' }}>In Progress: <span className="text-white font-medium">{tasksByStatus['in_progress'] || 0}</span></span>
              <span style={{ color: 'var(--muted)' }}>Review: <span className="text-white font-medium">{tasksByStatus['review'] || 0}</span></span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)', borderBottom: '1px solid var(--card-border)' }}>
                  <th className="text-left px-5 py-3 font-medium">Task</th>
                  <th className="text-left px-5 py-3 font-medium">Episode</th>
                  <th className="text-left px-5 py-3 font-medium">Assignee</th>
                  <th className="text-left px-5 py-3 font-medium">Priority</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Due</th>
                </tr>
              </thead>
              <tbody>
                {tasks.filter(t => t.status !== 'done').slice(0, 8).map(task => (
                  <tr key={task.id} className="table-row">
                    <td className="px-5 py-3">
                      <div className="text-[#d4d4d8]">{task.title}</div>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'var(--muted)' }}>{task.episode?.productionCode}</td>
                    <td className="px-5 py-3 text-xs text-[#d4d4d8]">{task.assignedTo?.name || 'Unassigned'}</td>
                    <td className="px-5 py-3">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: task.priority === 'critical' ? 'rgba(239,68,68,0.15)' :
                            task.priority === 'high' ? 'rgba(245,158,11,0.15)' :
                            task.priority === 'medium' ? 'rgba(59,130,246,0.15)' : 'rgba(113,113,122,0.15)',
                          color: task.priority === 'critical' ? 'var(--danger)' :
                            task.priority === 'high' ? 'var(--warning)' :
                            task.priority === 'medium' ? 'var(--info)' : 'var(--muted)'
                        }}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: task.status === 'in_progress' ? 'rgba(139,92,246,0.15)' :
                            task.status === 'review' ? 'rgba(34,197,94,0.15)' : 'rgba(113,113,122,0.15)',
                          color: task.status === 'in_progress' ? 'var(--accent)' :
                            task.status === 'review' ? 'var(--success)' : 'var(--muted)'
                        }}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'var(--muted)' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
