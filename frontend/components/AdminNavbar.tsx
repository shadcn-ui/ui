'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Bell as BellIcon,
  UserCircle2,
  LogOut,
  Users,
  ServerCrash,
  TerminalSquare,
  List,
  FileText,
  Newspaper,
  Activity,
  type LucideIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const apiBase = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: 'Пользователи', href: '/admin/users', icon: Users },
  { label: 'Оборудование', href: '/admin/equipment', icon: ServerCrash },
  { label: 'ПО', href: '/admin/software', icon: TerminalSquare },
  { label: 'Заявки', href: '/admin/requests', icon: FileText },
  { label: 'Уведомления', href: '/admin/notifications', icon: BellIcon },
  { label: 'Новости', href: '/admin/news', icon: Newspaper },
  { label: 'Мониторинг', href: '/admin/monitoring', icon: Activity },
  { label: 'Логи', href: '/admin/logs', icon: List },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiBase}/users/profile`, {
          headers: getHeaders(),
        });
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (!res.ok) {
          setAdminName('Неизвестный');
          return;
        }
        const data = await res.json();
        setAdminName(`${data.lastName} ${data.firstName}`);
      } catch (error) {
        setAdminName('Неизвестный');
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${apiBase}/notifications/unread-count`, {
          headers: getHeaders(),
        });
        if (!res.ok) return;
        const data = await res.json();
        setUnreadCount(data.count || 0);
      } catch {
        setUnreadCount(0);
      }
    };

    fetchProfile();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(),
      });
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch {
      toast.error('Ошибка при выходе');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#0f192c]/85 to-[#17304a]/80 backdrop-blur-xl border-b border-cyan-400/10 shadow-xl">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-8 py-3">
        <div className="flex items-center gap-2 md:gap-5">
          <button
            onClick={() => router.push('/admin')}
            className="text-lg md:text-xl font-extrabold text-cyan-200 tracking-tight bg-gradient-to-tr from-cyan-400/40 to-blue-500/30 px-4 py-1 rounded-2xl shadow-md hover:scale-105 transition-all"
          >
            <span>🔧 Админ-панель</span>
          </button>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={clsx(
                  'relative px-4 py-1 rounded-full text-sm font-medium overflow-hidden transition-all duration-200 flex items-center gap-1',
                  pathname === item.href
                    ? 'bg-cyan-400/90 text-gray-900 shadow-lg pointer-events-none'
                    : 'text-cyan-100 hover:bg-cyan-400/20 hover:text-white/90'
                )}
                disabled={pathname === item.href}
                style={{ opacity: pathname === item.href ? 1 : 0.92 }}
              >
                <Icon className="w-4 h-4" />
                <span className="relative z-10">{item.label}</span>
                {pathname === item.href && (
                  <span className="absolute left-0 top-0 h-full w-full bg-cyan-200/20 animate-pulse rounded-full z-0 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <button
            title="Уведомления"
            onClick={() => router.push('/admin/notifications')}
            className="relative text-cyan-100 hover:text-cyan-400 transition-all px-2 py-1 rounded-full"
          >
            <BellIcon className="w-6 h-6" />
            {unreadCount > 0 && (
              <>
                <span className="absolute -top-2 -right-2 bg-pink-500 text-[11px] font-bold text-white rounded-full w-5 h-5 flex items-center justify-center animate-bounce z-20">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
                <span className="absolute top-0 right-0 w-3 h-3 bg-pink-400 rounded-full animate-ping z-10" />
              </>
            )}
          </button>
          <div className="flex items-center gap-2 text-sm text-cyan-100/80 px-2 py-1 rounded-full select-none">
            <UserCircle2 className="w-5 h-5" />
            {loading ? 'Загрузка...' : adminName}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-cyan-100 hover:text-pink-400 transition px-2 py-1 rounded-full text-sm font-semibold"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Выйти</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
