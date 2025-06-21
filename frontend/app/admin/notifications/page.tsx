'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '@/components/AdminNavbar';
import { Bell, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notifRes, countRes] = await Promise.all([
          axios.get('/notifications', { withCredentials: true }),
          axios.get('/notifications/unread-count', { withCredentials: true }),
        ]);

        setNotifications(notifRes.data);
        setUnreadCount(countRes.data.count);
      } catch {
        toast.error('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch {
      toast.error('Ошибка при отметке уведомления');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white pt-20 px-3 md:px-10 py-10">
        <AdminNavbar />
        <div className="max-w-3xl mx-auto mt-20 text-center text-cyan-200 text-xl font-bold">
          Загрузка уведомлений...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white pt-20 px-3 md:px-10 py-10">
      <AdminNavbar />

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8 mt-10">
          <Bell className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-200">
            Уведомления администратора
          </h1>
          <span className="ml-2 bg-cyan-400/10 border border-cyan-200/40 text-cyan-200 font-bold rounded-xl px-4 py-1 text-base">
            {unreadCount} непрочитанных
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="text-cyan-100/60 text-lg text-center mt-20">Нет уведомлений</div>
        ) : (
          <ul className="space-y-5">
            {notifications.map((n) => (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`rounded-2xl border p-5 shadow-xl flex flex-col gap-2 transition
                  ${n.isRead ? 'border-cyan-400/10 bg-white/5' : 'border-yellow-400/40 bg-yellow-100/10'}
                `}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {!n.isRead ? (
                      <Bell className="w-6 h-6 text-yellow-300 animate-bounce" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-cyan-300" />
                    )}
                    <span className={`font-semibold text-lg ${n.isRead ? 'text-cyan-100' : 'text-yellow-200'}`}>
                      {n.title}
                    </span>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-cyan-400 hover:text-cyan-300 text-sm font-bold border border-cyan-400/20 rounded-xl px-3 py-1 transition"
                    >
                      Отметить как прочитано
                    </button>
                  )}
                </div>
                <div className={`mt-1 ${n.isRead ? 'text-white/70' : 'text-yellow-100/90'} text-base`}>
                  {n.message}
                </div>
                <div className="text-xs text-cyan-100/60 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                  {n.type && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-200">
                      {n.type}
                    </span>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
