'use client';
import Header from '@/components/Header';
import { VENDORS, EPISODES } from '@/lib/data';

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
  return (
    <>
      <Header title="Animation Vendors" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VENDORS.map(vendor => {
            const vendorEps = EPISODES.filter(ep => vendor.assignedEpisodes.includes(ep.id));
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
                        background: vendor.status === 'active' ? 'rgba(34,197,94,0.15)' : vendor.status === 'overdue' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                        color: vendor.status === 'active' ? 'var(--success)' : vendor.status === 'overdue' ? 'var(--danger)' : 'var(--warning)'
                      }}
                    >
                      {vendor.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(24,24,31,0.6)' }}>
                      <div className="text-xl font-bold text-white">{vendor.activeTasks}</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Active Tasks</div>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(24,24,31,0.6)' }}>
                      <div className="text-xl font-bold text-white">{vendor.completedTasks}</div>
                      <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Completed</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <ScoreBar label="Quality Score" score={vendor.qualityScore} color="var(--accent)" />
                    <ScoreBar label="Delivery Score" score={vendor.deliveryScore} color="var(--info)" />
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Assigned Episodes</div>
                    <div className="space-y-2">
                      {vendorEps.map(ep => (
                        <div key={ep.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(24,24,31,0.6)' }}>
                          <div className="flex-1">
                            <div className="text-xs text-white">{ep.id} &mdash; {ep.title}</div>
                            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                              {ep.status.charAt(0).toUpperCase() + ep.status.slice(1)}
                            </div>
                          </div>
                          <div className="text-xs font-medium" style={{ color: 'var(--accent)' }}>{ep.progress}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--card-border)', background: 'rgba(15,15,19,0.5)' }}>
                  <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Next Delivery</span>
                  <span className="text-xs text-white font-medium">
                    {new Date(vendor.nextDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
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
                  <th className="text-center px-4 py-3 font-medium">Active</th>
                  <th className="text-center px-4 py-3 font-medium">Done</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {VENDORS.map(v => (
                  <tr key={v.id} className="table-row">
                    <td className="px-4 py-3 font-medium text-white">{v.name}</td>
                    <td className="px-4 py-3 text-[#a1a1aa]">{v.country}</td>
                    <td className="px-4 py-3 text-center text-[#d4d4d8]">{v.assignedEpisodes.length}</td>
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
                    <td className="px-4 py-3 text-center text-[#d4d4d8]">{v.activeTasks}</td>
                    <td className="px-4 py-3 text-center text-[#d4d4d8]">{v.completedTasks}</td>
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
