'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { EPISODES, SEASONS, getEpisodesBySeason, STAGE_LABELS, STATUS_COLORS } from '@/lib/data';

export default function EpisodesPage() {
  const [activeSeason, setActiveSeason] = useState(1);
  const seasonEps = getEpisodesBySeason(activeSeason);
  const [selectedEp, setSelectedEp] = useState(seasonEps[0]);

  const handleSeasonChange = (s: number) => {
    setActiveSeason(s);
    const eps = getEpisodesBySeason(s);
    setSelectedEp(eps[0]);
  };

  const stageKeys = Object.keys(selectedEp.stages) as (keyof typeof selectedEp.stages)[];

  return (
    <>
      <Header title="Episode Tracker" />
      <div className="p-6 space-y-6">
        {/* Season Tabs */}
        <div className="flex items-center gap-2">
          {SEASONS.map(s => (
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
              Season {s} ({getEpisodesBySeason(s).length} eps)
            </button>
          ))}
        </div>

        {/* Episode Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {seasonEps.map(ep => (
            <button
              key={ep.id}
              onClick={() => setSelectedEp(ep)}
              className={`glass-card rounded-xl p-4 text-center transition-all cursor-pointer ${selectedEp.id === ep.id ? 'ring-2 ring-[#8b5cf6]' : 'hover:border-[#3f3f46]'}`}
            >
              <div className="text-lg font-bold text-white">{ep.number}</div>
              <div className="text-[10px] truncate" style={{ color: 'var(--muted)' }} title={ep.title}>{ep.title}</div>
              <div className="mt-2">
                <div className="progress-bar">
                  <div className="progress-bar-fill gradient-accent" style={{ width: `${ep.progress}%` }} />
                </div>
                <div className="text-[10px] mt-1" style={{ color: STATUS_COLORS[ep.status] }}>{ep.progress}%</div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Episode Detail */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedEp.id} &mdash; {selectedEp.title}</h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Episode {selectedEp.number} &middot; Season {selectedEp.season}</p>
                </div>
                <span
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: `${STATUS_COLORS[selectedEp.status]}20`, color: STATUS_COLORS[selectedEp.status] }}
                >
                  {selectedEp.status.charAt(0).toUpperCase() + selectedEp.status.slice(1)}
                </span>
              </div>

              {/* Synopsis */}
              <div className="p-3 rounded-lg mb-5" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>Synopsis</div>
                <p className="text-sm text-[#d4d4d8]">{selectedEp.synopsis}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Writer</div>
                  <div className="text-sm text-white">{selectedEp.writer}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Director</div>
                  <div className="text-sm text-white">{selectedEp.director}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Vendor</div>
                  <div className="text-sm text-white">{selectedEp.vendor}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Air Date</div>
                  <div className="text-sm text-white">{new Date(selectedEp.airDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-white mb-3">Production Pipeline</div>
                {stageKeys.map((stage) => {
                  const val = selectedEp.stages[stage];
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
            </div>

            {/* Production Flow */}
            <div className="glass-card rounded-xl p-6">
              <div className="text-xs font-semibold text-white mb-4">Production Flow</div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {stageKeys.map((stage, i) => {
                  const val = selectedEp.stages[stage];
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
                      {i < stageKeys.length - 1 && (
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

          {/* Right Column */}
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-5">
              <div className="text-xs font-semibold text-white mb-4">Key Dates</div>
              <div className="space-y-3">
                {[
                  { label: 'Script Deadline', date: selectedEp.scriptDeadline, done: selectedEp.stages.writing === 100 },
                  { label: 'Board Deadline', date: selectedEp.boardDeadline, done: selectedEp.stages.storyboard === 100 },
                  { label: 'Animation Deadline', date: selectedEp.animationDeadline, done: selectedEp.stages.animation === 100 },
                  { label: 'Delivery Deadline', date: selectedEp.deliveryDeadline, done: selectedEp.stages.delivery === 100 },
                  { label: 'Air Date', date: selectedEp.airDate, done: false },
                ].map((item, i) => (
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
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                      strokeDasharray={`${selectedEp.progress * 2.64} ${264 - selectedEp.progress * 2.64}`}
                    />
                    <defs>
                      <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{selectedEp.progress}%</span>
                    <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Season Episode List */}
            <div className="glass-card rounded-xl p-5">
              <div className="text-xs font-semibold text-white mb-3">Season {activeSeason} Episodes</div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {seasonEps.map(ep => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEp(ep)}
                    className="w-full text-left p-2 rounded-lg transition-colors cursor-pointer"
                    style={{
                      background: selectedEp.id === ep.id ? 'rgba(139,92,246,0.1)' : 'transparent',
                      border: selectedEp.id === ep.id ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-white">{ep.id}</span>
                        <span className="text-xs text-[#a1a1aa] ml-2">{ep.title}</span>
                      </div>
                      <span className="text-[10px] font-medium" style={{ color: STATUS_COLORS[ep.status] }}>{ep.progress}%</span>
                    </div>
                    <div className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{ep.synopsis}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
