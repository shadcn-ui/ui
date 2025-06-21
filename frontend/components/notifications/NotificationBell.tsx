'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationBell({ userId, role }: { userId: number; role: string }) {
  const [showList, setShowList] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications(userId, role);
  const bellRef = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне popup или по Escape
  useEffect(() => {
    if (!showList) return;

    const handleClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowList(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowList(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showList]);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setShowList((v) => !v)}
        className="relative text-cyan-100 hover:text-cyan-300 transition focus:outline-none"
        aria-label="Уведомления"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow animate-bounce z-20">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
            <span className="absolute top-0 right-0 w-3 h-3 bg-pink-400 rounded-full animate-ping z-10" />
          </>
        )}
      </button>

      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="absolute right-0 mt-3 w-80 max-w-xs bg-gradient-to-br from-[#182232] via-[#1a2537] to-[#1e293b] border border-cyan-300/20 shadow-2xl rounded-2xl z-50 max-h-96 overflow-auto backdrop-blur-lg"
          >
            <div className="p-4 text-base font-bold border-b border-cyan-200/10 text-cyan-200 bg-gradient-to-r from-cyan-700/20 via-transparent to-transparent rounded-t-2xl">
              Уведомления
            </div>
            {notifications.length === 0 ? (
              <div className="p-6 text-sm text-cyan-100/50 text-center select-none">Нет новых уведомлений</div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.url || '#'}
                  onClick={() => markAsRead(n.id)}
                  className={`
                    block px-4 py-3 transition rounded-xl text-sm mb-1
                    ${!n.isRead
                      ? 'bg-cyan-400/10 text-cyan-100 font-semibold shadow'
                      : 'text-white/70 hover:bg-cyan-400/5'
                    }
                    hover:scale-[1.01] hover:bg-cyan-400/20
                  `}
                >
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-white/60 text-xs">{n.message}</div>
                  <div className="text-cyan-100/40 text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </Link>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
