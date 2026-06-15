'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import {
  EPISODES, TASKS, VENDORS, RISKS, SEASONS,
  getSeasonProgress, getUpcomingDeadlines, getTasksByStatus,
  getEpisodesBySeason, STAGE_LABELS, STATUS_COLORS, EpisodeStatus
} from '@/lib/data';

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

function EpisodePipeline({ ep }: { ep: typeof EPISODES[0] }) {
  const stageKeys = Object.keys(ep.stages) as (keyof typeof ep.stages)[];

  return (
    <div className="table-row">
      <div className="flex items-center gap-4 p-4">
        <div className="w-20 flex-shrink-0">
          <div className="text-sm font-semibold text-white">{ep.id}</div>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Ep {ep.number}</div>
        </div>
        <div className="w-40 flex-shrink-0">
          <div className="text-sm text-[#d4d4d8] truncate" title={ep.title}>{ep.title}</div>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{ep.vendor}</div>
        </div>
        <div className="flex-1 flex gap-1">
          {stageKeys.map((stage) => {
            const val = ep.stages[stage];
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
                  {STAGE_LABELS[stage].slice(0, 4)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-16 text-right">
          <span className="text-sm font-semibold" style={{ color: STATUS_COLORS[ep.status] }}>
            {ep.progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeSeason, setActiveSeason] = useState(1);
  const seasonEpisodes = getEpisodesBySeason(activeSeason);
  const seasonProgress = getSeasonProgress(activeSeason);
  const upcoming = getUpcomingDeadlines(14);
  const taskStats = getTasksByStatus();
  const criticalRisks = RISKS.filter(r => r.severity === 'critical' || r.severity === 'high');
  const activeVendorCount = VENDORS.filter(v => v.status === 'active').length;
  const totalProgress = getSeasonProgress();

  const seasonTargets: Record<number, string> = { 1: 'March 2027', 2: 'March 2028', 3: 'March 2029' };

  return (
    <>
      <Header title="Production Overview" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Overall Progress" value={`${totalProgress}%`} sub="23 episodes / 3 seasons" color="var(--accent)" />
          <StatCard label={`S${activeSeason} Progress`} value={`${seasonProgress}%`} sub={`${seasonEpisodes.length} episodes`} color="var(--info)" />
          <StatCard label="Active Tasks" value={taskStats.in_progress + taskStats.review} sub={`${taskStats.todo} queued`} color="var(--warning)" />
          <StatCard label="Active Vendors" value={`${activeVendorCount}/3`} sub="Studios assigned" color="var(--success)" />
          <StatCard label="Open Risks" value={RISKS.filter(r => r.status !== 'resolved').length} sub={`${criticalRisks.length} high/critical`} color="var(--danger)" />
        </div>

        {/* Season Tabs + Pipeline */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {SEASONS.map(s => (
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
                <EpisodePipeline key={ep.id} ep={ep} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
                <span className="text-sm font-semibold text-white">Upcoming Deadlines</span>
              </div>
              <div className="p-3 space-y-1 max-h-64 overflow-y-auto">
                {upcoming.map(event => (
                  <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1e1e26] transition-colors">
                    <div
                      className="w-1.5 h-8 rounded-full flex-shrink-0"
                      style={{
                        background: event.type === 'deadline' ? 'var(--warning)' :
                          event.type === 'recording' ? 'var(--accent)' :
                          event.type === 'delivery' ? 'var(--info)' :
                          event.type === 'review' ? 'var(--success)' : 'var(--danger)'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#d4d4d8] truncate">{event.title}</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {event.episode && ` · ${event.episode}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
                <span className="text-sm font-semibold text-white">Risk Alerts</span>
              </div>
              <div className="p-3 space-y-2">
                {criticalRisks.map(risk => (
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
                      <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{risk.episode}</span>
                    </div>
                    <div className="text-xs text-[#d4d4d8]">{risk.title}</div>
                    <div className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>{risk.owner} &middot; {risk.status}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
                <span className="text-sm font-semibold text-white">Vendor Status</span>
              </div>
              <div className="p-3 space-y-3">
                {VENDORS.map(v => (
                  <div key={v.id} className="p-3 rounded-lg hover:bg-[#1e1e26] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-white">{v.name}</div>
                        <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{v.country} &middot; {v.assignedEpisodes.length} episodes</div>
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
              <span style={{ color: 'var(--muted)' }}>To Do: <span className="text-white font-medium">{taskStats.todo}</span></span>
              <span style={{ color: 'var(--muted)' }}>In Progress: <span className="text-white font-medium">{taskStats.in_progress}</span></span>
              <span style={{ color: 'var(--muted)' }}>Review: <span className="text-white font-medium">{taskStats.review}</span></span>
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
                {TASKS.filter(t => t.status !== 'done').slice(0, 8).map(task => (
                  <tr key={task.id} className="table-row">
                    <td className="px-5 py-3">
                      <div className="text-[#d4d4d8]">{task.title}</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{task.id}</div>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'var(--muted)' }}>{task.episode}</td>
                    <td className="px-5 py-3 text-xs text-[#d4d4d8]">{task.assignee}</td>
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
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
