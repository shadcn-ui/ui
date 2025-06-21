'use client';

import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell } from 'lucide-react';

export function NotificationList({ userId, role }: { userId: number; role: string }) {
  const { notifications, markAsRead } = useNotifications(userId, role);

  return (
    <div className="max-w-2xl mx-auto mt-12 px-2 sm:px-6 py-8 bg-gradient-to-br from-[#13151e]/95 via-[#182232]/95 to-[#212e43]/95
      backdrop-blur-xl border border-cyan-400/10 shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-cyan-200 drop-shadow">
        <Bell className="w-7 h-7 text-cyan-400" />
        Уведомления
      </h2>
      {notifications.length === 0 ? (
        <p className="text-cyan-100/60 py-14 text-center select-none text-lg">Пока нет уведомлений</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`
                transition-all rounded-2xl
                ${!n.isRead
                  ? 'bg-cyan-400/10 border-l-4 border-cyan-400/40 shadow-md'
                  : 'bg-white/5 border-l-4 border-transparent'
                }
                hover:scale-[1.01] hover:shadow-xl
              `}
            >
              <Link
                href={n.url || '#'}
                onClick={() => markAsRead(n.id)}
                className="block px-6 py-4 rounded-2xl hover:bg-cyan-400/10 transition-all"
              >
                <div className="font-semibold text-base text-cyan-100">{n.title}</div>
                <div className="text-sm text-cyan-100/80 mt-1">{n.message}</div>
                <div className="text-xs text-cyan-100/50 mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
