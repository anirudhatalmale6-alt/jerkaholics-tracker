'use client';
import Header from '@/components/Header';
import { EPISODES, VENDORS, TASKS, RISKS, getSeasonProgress, getTasksByStatus } from '@/lib/data';

function BarChart({ data, maxVal }: { data: { label: string; value: number; color: string }[]; maxVal: number }) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-[#a1a1aa]">{item.label}</span>
            <span className="text-xs font-medium text-white">{item.value}%</span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-bar-fill" style={{ width: `${(item.value / maxVal) * 100}%`, background: item.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const seasonProgress = getSeasonProgress();
  const taskStats = getTasksByStatus();
  const totalTasks = TASKS.length;

  const episodeData = EPISODES.map(ep => ({
    label: `${ep.id} - ${ep.title}`,
    value: ep.progress,
    color: ep.progress > 50 ? '#22c55e' : ep.progress > 20 ? '#f59e0b' : '#ef4444'
  }));

  const vendorData = VENDORS.map(v => ({
    label: v.name,
    quality: v.qualityScore,
    delivery: v.deliveryScore,
    episodes: v.assignedEpisodes.length,
    avgProgress: Math.round(
      EPISODES.filter(ep => v.assignedEpisodes.includes(ep.id))
        .reduce((sum, ep) => sum + ep.progress, 0) / v.assignedEpisodes.length
    )
  }));

  const departmentBreakdown = TASKS.reduce((acc, task) => {
    acc[task.department] = (acc[task.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <Header title="Executive Reports" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold gradient-accent bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>{seasonProgress}%</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Season Complete</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{EPISODES.length}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Total Episodes</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{totalTasks}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Total Tasks</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{VENDORS.length}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Active Vendors</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: RISKS.filter(r => r.status !== 'resolved').length > 2 ? 'var(--danger)' : 'var(--success)' }}>
              {RISKS.filter(r => r.status !== 'resolved').length}
            </div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Open Risks</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-5">Episode Completion</h3>
            <BarChart data={episodeData} maxVal={100} />
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-5">Task Distribution</h3>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(113,113,122,0.1)' }}>
                <div className="text-lg font-bold text-white">{taskStats.todo}</div>
                <div className="text-[10px]" style={{ color: 'var(--muted)' }}>To Do</div>
              </div>
              <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{taskStats.in_progress}</div>
                <div className="text-[10px]" style={{ color: 'var(--muted)' }}>In Progress</div>
              </div>
              <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
                <div className="text-lg font-bold" style={{ color: 'var(--success)' }}>{taskStats.review}</div>
                <div className="text-[10px]" style={{ color: 'var(--muted)' }}>In Review</div>
              </div>
              <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <div className="text-lg font-bold" style={{ color: 'var(--info)' }}>{taskStats.done}</div>
                <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Done</div>
              </div>
            </div>

            <div className="text-xs font-semibold text-white mb-3">By Department</div>
            <div className="space-y-2">
              {Object.entries(departmentBreakdown).sort((a, b) => b[1] - a[1]).map(([dept, count]) => (
                <div key={dept} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-[#a1a1aa]">{dept}</div>
                  <div className="flex-1">
                    <div className="progress-bar h-1.5">
                      <div className="progress-bar-fill" style={{ width: `${(count / totalTasks) * 100}%`, background: 'var(--accent)' }} />
                    </div>
                  </div>
                  <div className="w-6 text-right text-xs text-white">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-5">Vendor Performance Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)', borderBottom: '1px solid var(--card-border)' }}>
                  <th className="text-left px-4 py-3 font-medium">Studio</th>
                  <th className="text-center px-4 py-3 font-medium">Episodes</th>
                  <th className="text-center px-4 py-3 font-medium">Avg Progress</th>
                  <th className="text-center px-4 py-3 font-medium">Quality Score</th>
                  <th className="text-center px-4 py-3 font-medium">Delivery Score</th>
                  <th className="text-center px-4 py-3 font-medium">Overall</th>
                </tr>
              </thead>
              <tbody>
                {vendorData.map((v, i) => {
                  const overall = Math.round((v.quality + v.delivery) / 2);
                  return (
                    <tr key={i} className="table-row">
                      <td className="px-4 py-3 font-medium text-white">{v.label}</td>
                      <td className="px-4 py-3 text-center text-[#d4d4d8]">{v.episodes}</td>
                      <td className="px-4 py-3 text-center">
                        <span style={{ color: 'var(--accent)' }}>{v.avgProgress}%</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span style={{ color: v.quality >= 90 ? 'var(--success)' : 'var(--warning)' }}>{v.quality}%</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span style={{ color: v.delivery >= 90 ? 'var(--success)' : 'var(--warning)' }}>{v.delivery}%</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{
                            background: overall >= 90 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                            color: overall >= 90 ? 'var(--success)' : 'var(--warning)'
                          }}
                        >
                          {overall}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-5">Delivery Confidence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EPISODES.slice(0, 4).map(ep => {
              const daysUntilDelivery = Math.ceil((new Date(ep.deliveryDeadline).getTime() - new Date('2026-06-15').getTime()) / (1000 * 60 * 60 * 24));
              const confidence = Math.min(100, Math.round(ep.progress + (ep.progress / daysUntilDelivery) * 30));
              return (
                <div key={ep.id} className="p-4 rounded-lg" style={{ background: 'rgba(24,24,31,0.6)', border: '1px solid var(--card-border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">{ep.id}</span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: confidence >= 70 ? 'rgba(34,197,94,0.15)' : confidence >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                        color: confidence >= 70 ? 'var(--success)' : confidence >= 40 ? 'var(--warning)' : 'var(--danger)'
                      }}
                    >
                      {confidence >= 70 ? 'On Track' : confidence >= 40 ? 'At Risk' : 'Behind'}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white mb-1">{confidence}%</div>
                  <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                    {daysUntilDelivery} days to delivery
                  </div>
                  <div className="progress-bar h-1.5 mt-2">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${confidence}%`,
                        background: confidence >= 70 ? 'var(--success)' : confidence >= 40 ? 'var(--warning)' : 'var(--danger)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
