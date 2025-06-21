'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import AdminNavbar from '@/components/AdminNavbar';
import toast from 'react-hot-toast';

export default function AdminNewsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const role = decoded.role?.toUpperCase();
      if (role !== 'ADMIN' && role !== 'SUPERUSER') {
        router.push('/dashboard');
      }
    } catch {
      toast.error('Ошибка токена');
      router.push('/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white pt-20 px-3 md:px-10 py-10">
      <AdminNavbar />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-200 mb-4 mt-10">📰 Новости и рассылки</h1>
        <p className="text-cyan-100/70 mb-8 text-lg">
          Публикация новостей в Telegram-канал, управление лентой и архивами.<br />
          Возможна интеграция с ботом.
        </p>
        <div className="rounded-2xl border border-cyan-400/10 bg-white/5 shadow-xl p-8 text-center">
          <p className="text-cyan-100/60 italic text-lg">
            🔧 Скоро здесь появится редактор новостей и управление рассылками...
          </p>
        </div>
      </div>
    </div>
  );
}
