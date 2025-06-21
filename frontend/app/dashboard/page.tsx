'use client';

import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import NewRequestModal from '@/components/NewRequestModal';
import TileCard from '@/components/TileCard';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Clock,
  Bell,
  FolderKanban,
  User,
  FileWarning,
  Newspaper,
  HelpCircle,
  PlusCircle,
  BookOpen,
  MessageSquare
} from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  'NEW': 'Новая',
  'IN_PROGRESS': 'В работе',
  'DONE': 'Завершена',
  'CANCELED': 'Отменена'
};

function pluralize(count: number, one: string, few: string, many: string) {
  const mod10 = count % 10, mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [requestsCount, setRequestsCount] = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded?.sub) {
        router.push('/login');
        return;
      }
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

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch {
        setError('Ошибка загрузки профиля');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // Получение количества заявок в работе
  useEffect(() => {
    if (user?.id) {
      fetch(`${API_URL}/requests/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          const inWorkRequests = Array.isArray(data)
            ? data.filter(r => {
                let status = '';
                if (typeof r.status === 'string') {
                  status = r.status.toUpperCase();
                } else if (r.status && typeof r.status === 'object' && r.status.code) {
                  status = r.status.code.toUpperCase();
                }
                return status === 'NEW' || status === 'IN_PROGRESS';
              })
            : [];
          setRequestsCount(inWorkRequests.length);
        })
        .catch(() => setRequestsCount(0));
    }
  }, [user]);

  const getFullName = (u: any) =>
    [u?.lastName, u?.firstName, u?.middleName].filter(Boolean).join(' ') || 'Пользователь';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Доброе утро';
    if (h < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const { unreadCount } = useNotifications(user?.id, user?.role);

  const tiles = [
    {
      title: 'Профиль',
      description: 'Личные данные',
      icon: User,
      color: 'blue',
      href: '/dashboard/profile',
    },
    {
      title: 'Заявки',
      description:
        requestsCount === null
          ? 'Загрузка...'
          : requestsCount === 0
            ? 'Нет заявок в работе'
            : `${requestsCount} ${pluralize(requestsCount, 'заявка в работе', 'заявки в работе', 'заявок в работе')}`,
      icon: FolderKanban,
      color: 'yellow',
      href: '/dashboard/requests',
    },
    {
      title: 'Новости',
      description: 'Последние события',
      icon: Newspaper,
      color: 'green',
      href: '/news',
    },
    {
      title: 'Инструкции',
      description: 'Справочник',
      icon: FileWarning,
      color: 'purple',
      href: '/guides',
    },
    {
      title: 'Уведомления',
      description: unreadCount === 0 ? 'Нет новых' : `${unreadCount} новых`,
      icon: Bell,
      color: 'red',
      href: '/dashboard/notifications',
    },
  ];

  const feed = [
    { text: 'Создана новая заявка на замену монитора', time: '5 мин назад' },
    { text: 'Инструкция по VPN обновлена', time: '1 час назад' },
    { text: 'Согласована заявка №124 от отдела HR', time: 'Вчера' }
  ];

  const actions = [
    {
      icon: <PlusCircle className="w-5 h-5" />,
      text: 'Создать заявку',
      onClick: () => setShowModal(true)
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      text: 'Задать вопрос',
      onClick: () => alert('Форма обратной связи')
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      text: 'Открыть инструкцию',
      onClick: () => router.push('/guides')
    }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#12161f] to-[#1a2231] text-white flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111927] via-[#162032] to-[#19253a] text-white px-3 md:px-6 pb-10">
      <Navbar user={user} currentPage="dashboard" />
      <div className="max-w-7xl mx-auto pt-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-[0_2px_8px_rgba(23,227,255,0.09)]">
          {greeting()}, {getFullName(user)} <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-white/60 mb-10">Сегодня {new Date().toLocaleDateString('ru-RU')} — всё стабильно</p>

        {/* Карточки-статы */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-7 mb-12">
          {tiles.map((t, i) => (
            <TileCard
              key={i}
              title={t.title}
              description={t.description}
              icon={t.icon}
              color={t.color as any}
              href={t.href}
            />
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {/* Недавняя активность */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-white/90">Недавняя активность</h2>
            <div className="space-y-4">
              {feed.map((f, i) => (
                <div key={i} className="bg-white/10 border border-white/10 p-6 rounded-2xl flex items-start gap-5 shadow-md">
                  <Bell className="text-cyan-300 w-6 h-6 mt-1" />
                  <div>
                    <p className="text-white/90">{f.text}</p>
                    <p className="text-sm text-white/50 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" /> {f.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Быстрые действия */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4 text-white/90">Быстрые действия</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {actions.map((a, i) => (
                  <button
                    key={i}
                    onClick={a.onClick}
                    className="bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-300/10 text-cyan-100 font-semibold p-6 rounded-2xl flex items-center gap-4 shadow-lg transition-all duration-200"
                  >
                    <span className="bg-cyan-400/20 p-2 rounded-full">{a.icon}</span>
                    <span>{a.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Блок помощи */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white/90">Помощь</h2>
            <div className="bg-gradient-to-tr from-[#1b2c3f]/90 to-[#27405c]/70 p-8 rounded-2xl text-white/90 flex flex-col gap-3 border border-cyan-200/10 shadow-xl">
              <p className="flex gap-2 items-center"><HelpCircle className="w-5 h-5" /> Напишите, чтобы создать заявку</p>
              <p className="flex gap-2 items-center"><HelpCircle className="w-5 h-5" /> ИИ подскажет инструкцию</p>
              <p className="flex gap-2 items-center"><HelpCircle className="w-5 h-5" /> Открытые вопросы по поддержке</p>
              <button className="mt-4 bg-cyan-400 hover:bg-cyan-300 transition text-[#131b2e] font-bold py-2 px-6 rounded-xl shadow-lg">
                Открыть ассистента
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно заявки */}
      {showModal && (
        <NewRequestModal
          onClose={() => setShowModal(false)}
          onCreated={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
