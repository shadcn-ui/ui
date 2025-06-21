'use client';

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

export type Notification = {
  id: string;
  title: string;
  message: string;
  url?: string;
  createdAt: string;
  isRead: boolean;
};

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, 'ws') ?? '';

export function useNotifications(userId: number, role: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ Тип через ReturnType<typeof io>
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await fetch(`/api/notifications`);
        const data: Notification[] = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } catch {
        toast.error('Ошибка при загрузке уведомлений');
      }
    };

    fetchInitial();

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    if (userId) {
      socket.emit('subscribe-user', userId);
    } else if (role) {
      socket.emit('subscribe-role', role);
    }

    socket.on('notification', (newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('notification');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, role]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch {
      toast.error('Ошибка при отметке уведомления как прочитанного');
    }
  };

  return { notifications, unreadCount, markAsRead };
}
