'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { CHARACTERS, ASSET_TYPE_LABELS } from '@/lib/characters';

export default function CharactersPage() {
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
  const mainCast = CHARACTERS.filter(c => c.type === 'main');
  const recurring = CHARACTERS.filter(c => c.type === 'recurring');

  return (
    <>
      <Header title="Characters" />
      <div className="p-6 space-y-6">
        {/* Character Grid */}
        <div>
          <div className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>Main Cast</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {mainCast.map(char => (
              <button
                key={char.id}
                onClick={() => setSelectedChar(char)}
                className={`glass-card rounded-xl p-5 text-left transition-all cursor-pointer ${selectedChar.id === char.id ? 'ring-2 ring-[#8b5cf6]' : 'hover:border-[#3f3f46]'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full gradient-accent flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {char.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-white">{char.name}</div>
                    <div className="text-xs" style={{ color: 'var(--accent)' }}>{char.voiceActor}</div>
                    <div className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>
                      {char.roles.length > 1 ? `${char.roles.length} roles` : char.roles[0]}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>Recurring</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {recurring.map(char => (
              <button
                key={char.id}
                onClick={() => setSelectedChar(char)}
                className={`glass-card rounded-xl p-3 text-left transition-all cursor-pointer ${selectedChar.id === char.id ? 'ring-2 ring-[#8b5cf6]' : 'hover:border-[#3f3f46]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: 'rgba(139,92,246,0.2)' }}>
                    {char.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white truncate">{char.name}</div>
                    <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{char.voiceActor}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Character Detail */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-5 mb-5">
                <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                  {selectedChar.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-white">{selectedChar.name}</h2>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase"
                      style={{
                        background: selectedChar.type === 'main' ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.15)',
                        color: selectedChar.type === 'main' ? 'var(--accent)' : 'var(--info)'
                      }}
                    >
                      {selectedChar.type}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--accent)' }}>Voiced by {selectedChar.voiceActor}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>First appearance: {selectedChar.firstAppearance}</div>
                </div>
              </div>

              <p className="text-sm text-[#d4d4d8] mb-5 leading-relaxed">{selectedChar.description}</p>

              <div className="flex flex-wrap gap-2 mb-5">
                {selectedChar.traits.map(trait => (
                  <span key={trait} className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    {trait}
                  </span>
                ))}
              </div>

              {selectedChar.roles.length > 1 && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
                    Voice Roles ({selectedChar.roles.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedChar.roles.map(role => (
                      <span key={role} className="text-xs px-3 py-1.5 rounded-lg text-[#d4d4d8]" style={{ background: 'rgba(24,24,31,0.8)', border: '1px solid var(--card-border)' }}>
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Character Assets */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--card-border)' }}>
                <span className="text-sm font-semibold text-white">Character Assets</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{selectedChar.assets.length} files</span>
              </div>
              {selectedChar.assets.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-sm" style={{ color: 'var(--muted)' }}>No assets uploaded yet</div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>Character assets will appear here once uploaded</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)', borderBottom: '1px solid var(--card-border)' }}>
                        <th className="text-left px-5 py-3 font-medium">Asset</th>
                        <th className="text-left px-5 py-3 font-medium">Type</th>
                        <th className="text-left px-5 py-3 font-medium">Version</th>
                        <th className="text-left px-5 py-3 font-medium">Uploaded</th>
                        <th className="text-left px-5 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedChar.assets.map(asset => (
                        <tr key={asset.id} className="table-row">
                          <td className="px-5 py-3">
                            <div className="text-xs text-[#d4d4d8]">{asset.name}</div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent)' }}>
                              {ASSET_TYPE_LABELS[asset.type] || asset.type}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-xs" style={{ color: 'var(--accent)' }}>{asset.version}</td>
                          <td className="px-5 py-3 text-xs" style={{ color: 'var(--muted)' }}>
                            {new Date(asset.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Metadata */}
            <div className="glass-card rounded-xl p-5">
              <div className="text-xs font-semibold text-white mb-4">Character Metadata</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--card-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Character ID</span>
                  <span className="text-xs font-mono text-white">{selectedChar.id}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--card-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Type</span>
                  <span className="text-xs text-white capitalize">{selectedChar.type}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--card-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Voice Actor</span>
                  <span className="text-xs text-white">{selectedChar.voiceActor}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--card-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Debut</span>
                  <span className="text-xs text-white">{selectedChar.firstAppearance}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--card-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Voice Roles</span>
                  <span className="text-xs text-white">{selectedChar.roles.length}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Assets</span>
                  <span className="text-xs text-white">{selectedChar.assets.length} files</span>
                </div>
              </div>
            </div>

            {/* Asset Summary */}
            <div className="glass-card rounded-xl p-5">
              <div className="text-xs font-semibold text-white mb-4">Asset Status</div>
              {selectedChar.assets.length === 0 ? (
                <div className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>No assets yet</div>
              ) : (
                <div className="space-y-3">
                  {['reference', 'model_sheet', 'expression_sheet', 'turnaround', 'color_key'].map(type => {
                    const asset = selectedChar.assets.find(a => a.type === type);
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: asset ? (asset.status === 'approved' ? 'rgba(34,197,94,0.2)' : asset.status === 'pending' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)') : 'rgba(39,39,42,0.5)',
                            border: `1px solid ${asset ? (asset.status === 'approved' ? 'rgba(34,197,94,0.4)' : asset.status === 'pending' ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)') : 'var(--card-border)'}`
                          }}
                        >
                          {asset?.status === 'approved' && (
                            <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-[#d4d4d8]">{ASSET_TYPE_LABELS[type]}</div>
                          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                            {asset ? `${asset.version} - ${asset.status}` : 'Not uploaded'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Voice Cast Summary */}
            <div className="glass-card rounded-xl p-5">
              <div className="text-xs font-semibold text-white mb-4">Full Voice Cast</div>
              <div className="space-y-2">
                {CHARACTERS.filter(c => c.voiceActor !== 'TBD').map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1e1e26] transition-colors">
                    <div className="text-xs text-white">{c.voiceActor}</div>
                    <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                      {c.roles.length === 1 ? c.name : `${c.roles.length} roles`}
                    </div>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--card-border)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--muted)' }}>
                    {CHARACTERS.filter(c => c.voiceActor === 'TBD').length} characters awaiting casting
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
