'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { UserCircle, LogOut } from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface NavbarProps {
  user: any;
  currentPage: 'profile' | 'news' | 'instructions' | 'requests' | 'dashboard';
}

const apiBase = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar({ user, currentPage }: NavbarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      toast.error('Ошибка при выходе');
    } finally {
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const links = [
    { href: '/news', label: 'Новости', key: 'news' },
    { href: '/guides', label: 'Инструкции', key: 'instructions' },
    { href: '/dashboard/requests', label: 'Заявки', key: 'requests' },
    { href: '/dashboard', label: 'Главная', key: 'dashboard' },
  ];

  return (
    <nav className="max-w-6xl mx-auto my-3 px-3 md:px-6">
      <div className="backdrop-blur-2xl bg-gradient-to-r from-[#101828]/85 to-[#17253a]/80 border-b border-cyan-400/10 shadow-xl px-4 md:px-8 py-3 rounded-2xl flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-5">
          {links.map((link) => (
            <button
              key={link.key}
              onClick={() => router.push(link.href)}
              className={`px-4 py-1 rounded-full transition-all text-sm font-semibold
                ${
                  currentPage === link.key
                    ? 'bg-cyan-400/90 text-gray-900 shadow-md pointer-events-none'
                    : 'text-cyan-100 hover:bg-cyan-400/15 hover:text-white/90'
                }`}
              disabled={currentPage === link.key}
              style={{ opacity: currentPage === link.key ? 0.92 : 1 }}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          {user && (
            <button
              onClick={() => router.push('/dashboard/profile')}
              title="Профиль"
              className="flex items-center gap-2 text-cyan-100 hover:text-cyan-300 transition px-2 py-1 rounded-full"
            >
              <UserCircle className="w-5 h-5" />
              <span className="hidden md:inline text-base font-medium">
                {user.lastName} {user.firstName}
              </span>
            </button>
          )}

          {user && (
            <NotificationBell userId={user.id} role={user.role} />
          )}

          <button
            onClick={handleLogout}
            disabled={loading}
            aria-label="Выход"
            className="flex items-center gap-2 text-cyan-100 hover:text-pink-400 transition px-2 py-1 rounded-full font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">{loading ? 'Выход...' : 'Выйти'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
