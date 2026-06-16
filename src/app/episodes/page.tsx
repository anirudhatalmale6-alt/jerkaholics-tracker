'use client';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { useApi } from '@/hooks/useApi';
import { STAGE_LABELS, STATUS_COLORS, EpisodeStatus } from '@/lib/data';

interface SeasonData {
  id: string;
  number: number;
  title: string;
  episodes: Array<{ id: string; productionCode: string; title: string; progress: number; currentStage: string; status: string }>;
  progress: number;
}

interface EpisodeDetail {
  id: string;
  productionCode: string;
  episodeNumber: number;
  title: string;
  synopsis: string;
  status: string;
  currentStage: string;
  progress: number;
  deliveryDeadline: string;
  airDate: string;
  scriptLocked: boolean;
  season: { number: number; title: string };
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    department: string;
    dueDate: string | null;
    assignedTo: { name: string } | null;
  }>;
  assets: Array<{ id: string; name: string; type: string; status: string; version: string }>;
  deliveries: Array<{ id: string; deliveryType: string; status: string; vendor: { name: string }; revisionNumber: number }>;
  risks: Array<{ id: string; title: string; severity: string; status: string }>;
  notes: Array<{ id: string; content: string; type: string; createdAt: string; author: { name: string } }>;
  vendorAssignments: Array<{ vendor: { name: string } }>;
  stageHistory: Array<{ id: string; fromStage: string; toStage: string; createdAt: string; transitionedBy: { name: string }; notes: string }>;
  stages: Array<{ stage: string; progress: number }>;
}

const STAGE_KEYS = ['writing', 'storyboard', 'animatic', 'voice', 'animation', 'cleanup', 'post', 'delivery'];

