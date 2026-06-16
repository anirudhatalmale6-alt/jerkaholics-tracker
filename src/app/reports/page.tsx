'use client';
import Header from '@/components/Header';
import { useApi } from '@/hooks/useApi';

interface DashboardData {
  data: {
    seasonProgress: Array<{ number: number; title: string; episodeCount: number; progress: number }>;
    totalEpisodes: number;
    totalTasks: number;
    overdueTasks: number;
    activeRisks: number;
    criticalRisks: number;
    tasksByStatus: Record<string, number>;
  };
}

interface ProductionStatus {
  data: Array<{
    id: string;
    productionCode: string;
    title: string;
    season: number;
    stage: string;
    progress: number;
    vendor: string;
    deadline: string;
    daysRemaining: number;
    confidenceScore: number;
    blockingItems: string[];
    totalTasks: number;
    completedTasks: number;
    activeRisks: number;
  }>;
}

interface VendorPerf {
  data: Array<{
    id: string;
    name: string;
    country: string;
    qualityScore: number;
    deliveryScore: number;
    overall: number;
    episodesAssigned: number;
    avgEpisodeProgress: number;
    totalDeliveries: number;
    approvedDeliveries: number;
    rejectedDeliveries: number;
    approvalRate: number;
  }>;
}

interface TaskData {
  data: Array<{
    id: string;
    department: string;
    status: string;
  }>;
}

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
  const { data: dashData, loading } = useApi<DashboardData>('/api/reports/dashboard');
  const { data: prodStatus } = useApi<ProductionStatus>('/api/reports/production-status');
  const { data: vendorPerf } = useApi<VendorPerf>('/api/reports/vendor-performance');
  const { data: tasksResp } = useApi<TaskData>('/api/tasks?limit=200');

  const dashboard = dashData?.data;
  const episodes = prodStatus?.data || [];
  const vendors = vendorPerf?.data || [];
  const tasks = tasksResp?.data || [];

  const totalProgress = dashboard?.seasonProgress
    ? Math.round(dashboard.seasonProgress.reduce((s, p) => s + p.progress, 0) / dashboard.seasonProgress.length)
    : 0;
  const tasksByStatus = dashboard?.tasksByStatus || {};
  const totalTasks = dashboard?.totalTasks || tasks.length;
  const totalEpisodes = dashboard?.totalEpisodes || episodes.length;
  const openRisks = dashboard?.activeRisks || 0;

  const episodeData = episodes.map(ep => ({
    label: `${ep.productionCode} - ${ep.title}`,
    value: ep.progress,
    color: ep.progress > 50 ? '#22c55e' : ep.progress > 20 ? '#f59e0b' : '#ef4444'
  }));

  const departmentBreakdown = tasks.reduce((acc, task) => {
    const dept = (task as any).department || 'Other';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <>
        <Header title="Executive Reports" />
        <div className="flex items-center justify-center h-64">
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading reports...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Executive Reports" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold gradient-accent bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>{totalProgress}%</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Overall Progress</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{totalEpisodes}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Total Episodes</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{totalTasks}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Total Tasks</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{vendors.length}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Active Vendors</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: openRisks > 2 ? 'var(--danger)' : 'var(--success)' }}>
              {openRisks}
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
                <div className="text-lg font-bold text-white">{tasksByStatus['todo'] || 0}</div>
                <div className="text-[10px]" style={{ color: 'var(--muted)' }}>To Do</div>
              </div>
              <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{tasksByStatus['in_progress'] || 0}</div>
                <div className="text-[10px]" style={{ color: 'var(--muted)' }}>In Progress</div>
              </div>
              <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
                <div className="text-lg font-bold" style={{ color: 'var(--success)' }}>{tasksByStatus['review'] || 0}</div>
                <div className="text-[10px]" style={{ color: 'var(--muted)' }}>In Review</div>
              </div>
              <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <div className="text-lg font-bold" style={{ color: 'var(--info)' }}>{tasksByStatus['done'] || 0}</div>
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
                {vendors.map(v => (
                  <tr key={v.id} className="table-row">
                    <td className="px-4 py-3 font-medium text-white">{v.name}</td>
                    <td className="px-4 py-3 text-center text-[#d4d4d8]">{v.episodesAssigned}</td>
                    <td className="px-4 py-3 text-center">
                      <span style={{ color: 'var(--accent)' }}>{v.avgEpisodeProgress}%</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span style={{ color: v.qualityScore >= 90 ? 'var(--success)' : 'var(--warning)' }}>{v.qualityScore}%</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span style={{ color: v.deliveryScore >= 90 ? 'var(--success)' : 'var(--warning)' }}>{v.deliveryScore}%</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{
                          background: v.overall >= 90 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                          color: v.overall >= 90 ? 'var(--success)' : 'var(--warning)'
                        }}
                      >
                        {v.overall}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-5">Production Health &amp; Delivery Confidence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {episodes.slice(0, 8).map(ep => (
              <div key={ep.id} className="p-4 rounded-lg" style={{ background: 'rgba(24,24,31,0.6)', border: '1px solid var(--card-border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white">{ep.productionCode}</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: ep.confidenceScore >= 70 ? 'rgba(34,197,94,0.15)' : ep.confidenceScore >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                      color: ep.confidenceScore >= 70 ? 'var(--success)' : ep.confidenceScore >= 40 ? 'var(--warning)' : 'var(--danger)'
                    }}
                  >
                    {ep.confidenceScore >= 70 ? 'On Track' : ep.confidenceScore >= 40 ? 'At Risk' : 'Behind'}
                  </span>
                </div>
                <div className="text-lg font-bold text-white mb-1">{ep.confidenceScore}%</div>
                <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                  {ep.daysRemaining > 0 ? `${ep.daysRemaining} days to delivery` : `${Math.abs(ep.daysRemaining)} days overdue`}
                </div>
                {ep.blockingItems.length > 0 && (
                  <div className="text-[10px] mt-1" style={{ color: 'var(--danger)' }}>
                    {ep.blockingItems[0]}
                  </div>
                )}
                <div className="progress-bar h-1.5 mt-2">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${ep.confidenceScore}%`,
                      background: ep.confidenceScore >= 70 ? 'var(--success)' : ep.confidenceScore >= 40 ? 'var(--warning)' : 'var(--danger)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
