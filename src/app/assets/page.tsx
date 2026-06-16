'use client';
import Header from '@/components/Header';
import { useApi } from '@/hooks/useApi';

interface AssetData {
  id: string;
  name: string;
  type: string;
  category: string;
  version: string;
  status: string;
  fileSize: number;
  createdAt: string;
  episode: { id: string; productionCode: string } | null;
  character: { id: string; name: string } | null;
  uploadedBy: { id: string; name: string };
  approvedBy: { id: string; name: string } | null;
}

const TYPE_ICONS: Record<string, string> = {
  'script': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'storyboard': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  'animatic': 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  'audio': 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  'character_design': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  'animation': 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
  'reference': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  'model_sheet': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  'expression_sheet': 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export default function AssetsPage() {
  const { data: assetsResp, loading } = useApi<{ data: AssetData[] }>('/api/assets?limit=100');
  const assets = assetsResp?.data || [];

  const approved = assets.filter(a => a.status === 'approved').length;
  const pending = assets.filter(a => a.status === 'pending').length;
  const revision = assets.filter(a => a.status === 'revision').length;

  if (loading) {
    return (
      <>
        <Header title="Asset Management" />
        <div className="flex items-center justify-center h-64">
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading assets...</div>
        </div>
      </>
    );
  }

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
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{assets.length} files</span>
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
                {assets.map(asset => {
                  const icon = TYPE_ICONS[asset.type] || TYPE_ICONS['script'];
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
                            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{asset.category || asset.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: 'var(--muted)' }}>
                        {asset.episode?.productionCode || asset.character?.name || 'General'}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent)' }}>
                          {asset.version}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: 'var(--muted)' }}>
                        {new Date(asset.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-5 py-3 text-xs text-[#d4d4d8]">{asset.uploadedBy?.name}</td>
                      <td className="px-5 py-3 text-xs" style={{ color: 'var(--muted)' }}>{formatFileSize(asset.fileSize)}</td>
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
