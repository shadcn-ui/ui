'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import NewRequestModal from '@/components/NewRequestModal';
import RequestCard from '@/components/RequestCard';
import RequestFilters from '@/components/RequestFilters';
import { motion } from 'framer-motion';
import { BarChart2, RefreshCw, FileDown, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { CSVLink } from 'react-csv';

// ✅ Функция безопасного декодирования UTF-8 JWT
function decodeJwtPayload(token: string) {
  try {
    const base64 = token.split('.')[1];
    const normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder('utf-8').decode(bytes);
    return JSON.parse(decoded);
  } catch {
    toast.error('Ошибка декодирования токена');
    return null;
  }
}

// Закрытые статусы (не отображать по умолчанию)
const CLOSED_STATUSES = ['DONE', 'COMPLETED'];

export default function MyRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState({ firstName: '', lastName: '' });

  const [showModal, setShowModal] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);

  const [filterTitle, setFilterTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [formState, setFormState] = useState({
    title: '',
    content: '',
    priority: 'NORMAL',
    category: '',
    fileUrls: [],
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    const payload = decodeJwtPayload(token);
    if (payload) {
      setUser({ firstName: payload.firstName, lastName: payload.lastName });
    }
    loadRequests();
    // eslint-disable-next-line
  }, []);

  const loadRequests = () => {
    setLoading(true);
    fetch(`${API_URL}/requests/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка загрузки заявок.');
        setLoading(false);
      });
  };

  const openRepeatModal = (req: any) => {
    setFormState({
      title: req.title,
      content: req.content,
      priority: req.priority || 'NORMAL',
      category: req.category || '',
      fileUrls: req.fileUrls || [],
    });
    setShowModal(true);
  };

  // Фильтрация: скрываем закрытые статусы, если не выбран фильтр по закрытому статусу
  const filteredRequests = requests.filter((r) => {
    const matchTitle = !filterTitle || r.title.toLowerCase().includes(filterTitle.toLowerCase());
    const matchPriority = !filterPriority || r.priority === filterPriority;
    const matchCategory = !filterCategory || r.category === filterCategory;
    const matchDate = !filterDate || r.createdAt.startsWith(filterDate);

    // Если фильтр по статусу не выбран
    if (!filterStatus) {
      // По умолчанию скрываем закрытые статусы
      return (
        !CLOSED_STATUSES.includes(r.status) &&
        matchTitle &&
        matchPriority &&
        matchCategory &&
        matchDate
      );
    } else {
      // Если пользователь фильтрует по какому-либо статусу
      return (
        r.status === filterStatus &&
        matchTitle &&
        matchPriority &&
        matchCategory &&
        matchDate
      );
    }
  });

  const stats = {
    total: requests.length,
    active: requests.filter((r) => r.status === 'IN_PROGRESS').length,
    resolved: requests.filter((r) => r.status === 'RESOLVED' || r.status === 'DONE' || r.status === 'COMPLETED').length,
    // averageRating: больше не нужен!
  };

  const csvData = requests.map((r) => ({
    ID: r.id,
    Название: r.title,
    Статус: r.status,
    Приоритет: r.priority,
    Категория: r.category,
    ДатаСоздания: r.createdAt,
    Оценка: r.rating || '',
  }));

  return (
    <>
      <Navbar user={user} currentPage="requests" />
      <div className="min-h-screen bg-gradient-to-br from-[#131827] via-[#18243c] to-[#19243a] text-white px-3 md:px-7 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Шапка + Экшены */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 drop-shadow">
              <BarChart2 className="text-cyan-400 w-8 h-8" />
              Мои заявки
            </h1>
            <div className="flex gap-3">
              <CSVLink
                data={csvData}
                filename="requests.csv"
                className="flex items-center gap-2 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-300/10 text-cyan-100 px-5 py-2 rounded-xl shadow transition font-medium"
              >
                <FileDown className="w-5 h-5" /> Экспорт
              </CSVLink>
              <button
                onClick={() => setCreatingNew(true)}
                className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-[#15232c] font-bold px-5 py-2 rounded-xl shadow transition"
              >
                <PlusCircle className="w-5 h-5" /> Новая заявка
              </button>
            </div>
          </div>

          {/* Статы (убрали средний рейтинг) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
            <StatsCard icon={<BarChart2 className="text-cyan-400 w-6 h-6" />} label="Всего" value={stats.total} />
            <StatsCard icon={<RefreshCw className="text-yellow-400 w-6 h-6" />} label="В работе" value={stats.active} />
            <StatsCard icon={<BarChart2 className="text-green-400 w-6 h-6" />} label="Решено" value={stats.resolved} />
            {/* <StatsCard ... />  рейтинг убран */}
          </div>

          {/* Фильтры */}
          <details className="mb-7">
            <summary className="cursor-pointer text-cyan-300 hover:text-cyan-200 text-lg font-semibold transition">🔍 Фильтры</summary>
            <div className="mt-4 bg-white/5 p-4 rounded-xl shadow border border-cyan-200/10">
              <RequestFilters
                filterTitle={filterTitle}
                setFilterTitle={setFilterTitle}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterDate={filterDate}
                setFilterDate={setFilterDate}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
              />
            </div>
          </details>

          {loading && <p className="text-white/60">Загрузка...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {/* Карточки заявок */}
          <div className="space-y-4">
            {filteredRequests.length === 0 && !loading && !error ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/50 italic">
                Нет заявок по текущему фильтру.
              </motion.div>
            ) : (
              filteredRequests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white/10 border border-cyan-200/10 rounded-2xl shadow p-4 cursor-pointer hover:bg-cyan-800/10 transition"
                  onClick={() => router.push(`/dashboard/requests/${req.id}`)}
                >
                  <RequestCard request={req} onRepeat={() => openRepeatModal(req)} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {(creatingNew || showModal) && (
        <NewRequestModal
          onClose={() => {
            setCreatingNew(false);
            setShowModal(false);
          }}
          onCreated={loadRequests}
          initialState={formState}
        />
      )}
    </>
  );
}

function StatsCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white/10 border border-cyan-200/10 rounded-2xl shadow flex items-center gap-4 p-5">
      <div className="bg-cyan-500/10 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-cyan-100/70 text-sm">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
