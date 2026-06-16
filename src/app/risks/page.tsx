'use client';
import Header from '@/components/Header';
import { useApi } from '@/hooks/useApi';

interface RiskData {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  category: string;
  mitigationPlan: string | null;
  createdAt: string;
  episode: { productionCode: string; title: string } | null;
  owner: { name: string };
}

const SEVERITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: 'rgba(239,68,68,0.08)', text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  high: { bg: 'rgba(245,158,11,0.08)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  medium: { bg: 'rgba(59,130,246,0.08)', text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  low: { bg: 'rgba(113,113,122,0.08)', text: '#71717a', border: 'rgba(113,113,122,0.3)' },
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  identified: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
  open: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
  mitigating: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
  resolved: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
};

export default function RisksPage() {
  const { data: risksResp, loading } = useApi<{ data: RiskData[] }>('/api/risks?limit=50');
  const risks = risksResp?.data || [];

  const severityCounts = {
    critical: risks.filter(r => r.severity === 'critical').length,
    high: risks.filter(r => r.severity === 'high').length,
    medium: risks.filter(r => r.severity === 'medium').length,
    low: risks.filter(r => r.severity === 'low').length,
  };

  const openCount = risks.filter(r => r.status === 'identified' || r.status === 'open').length;
  const mitigatingCount = risks.filter(r => r.status === 'mitigating').length;
  const resolvedCount = risks.filter(r => r.status === 'resolved').length;

  if (loading) {
    return (
      <>
        <Header title="Risk Dashboard" />
        <div className="flex items-center justify-center h-64">
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading risks...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Risk Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--danger)' }} />
              <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Critical</span>
            </div>
            <div className="text-2xl font-bold text-white">{severityCounts.critical}</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--warning)' }} />
              <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>High</span>
            </div>
            <div className="text-2xl font-bold text-white">{severityCounts.high}</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--info)' }} />
              <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Medium</span>
            </div>
            <div className="text-2xl font-bold text-white">{severityCounts.medium}</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--muted)' }} />
              <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Low</span>
            </div>
            <div className="text-2xl font-bold text-white">{severityCounts.low}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4 text-center" style={{ borderLeft: '3px solid var(--danger)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--danger)' }}>{openCount}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Open</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center" style={{ borderLeft: '3px solid var(--warning)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--warning)' }}>{mitigatingCount}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Mitigating</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center" style={{ borderLeft: '3px solid var(--success)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--success)' }}>{resolvedCount}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Resolved</div>
          </div>
        </div>

        <div className="space-y-4">
          {risks
            .sort((a, b) => {
              const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
              return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
            })
            .map(risk => {
              const sevColors = SEVERITY_COLORS[risk.severity] || SEVERITY_COLORS.low;
              const statColors = STATUS_STYLES[risk.status] || STATUS_STYLES.open;
              return (
                <div
                  key={risk.id}
                  className="glass-card rounded-xl p-5"
                  style={{ borderLeft: `3px solid ${sevColors.text}` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded"
                        style={{ background: sevColors.bg, color: sevColors.text }}
                      >
                        {risk.severity}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: statColors.bg, color: statColors.text }}
                      >
                        {risk.status}
                      </span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{risk.episode?.productionCode || 'ALL'}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-white mb-2">{risk.title}</h3>
                  <p className="text-xs text-[#a1a1aa] mb-3">{risk.description}</p>

                  {risk.mitigationPlan && (
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(15,15,19,0.5)' }}>
                      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Mitigation Plan</div>
                      <p className="text-xs text-[#d4d4d8]">{risk.mitigationPlan}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-[10px]" style={{ color: 'var(--muted)' }}>
                    <span>Owner: <span className="text-[#d4d4d8]">{risk.owner?.name}</span></span>
                    <span>Category: <span className="text-[#d4d4d8]">{risk.category}</span></span>
                    <span>Created: <span className="text-[#d4d4d8]">{new Date(risk.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