export default function EpisodesPage() {
  const [activeSeason, setActiveSeason] = useState(1);
  const [selectedEpId, setSelectedEpId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'pipeline' | 'tasks' | 'notes' | 'history'>('pipeline');

  const { data: seasonsResp, loading } = useApi<{ data: SeasonData[] }>('/api/seasons');
  const seasons = seasonsResp?.data || [];
  const currentSeason = seasons.find(s => s.number === activeSeason);
  const seasonEps = currentSeason?.episodes || [];

  const firstEpId = seasonEps[0]?.id;
  const activeEpId = selectedEpId || firstEpId;

  const { data: epDetailResp } = useApi<{ data: EpisodeDetail }>(
    activeEpId ? `/api/episodes/${activeEpId}` : null,
    [activeEpId]
  );
  const ep = epDetailResp?.data;

  const stageMap = useMemo(() => {
    if (!ep?.stages) return {} as Record<string, number>;
    const m: Record<string, number> = {};
    for (const s of ep.stages) m[s.stage] = s.progress;
    return m;
  }, [ep?.stages]);

  const handleSeasonChange = (s: number) => {
    setActiveSeason(s);
    setSelectedEpId(null);
    setDetailTab('pipeline');
  };

  const seasonNumbers = seasons.map(s => s.number).sort((a, b) => a - b);

  if (loading) {
    return (
      <>
        <Header title="Episode Tracker" />
        <div className="flex items-center justify-center h-64">
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading episodes...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Episode Tracker" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          {seasonNumbers.map(s => (
            <button
              key={s}
              onClick={() => handleSeasonChange(s)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
              style={{
                background: activeSeason === s ? 'rgba(139,92,246,0.2)' : 'rgba(24,24,31,0.5)',
                color: activeSeason === s ? '#8b5cf6' : 'var(--muted)',
                border: activeSeason === s ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--card-border)'
              }}
            >
              Season {s} ({seasons.find(ss => ss.number === s)?.episodes.length || 0} eps)
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {seasonEps.map(sepEp => (
            <button
              key={sepEp.id}
              onClick={() => { setSelectedEpId(sepEp.id); setDetailTab('pipeline'); }}
              className={`glass-card rounded-xl p-4 text-center transition-all cursor-pointer ${activeEpId === sepEp.id ? 'ring-2 ring-[#8b5cf6]' : 'hover:border-[#3f3f46]'}`}
            >
              <div className="text-lg font-bold text-white">{sepEp.productionCode.replace('JERK-', '')}</div>
              <div className="text-[10px] truncate" style={{ color: 'var(--muted)' }} title={sepEp.title}>{sepEp.title}</div>
              <div className="mt-2">
                <div className="progress-bar">
                  <div className="progress-bar-fill gradient-accent" style={{ width: `${sepEp.progress}%` }} />
                </div>
                <div className="text-[10px] mt-1" style={{ color: STATUS_COLORS[sepEp.currentStage as EpisodeStatus] || 'var(--accent)' }}>{sepEp.progress}%</div>
              </div>
            </button>
          ))}
        </div>

        {ep && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{ep.productionCode} &mdash; {ep.title}</h2>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Episode {ep.episodeNumber} &middot; Season {ep.season.number}</p>
                  </div>
                  <span
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background: `${STATUS_COLORS[ep.currentStage as EpisodeStatus] || 'var(--accent)'}20`, color: STATUS_COLORS[ep.currentStage as EpisodeStatus] || 'var(--accent)' }}
                  >
                    {ep.currentStage.charAt(0).toUpperCase() + ep.currentStage.slice(1)}
                  </span>
                </div>

                {ep.synopsis && (
                  <div className="p-3 rounded-lg mb-5" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>Synopsis</div>
                    <p className="text-sm text-[#d4d4d8]">{ep.synopsis}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Vendor</div>
                    <div className="text-sm text-white">{ep.vendorAssignments?.[0]?.vendor?.name || 'Unassigned'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Script Lock</div>
                    <div className="text-sm text-white">{ep.scriptLocked ? 'Locked' : 'Unlocked'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Delivery</div>
                    <div className="text-sm text-white">{new Date(ep.deliveryDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Air Date</div>
                    <div className="text-sm text-white">{ep.airDate ? new Date(ep.airDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}</div>
                  </div>
                </div>

                {/* Tab selector */}
                <div className="flex gap-2 mb-4 border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
                  {(['pipeline', 'tasks', 'notes', 'history'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                      style={{
                        background: detailTab === tab ? 'rgba(139,92,246,0.2)' : 'transparent',
                        color: detailTab === tab ? '#8b5cf6' : 'var(--muted)',
                      }}
                    >
                      {tab === 'pipeline' ? 'Pipeline' : tab === 'tasks' ? `Tasks (${ep.tasks.length})` : tab === 'notes' ? `Notes (${ep.notes.length})` : `History (${ep.stageHistory.length})`}
                    </button>
                  ))}
                </div>

                {detailTab === 'pipeline' && (
                  <div className="space-y-3">
                    {STAGE_KEYS.map((stage) => {
                      const val = stageMap[stage] || 0;
                      return (
                        <div key={stage} className="flex items-center gap-4">
                          <div className="w-24 text-xs text-[#a1a1aa]">{STAGE_LABELS[stage]}</div>
                          <div className="flex-1">
                            <div className="progress-bar h-2">
                              <div
                                className="progress-bar-fill"
                                style={{
                                  width: `${val}%`,
                                  background: val === 100 ? 'var(--success)' : val > 0 ? 'var(--accent)' : 'var(--card-border)'
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-12 text-right text-xs font-medium" style={{ color: val === 100 ? 'var(--success)' : val > 0 ? 'var(--accent)' : 'var(--muted)' }}>
                            {val}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {detailTab === 'tasks' && (
                  <div className="space-y-2">
                    {ep.tasks.length === 0 ? (
                      <div className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>No tasks for this episode</div>
                    ) : ep.tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(24,24,31,0.6)' }}>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[#d4d4d8]">{task.title}</div>
                          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                            {task.department} &middot; {task.assignedTo?.name || 'Unassigned'}
                            {task.dueDate && ` · Due ${new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: task.priority === 'critical' ? 'rgba(239,68,68,0.15)' : task.priority === 'high' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
                            color: task.priority === 'critical' ? 'var(--danger)' : task.priority === 'high' ? 'var(--warning)' : 'var(--info)'
                          }}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: task.status === 'done' ? 'rgba(34,197,94,0.15)' : task.status === 'in_progress' ? 'rgba(139,92,246,0.15)' : 'rgba(113,113,122,0.15)',
                            color: task.status === 'done' ? 'var(--success)' : task.status === 'in_progress' ? 'var(--accent)' : 'var(--muted)'
                          }}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {detailTab === 'notes' && (
                  <div className="space-y-3">
                    {ep.notes.length === 0 ? (
                      <div className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>No notes yet</div>
                    ) : ep.notes.map(note => (
                      <div key={note.id} className="p-3 rounded-lg" style={{ background: 'rgba(24,24,31,0.6)' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-white">{note.author.name}</span>
                          <span className="text-[10px]" style={{ color: 'var(--muted)' }}>
                            {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-[#d4d4d8]">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {detailTab === 'history' && (
                  <div className="space-y-2">
                    {ep.stageHistory.length === 0 ? (
                      <div className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>No stage transitions yet</div>
                    ) : ep.stageHistory.map(h => (
                      <div key={h.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(24,24,31,0.6)' }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[#d4d4d8]">
                            {h.fromStage ? `${STAGE_LABELS[h.fromStage] || h.fromStage} → ` : ''}{STAGE_LABELS[h.toStage] || h.toStage}
                          </div>
                          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                            {h.transitionedBy.name} &middot; {new Date(h.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {h.notes && <div className="text-[10px] mt-1 text-[#a1a1aa]">{h.notes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Production Flow */}
              <div className="glass-card rounded-xl p-6">
                <div className="text-xs font-semibold text-white mb-4">Production Flow</div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {STAGE_KEYS.map((stage, i) => {
                    const val = stageMap[stage] || 0;
                    const isActive = val > 0 && val < 100;
                    const isDone = val === 100;
                    return (
                      <div key={stage} className="flex items-center gap-2 flex-shrink-0">
                        <div
                          className={`pipeline-stage text-center min-w-[80px] ${isActive ? 'pulse-glow' : ''}`}
                          style={{
                            background: isDone ? 'rgba(34,197,94,0.15)' : isActive ? 'rgba(139,92,246,0.15)' : 'rgba(39,39,42,0.5)',
                            border: `1px solid ${isDone ? 'rgba(34,197,94,0.3)' : isActive ? 'rgba(139,92,246,0.3)' : 'var(--card-border)'}`
                          }}
                        >
                          <div className="text-[10px] font-medium" style={{ color: isDone ? 'var(--success)' : isActive ? 'var(--accent)' : 'var(--muted)' }}>
                            {STAGE_LABELS[stage]}
                          </div>
                          <div className="text-lg font-bold mt-1" style={{ color: isDone ? 'var(--success)' : isActive ? 'var(--accent)' : 'var(--muted)' }}>
                            {val}%
                          </div>
                        </div>
                        {i < STAGE_KEYS.length - 1 && (
                          <svg className="w-4 h-4 flex-shrink-0" style={{ color: isDone ? 'var(--success)' : 'var(--card-border)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card rounded-xl p-5">
                <div className="text-xs font-semibold text-white mb-4">Key Dates</div>
                <div className="space-y-3">
                  {[
                    { label: 'Delivery Deadline', date: ep.deliveryDeadline, done: ep.progress === 100 },
                    { label: 'Air Date', date: ep.airDate, done: false },
                  ].filter(item => item.date).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: item.done ? 'rgba(34,197,94,0.2)' : 'rgba(39,39,42,0.5)',
                          border: `1px solid ${item.done ? 'rgba(34,197,94,0.4)' : 'var(--card-border)'}`
                        }}
                      >
                        {item.done && (
                          <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#d4d4d8]">{item.label}</div>
                        <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                          {new Date(item.date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-xl p-5">
                <div className="text-xs font-semibold text-white mb-4">Overall Progress</div>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--card-border)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke="url(#progressGrad)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${ep.progress * 2.64} ${264 - ep.progress * 2.64}`}
                      />
                      <defs>
                        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{ep.progress}%</span>
                      <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Complete</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risks for this episode */}
              {ep.risks.length > 0 && (
                <div className="glass-card rounded-xl p-5">
                  <div className="text-xs font-semibold text-white mb-3">Active Risks</div>
                  <div className="space-y-2">
                    {ep.risks.map(risk => (
                      <div key={risk.id} className="p-2 rounded-lg" style={{ background: risk.severity === 'critical' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)' }}>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded"
                            style={{
                              background: risk.severity === 'critical' ? 'rgba(239,68,68,0.2)' : risk.severity === 'high' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)',
                              color: risk.severity === 'critical' ? 'var(--danger)' : risk.severity === 'high' ? 'var(--warning)' : 'var(--info)'
                            }}>
                            {risk.severity}
                          </span>
                        </div>
                        <div className="text-xs text-[#d4d4d8] mt-1">{risk.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="glass-card rounded-xl p-5">
                <div className="text-xs font-semibold text-white mb-3">Season {activeSeason} Episodes</div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {seasonEps.map(sepEp => (
                    <button
                      key={sepEp.id}
                      onClick={() => { setSelectedEpId(sepEp.id); setDetailTab('pipeline'); }}
                      className="w-full text-left p-2 rounded-lg transition-colors cursor-pointer"
                      style={{
                        background: activeEpId === sepEp.id ? 'rgba(139,92,246,0.1)' : 'transparent',
                        border: activeEpId === sepEp.id ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-medium text-white">{sepEp.productionCode}</span>
                          <span className="text-xs text-[#a1a1aa] ml-2">{sepEp.title}</span>
                        </div>
                        <span className="text-[10px] font-medium" style={{ color: STATUS_COLORS[sepEp.currentStage as EpisodeStatus] || 'var(--accent)' }}>{sepEp.progress}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
