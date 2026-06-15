'use client';
import { useState } from 'react';
import { NOTIFICATIONS } from '@/lib/data';

export default function Header({ title }: { title: string }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b" style={{ borderColor: 'var(--card-border)', background: 'var(--background)' }}>
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>3 Seasons &middot; 23 Episodes &middot; Adult Swim</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg transition-colors hover:bg-[#1e1e26]"
          >
            <svg className="w-5 h-5" style={{ color: 'var(--muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 top-12 w-80 rounded-xl shadow-2xl z-50 border overflow-hidden"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
                <span className="text-sm font-semibold text-white">Notifications</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {NOTIFICATIONS.map(n => (
                  <div
                    key={n.id}
                    className="px-4 py-3 border-b flex gap-3 items-start"
                    style={{
                      borderColor: 'var(--card-border)',
                      background: n.read ? 'transparent' : 'rgba(139, 92, 246, 0.05)'
                    }}
                  >
                    <div
                      className="status-dot mt-1.5 flex-shrink-0"
                      style={{
                        background: n.type === 'error' ? 'var(--danger)' :
                          n.type === 'warning' ? 'var(--warning)' :
                          n.type === 'success' ? 'var(--success)' : 'var(--info)'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#d4d4d8]">{n.message}</p>
                      <p className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pl-4 border-l" style={{ borderColor: 'var(--card-border)' }}>
          <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold">
            EP
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-white">Exec Producer</div>
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
