'use client';
import { useMemo } from 'react';
import Header from '@/components/Header';
import { useApi } from '@/hooks/useApi';

interface EpisodeData {
  id: string;
  productionCode: string;
  title: string;
  deliveryDeadline: string;
  airDate: string | null;
  progress: number;
  currentStage: string;
}

interface TaskData {
  id: string;
  title: string;
  dueDate: string | null;
  status: string;
  episode: { productionCode: string };
  assignedTo: { name: string } | null;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'deadline' | 'delivery' | 'airdate' | 'task';
  episode?: string;
  assignee?: string;
}

const TYPE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  deadline: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', dot: '#f59e0b' },
  delivery: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', dot: '#3b82f6' },
  airdate: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', dot: '#ef4444' },
  task: { bg: 'rgba(139,92,246,0.1)', text: '#8b5cf6', dot: '#8b5cf6' },
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const { data: episodesResp, loading } = useApi<{ data: EpisodeData[] }>('/api/episodes?limit=100');
  const { data: tasksResp } = useApi<{ data: TaskData[] }>('/api/tasks?limit=100');

  const episodes = episodesResp?.data || [];
  const tasks = tasksResp?.data || [];

  const events: CalendarEvent[] = useMemo(() => {
    const evts: CalendarEvent[] = [];
    for (const ep of episodes) {
      evts.push({
        id: `del-${ep.id}`,
        title: `Delivery - ${ep.productionCode}`,
        date: ep.deliveryDeadline,
        type: 'delivery',
        episode: ep.productionCode,
      });
      if (ep.airDate) {
        evts.push({
          id: `air-${ep.id}`,
          title: `Air Date - ${ep.productionCode}`,
          date: ep.airDate,
          type: 'airdate',
          episode: ep.productionCode,
        });
      }
    }
    for (const task of tasks) {
      if (task.dueDate && task.status !== 'done') {
        evts.push({
          id: `task-${task.id}`,
          title: task.title,
          date: task.dueDate,
          type: 'task',
          episode: task.episode?.productionCode,
          assignee: task.assignedTo?.name || undefined,
        });
      }
    }
    return evts;
  }, [episodes, tasks]);

  const year = 2026;
  const month = 5;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = 16;

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const eventsByDay: Record<number, CalendarEvent[]> = {};
  events.forEach(e => {
    const d = new Date(e.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(e);
    }
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date('2026-06-16'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 15);

  if (loading) {
    return (
      <>
        <Header title="Production Calendar" />
        <div className="flex items-center justify-center h-64">
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading calendar...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Production Calendar" />
      <div className="p-6 space-y-6">
        <div className="flex gap-3 flex-wrap">
          {Object.entries(TYPE_COLORS).map(([type, colors]) => (
            <div key={type} className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--muted)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors.dot }} />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 glass-card rounded-xl p-5">
            <div className="text-center mb-5">
              <h2 className="text-lg font-semibold text-white">{monthName}</h2>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(d => (
                <div key={d} className="text-center text-[10px] uppercase tracking-wider py-2" style={{ color: 'var(--muted)' }}>
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const dayEvents = eventsByDay[day] || [];
                const isToday = day === today;

                return (
                  <div
                    key={day}
                    className="min-h-[90px] rounded-lg p-2 transition-colors"
                    style={{
                      background: isToday ? 'rgba(139,92,246,0.1)' : 'rgba(24,24,31,0.5)',
                      border: isToday ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent'
                    }}
                  >
                    <div className={`text-xs font-medium mb-1 ${isToday ? 'text-[#8b5cf6]' : 'text-[#a1a1aa]'}`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map(e => {
                        const colors = TYPE_COLORS[e.type];
                        return (
                          <div
                            key={e.id}
                            className="text-[9px] px-1.5 py-0.5 rounded truncate"
                            style={{ background: colors.bg, color: colors.text }}
                            title={e.title}
                          >
                            {e.title.length > 18 ? e.title.slice(0, 18) + '...' : e.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] px-1.5" style={{ color: 'var(--muted)' }}>
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
              <span className="text-sm font-semibold text-white">Upcoming Events</span>
            </div>
            <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
              {upcomingEvents.map(event => {
                const colors = TYPE_COLORS[event.type];
                return (
                  <div key={event.id} className="p-3 rounded-lg" style={{ background: colors.bg }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: colors.dot }} />
                      <span className="text-[10px] uppercase font-medium" style={{ color: colors.text }}>
                        {event.type}
                      </span>
                    </div>
                    <div className="text-xs text-[#d4d4d8]">{event.title}</div>
                    <div className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {event.episode && ` · ${event.episode}`}
                    </div>
                  </div>
                );
              })}
              {upcomingEvents.length === 0 && (
                <div className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>No upcoming events</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
