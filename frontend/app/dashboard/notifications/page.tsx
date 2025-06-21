'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { NotificationList } from '@/components/notifications/NotificationList';
import { jwtDecode } from 'jwt-decode';

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!token) return router.push('/login');
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded?.sub) return router.push('/login');
    } catch {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return router.push('/login');
        const data = await res.json();
        setUser(data);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#12161f] to-[#182439] text-white flex justify-center items-center">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white pb-10">
      <Navbar user={user} currentPage="dashboard" />
      <NotificationList userId={user.id} role={user.role} />
    </div>
  );
}
