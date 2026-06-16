'use client';
import Header from '@/components/Header';
import { useApi } from '@/hooks/useApi';

interface VendorData {
  id: string;
  name: string;
  country: string;
  status: string;
  qualityScore: number;
  deliveryScore: number;
  contactName: string;
  contactEmail: string;
  specialization: string;
  assignments: Array<{
    id: string;
    status: string;
    dueDate: string | null;
    episode: { id: string; productionCode: string; title: string; progress: number };
  }>;
  _count: { deliveries: number; users: number };
}

interface VendorPerf {
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
  revisionRate: number;
  status: string;
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{label}</span>
        <span className="text-xs font-medium" style={{ color }}>{score}%</span>
      </div>
      <div className="progress-bar h-1.5">
        <div className="progress-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

export default function VendorsPage() {
  const { data: vendorsResp, loading } = useApi<{ data: VendorData[] }>('/api/vendors');
  const { data: perfResp } = useApi<{ data: VendorPerf[] }>('/api/reports/vendor-performance');

  const vendors = vendorsResp?.data || [];
  const perfData = perfResp?.data || [];

  if (loading) {
    return (
      <>
        <Header title="Animation Vendors" />
        <div className="flex items-center justify-center h-64">
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading vendor data...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Animation Vendors" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendors.map(vendor => {
            const perf = perfData.find(p => p.id === vendor.id);
            return (
              <div key={vendor.id} className="glass-card rounded-xl overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{vendor.name}</h3>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{vendor.country}</p>
                    </div>
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                      style={{
                        background: vendor.status === 'active' ? 'rgba(34,197,94,0.15)' : vendor.status === 'suspended' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                        color: vendor.status === 'active' ? 'var(--success)' : vendor.status === 'suspended' ? 'var(--danger)' : 'var(--warning)'
                      }}
                    >
                      {vendor.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(24,24,31,0.6)' }}>
                      <div className="text-xl font-bold text-white">{vendor.assignments.length}</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Episodes</div>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(24,24,31,0.6)' }}>
                      <div className="text-xl font-bold text-white">{vendor._count.deliveries}</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Deliveries</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <ScoreBar label="Quality Score" score={vendor.qualityScore} color="var(--accent)" />
                    <ScoreBar label="Delivery Score" score={vendor.deliveryScore} color="var(--info)" />
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Assigned Episodes</div>
                    <div className="space-y-2">
                      {vendor.assignments.map(a => (
                        <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(24,24,31,0.6)' }}>
                          <div className="flex-1">
                            <div className="text-xs text-white">{a.episode.productionCode} &mdash; {a.episode.title}</div>
                            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                              {a.status}
                              {a.dueDate && ` · Due ${new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                            </div>
                          </div>
                          <div className="text-xs font-medium" style={{ color: 'var(--accent)' }}>{a.episode.progress}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--card-border)', background: 'rgba(15,15,19,0.5)' }}>
                  <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Approval Rate</span>
                  <span className="text-xs text-white font-medium">{perf?.approvalRate || 0}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Vendor Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)', borderBottom: '1px solid var(--card-border)' }}>
                  <th className="text-left px-4 py-3 font-medium">Studio</th>
                  <th className="text-left px-4 py-3 font-medium">Country</th>
                  <th className="text-center px-4 py-3 font-medium">Episodes</th>
                  <th className="text-center px-4 py-3 font-medium">Quality</th>
                  <th className="text-center px-4 py-3 font-medium">Delivery</th>
                  <th className="text-center px-4 py-3 font-medium">Avg Progress</th>
                  <th className="text-center px-4 py-3 font-medium">Approval</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {perfData.map(v => (
                  <tr key={v.id} className="table-row">
                    <td className="px-4 py-3 font-medium text-white">{v.name}</td>
                    <td className="px-4 py-3 text-[#a1a1aa]">{v.country}</td>
                    <td className="px-4 py-3 text-center text-[#d4d4d8]">{v.episodesAssigned}</td>
                    <td className="px-4 py-3 text-center">
                      <span style={{ color: v.qualityScore >= 90 ? 'var(--success)' : v.qualityScore >= 80 ? 'var(--warning)' : 'var(--danger)' }}>
                        {v.qualityScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span style={{ color: v.deliveryScore >= 90 ? 'var(--success)' : v.deliveryScore >= 80 ? 'var(--warning)' : 'var(--danger)' }}>
                        {v.deliveryScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span style={{ color: 'var(--accent)' }}>{v.avgEpisodeProgress}%</span>
                    </td>
                    <td className="px-4 py-3 text-center text-[#d4d4d8]">{v.approvalRate}%</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: v.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                          color: v.status === 'active' ? 'var(--success)' : 'var(--warning)'
                        }}
                      >
                        {v.status}
                      </span>
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
