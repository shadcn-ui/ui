'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import LogoutButton from '@/components/LogoutButton';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SuperAdminPanel() {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== 'superuser') {
        const roleRedirect: Record<string, string> = {
          admin: '/admin',
          user: '/dashboard',
        };
        router.push(roleRedirect[decoded.role] || '/login');
      }
    } catch {
      toast.error('Ошибка токена');
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] px-3 py-10">
      <div className="flex flex-col items-center gap-4 max-w-lg w-full">
        <span className="bg-gradient-to-tr from-cyan-400 to-teal-200 rounded-full p-4 shadow-xl mb-1">
          <ShieldCheck className="w-12 h-12 text-white drop-shadow" />
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-200 text-center mb-2">
          🚨 Панель супер-администратора
        </h1>
        <div className="text-base text-cyan-100/80 mb-2 text-center">
          Вы вошли как <span className="text-cyan-400 font-bold">супер-админ</span>
        </div>
        {/* Здесь можно добавить ссылки или карточки управления */}
        <div className="w-full flex flex-col items-center mt-4 mb-6">
          <div className="bg-white/10 border border-cyan-400/10 rounded-2xl shadow p-6 w-full text-center text-cyan-100/90">
            Добро пожаловать в корпоративную панель управления.<br />
            <span className="text-cyan-200/90">Здесь появятся возможности управления пользователями, правами и настройками организации.</span>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
