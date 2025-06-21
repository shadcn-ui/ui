'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import AdminNavbar from '@/components/AdminNavbar';
import NewRequestModal from '@/components/NewRequestModal';
import { Star, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface RequestItem {
  id: number;
  title: string;
  content: string;
  status: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  category?: string;
  source?: 'WEB' | 'TELEGRAM' | 'PHONE';
  createdAt: string;
  resolvedAt?: string | null;
  expectedResolutionDate?: string | null;
  feedback?: string | null;
  rating?: number | null;
  fileUrls?: string[];
  user: {
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    internalPhone?: string;
  };
  executor?: {
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    internalPhone?: string;
  };
  comments: {
    id: number;
    content: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
    };
  }[];
}

const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Низкий',
  NORMAL: 'Обычный',
  HIGH: 'Высокий',
  URGENT: 'Срочный',
};

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  DONE: 'Завершена',
  REJECTED: 'Отклонена',
  COMPLETED: 'Выполнена',
};

const SOURCE_LABELS: Record<string, string> = {
  WEB: 'Портал',
  TELEGRAM: 'Телеграм',
  PHONE: 'Телефон',
};

const DEFAULT_STATUSES = ['NEW', 'IN_PROGRESS'];

export default function AdminRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');

  const [myAverageRating, setMyAverageRating] = useState<string>('—');
  const [myId, setMyId] = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      const role = decoded.role?.toUpperCase();
      if (role !== 'ADMIN' && role !== 'SUPERUSER') {
        router.push('/dashboard');
        return;
      }
      setMyId(decoded.sub);
    } catch {
      toast.error('Ошибка токена');
      router.push('/login');
    }
  }, []);

  const loadRequests = () => {
    fetch(`${API_URL}/requests/assigned`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Ошибка загрузки заявок');
        setError('Ошибка загрузки заявок.');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) loadRequests();
    // eslint-disable-next-line
  }, []);

  // --- фильтрация ---
  const filteredRequests = requests.filter((req) => {
    const matchTitle = !filterTitle || req.title.toLowerCase().includes(filterTitle.toLowerCase());
    const matchPriority = !filterPriority || req.priority === filterPriority;
    const matchSource = !filterSource || req.source === filterSource;
    if (filterStatus) {
      return (
        req.status === filterStatus &&
        matchTitle &&
        matchPriority &&
        matchSource
      );
    }
    // По умолчанию — только "Новые" и "В работе"
    return (
      DEFAULT_STATUSES.includes(req.status) &&
      matchTitle &&
      matchPriority &&
      matchSource
    );
  });

  // Подсчёт персонального рейтинга (только для текущего исполнителя)
  useEffect(() => {
    if (!myId || requests.length === 0) {
      setMyAverageRating('—');
      return;
    }
    const myCompleted = requests.filter(
      (r) =>
        r.executor &&
        r.executor.id === myId &&
        r.status === 'COMPLETED' &&
        typeof r.rating === 'number'
    );
    if (myCompleted.length === 0) {
      setMyAverageRating('—');
      return;
    }
    const avg =
      myCompleted.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
      myCompleted.length;
    setMyAverageRating(avg.toFixed(2));
  }, [requests, myId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white pt-20 px-3 md:px-10 py-10 space-y-10">
      <AdminNavbar />

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 mt-10">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-200">
          🛠️ Назначенные мне заявки
        </h1>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-[#191b25] font-bold rounded-2xl shadow-xl border border-cyan-200/40 transition-all"
        >
          <PlusCircle className="w-5 h-5" /> Создать заявку
        </button>
      </div>

      {/* Рейтинг */}
      <div className="flex items-center gap-4 mb-6">
        <span className="flex items-center gap-2 text-lg text-cyan-300 font-semibold">
          <Star className="w-6 h-6 text-yellow-400" />
          Ваш средний рейтинг:{" "}
          {myAverageRating === '—' ? (
            <span className="text-white/60 italic">нет оценок</span>
          ) : (
            <span className="text-yellow-300">{myAverageRating} ★</span>
          )}
        </span>
      </div>
      <p className="text-cyan-100/70 mb-6">Вы видите только те обращения, в которых вы назначены исполнителем.</p>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Поиск по заголовку..."
          className="p-2 rounded-xl bg-white/10 border border-cyan-200/10 text-white"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
        />
        <select
          className="p-2 rounded-xl bg-white/10 border border-cyan-200/10 text-white"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">Все приоритеты</option>
          {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          className="p-2 rounded-xl bg-white/10 border border-cyan-200/10 text-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Все статусы</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          className="p-2 rounded-xl bg-white/10 border border-cyan-200/10 text-white"
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
        >
          <option value="">Все источники</option>
          {Object.entries(SOURCE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-white/60">Загрузка...</p>}
      {error && <p className="text-pink-400">{error}</p>}

      <div className="space-y-4">
        {Array.isArray(filteredRequests) && filteredRequests.length === 0 && !loading && !error ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/50 italic">
            Заявок пока нет.
          </motion.p>
        ) : (
          filteredRequests.filter((req) => req && req.id).map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-cyan-400/10 p-4 bg-white/5 hover:border-cyan-400 cursor-pointer shadow"
              onClick={() => router.push(`/admin/requests/${req.id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-cyan-200">{req.title}</h2>
                <span className="text-xs bg-cyan-900/70 text-cyan-100 px-2 py-0.5 rounded-full">
                  {STATUS_LABELS[req.status] ?? req.status}
                </span>
              </div>
              <p className="text-sm text-white/80 line-clamp-2">{req.content}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                {req.priority && (
                  <span className="text-xs px-2 py-1 bg-cyan-800/30 rounded-xl text-cyan-200">
                    {PRIORITY_LABELS[req.priority]}
                  </span>
                )}
                {req.category && (
                  <span className="text-xs px-2 py-1 bg-white/10 rounded-xl text-cyan-100">
                    {req.category}
                  </span>
                )}
                {req.source && (
                  <span className="text-xs px-2 py-1 bg-cyan-800/30 rounded-xl text-cyan-100">
                    {SOURCE_LABELS[req.source]}
                  </span>
                )}
              </div>
              <p className="text-xs text-cyan-100/60 mt-2">
                {req.user ? (
                  <span>
                    👤 Автор:{' '}
                    <a href={`/admin/users/${req.user.id}`} className="text-cyan-300 hover:underline">
                      {req.user.lastName} {req.user.firstName}
                    </a>
                  </span>
                ) : (
                  <span className="text-pink-400">Автор не указан</span>
                )}
              </p>
              <p className="text-xs text-cyan-100/50 mt-1">
                📅 Создана: {new Date(req.createdAt).toLocaleDateString()} &nbsp;
                {req.expectedResolutionDate && (
                  <>🕓 До: {new Date(req.expectedResolutionDate).toLocaleDateString()}</>
                )}
              </p>
            </motion.div>
          ))
        )}
      </div>

      {showNewModal && (
        <NewRequestModal
          onClose={() => setShowNewModal(false)}
          onCreated={loadRequests}
        />
      )}
    </div>
  );
}
