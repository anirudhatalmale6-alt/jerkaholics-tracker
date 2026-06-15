'use client';
import Header from '@/components/Header';

interface Asset {
  id: string;
  name: string;
  type: string;
  episode: string;
  version: string;
  uploadDate: string;
  uploadedBy: string;
  status: 'approved' | 'pending' | 'revision';
  size: string;
}

const ASSETS: Asset[] = [
  { id: 'A-001', name: 'Main Character Model Sheet - Final', type: 'Character Design', episode: 'ALL', version: 'v3.2', uploadDate: '2026-06-12', uploadedBy: 'Art Dept', status: 'approved', size: '24 MB' },
  { id: 'A-002', name: 'Episode 101 - Script (Final Draft)', type: 'Script', episode: 'JERK-101', version: 'v5.0', uploadDate: '2026-05-28', uploadedBy: 'Jake Morrison', status: 'approved', size: '890 KB' },
  { id: 'A-003', name: 'Episode 101 - Storyboard Package', type: 'Storyboard', episode: 'JERK-101', version: 'v2.1', uploadDate: '2026-06-10', uploadedBy: 'Board Team', status: 'approved', size: '156 MB' },
  { id: 'A-004', name: 'Episode 101 - Animatic', type: 'Animatic', episode: 'JERK-101', version: 'v1.4', uploadDate: '2026-06-08', uploadedBy: 'Board Team', status: 'approved', size: '420 MB' },
  { id: 'A-005', name: 'Episode 101 - Voice Session 1', type: 'Voice Recording', episode: 'JERK-101', version: 'v1.0', uploadDate: '2026-06-14', uploadedBy: 'Audio Team', status: 'pending', size: '380 MB' },
  { id: 'A-006', name: 'Episode 102 - Script (2nd Draft)', type: 'Script', episode: 'JERK-102', version: 'v2.0', uploadDate: '2026-06-05', uploadedBy: 'Maya Rodriguez', status: 'revision', size: '720 KB' },
  { id: 'A-007', name: 'Episode 102 - Storyboard Act 1', type: 'Storyboard', episode: 'JERK-102', version: 'v1.3', uploadDate: '2026-06-13', uploadedBy: 'Board Team', status: 'pending', size: '89 MB' },
  { id: 'A-008', name: 'Background Style Guide', type: 'Style Guide', episode: 'ALL', version: 'v1.1', uploadDate: '2026-06-01', uploadedBy: 'Art Dept', status: 'approved', size: '45 MB' },
  { id: 'A-009', name: 'Color Script - Season Palette', type: 'Color Script', episode: 'ALL', version: 'v2.0', uploadDate: '2026-06-07', uploadedBy: 'Art Dept', status: 'pending', size: '18 MB' },
  { id: 'A-010', name: 'Animation Package - Ep 101 Layout', type: 'Animation', episode: 'JERK-101', version: 'v1.0', uploadDate: '2026-06-14', uploadedBy: 'Studio Yotta', status: 'pending', size: '1.2 GB' },
  { id: 'A-011', name: 'Episode 103 - Script Outline', type: 'Script', episode: 'JERK-103', version: 'v1.0', uploadDate: '2026-06-11', uploadedBy: 'Jake Morrison', status: 'revision', size: '340 KB' },
  { id: 'A-012', name: 'FX Library - Distortion Set 1', type: 'FX', episode: 'ALL', version: 'v0.5', uploadDate: '2026-06-09', uploadedBy: 'FX Team', status: 'pending', size: '67 MB' },
];

const TYPE_ICONS: Record<string, string> = {
  'Script': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'Storyboard': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  'Animatic': 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  'Voice Recording': 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  'Character Design': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  'Animation': 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
  'Style Guide': 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  'Color Script': 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  'FX': 'M13 10V3L4 14h7v7l9-11h-7z',
};

export default function AssetsPage() {
  const approved = ASSETS.filter(a => a.status === 'approved').length;
  const pending = ASSETS.filter(a => a.status === 'pending').length;
  const revision = ASSETS.filter(a => a.status === 'revision').length;

  return (
    <>
      <Header title="Asset Management" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{approved}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Approved</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>{pending}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Pending Review</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--danger)' }}>{revision}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--muted)' }}>Needs Revision</div>
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--card-border)' }}>
            <span className="text-sm font-semibold text-white">All Assets</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{ASSETS.length} files</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)', borderBottom: '1px solid var(--card-border)' }}>
                  <th className="text-left px-5 py-3 font-medium">Asset</th>
                  <th className="text-left px-5 py-3 font-medium">Episode</th>
                  <th className="text-left px-5 py-3 font-medium">Version</th>
                  <th className="text-left px-5 py-3 font-medium">Uploaded</th>
                  <th className="text-left px-5 py-3 font-medium">By</th>
                  <th className="text-left px-5 py-3 font-medium">Size</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ASSETS.map(asset => {
                  const icon = TYPE_ICONS[asset.type] || TYPE_ICONS['Script'];
                  return (
                    <tr key={asset.id} className="table-row">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.1)' }}>
                            <svg className="w-4 h-4" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                            </svg>
                          </div>
                          <div>
                            <div className="text-[#d4d4d8] text-xs">{asset.name}</div>
                            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{asset.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: 'var(--muted)' }}>{asset.episode}</td>
                      <td className="px-5 py-3">
                        <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent)' }}>
                          {asset.version}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: 'var(--muted)' }}>
                        {new Date(asset.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-5 py-3 text-xs text-[#d4d4d8]">{asset.uploadedBy}</td>
                      <td className="px-5 py-3 text-xs" style={{ color: 'var(--muted)' }}>{asset.size}</td>
                      <td className="px-5 py-3">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: asset.status === 'approved' ? 'rgba(34,197,94,0.15)' :
                              asset.status === 'revision' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                            color: asset.status === 'approved' ? 'var(--success)' :
                              asset.status === 'revision' ? 'var(--danger)' : 'var(--warning)'
                          }}
                        >
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
