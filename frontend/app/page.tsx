'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import HeadingAnimated from '@/components/HeadingAnimated';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { LogIn, UserPlus, Star } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  createdAt: string;
}

type JwtPayload = {
  sub: number; // userId
  role: string;
  exp: number;
};

export default function Home() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const router = useRouter();

  // Для рейтинга администратора
  const [adminRating, setAdminRating] = useState<string | null>(null);
  // Последние новости
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded?.sub && decoded.exp * 1000 > Date.now()) {
          localStorage.setItem('userId', decoded.sub.toString());
          localStorage.setItem('role', decoded.role);

          // Если админ — запрашиваем рейтинг
          if (decoded.role?.toUpperCase() === 'ADMIN' || decoded.role?.toUpperCase() === 'SUPERUSER') {
            fetchAdminRating(decoded.sub, token);
          }

          router.push('/dashboard');
        }
      } catch {
        console.warn('Неверный токен, удаляю...');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
      }
    }
  }, [router]);

  // Загружаем последние новости
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/news?limit=3`)
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(data => setLatestNews(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Функция для получения рейтинга текущего админа
  const fetchAdminRating = async (adminId: number, token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/requests/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Считаем средний рейтинг только по COMPLETED заявкам
      const myCompleted = (data || []).filter(
        (r: any) =>
          r.executor &&
          r.executor.id === adminId &&
          r.status === 'COMPLETED' &&
          typeof r.rating === 'number'
      );
      if (!myCompleted.length) {
        setAdminRating('нет оценок');
        return;
      }
      const avg =
        myCompleted.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) /
        myCompleted.length;
      setAdminRating(avg.toFixed(2));
    } catch {
      setAdminRating('ошибка');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 md:px-8 bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white">
      <motion.div
        initial={{ opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-8 w-full max-w-2xl"
      >
        <HeadingAnimated text="Портал Отдела программного обеспечения поликлиники №16 г. Ростова-на-Дону" />
      </motion.div>

      {/* Блок рейтинга администратора */}
      {adminRating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 flex items-center justify-center gap-2 text-lg font-semibold text-cyan-300 drop-shadow"
        >
          <Star className="w-5 h-5 text-yellow-300" />
          Ваш средний рейтинг:{" "}
          {adminRating === 'нет оценок' || adminRating === 'ошибка' ? (
            <span className="text-white/70 italic">{adminRating}</span>
          ) : (
            <span className="text-yellow-300">{adminRating} ★</span>
          )}
        </motion.div>
      )}

      {latestNews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 w-full max-w-md bg-white/10 border border-cyan-200/10 backdrop-blur-2xl p-5 rounded-2xl shadow-2xl"
        >
          <h2 className="text-cyan-300 font-semibold mb-3 text-center text-sm">Последние новости</h2>
          <ul className="text-sm space-y-2">
            {latestNews.map(n => (
              <li key={n.id} className="border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
                <span className="block font-semibold">{n.title}</span>
                <span className="text-xs text-white/60">{new Date(n.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => router.push('/news')}
            className="mt-3 text-cyan-300 hover:underline text-xs"
          >
            Смотреть все
          </button>
        </motion.div>
      )}

      {/* Табы */}
      <motion.div
        className="flex gap-2 mb-7 rounded-full bg-white/10 border border-cyan-200/20 backdrop-blur-xl p-2 shadow-inner"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => setTab('login')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-base transition
            ${tab === 'login'
              ? 'bg-cyan-400 text-[#15232c] shadow-lg'
              : 'text-cyan-100 hover:bg-white/10'
            }`}
        >
          <LogIn className="w-5 h-5" /> Вход
        </button>
        <button
          onClick={() => setTab('register')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-base transition
            ${tab === 'register'
              ? 'bg-cyan-400 text-[#15232c] shadow-lg'
              : 'text-cyan-100 hover:bg-white/10'
            }`}
        >
          <UserPlus className="w-5 h-5" /> Регистрация
        </button>
      </motion.div>

      {/* Блок с формой */}
      <motion.div
        className="bg-white/10 border border-cyan-200/10 backdrop-blur-2xl p-9 rounded-2xl shadow-2xl w-full transition-all duration-300 max-w-md"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {tab === 'login' ? <LoginForm /> : <RegisterForm />}
      </motion.div>

      {/* Footer микро-подсказка */}
      <div className="text-[11px] text-cyan-100/40 mt-8 font-light text-center select-none">
        <span className="opacity-70">© {new Date().getFullYear()} IT-отдел. Всё анонимно. Все права защищены.</span>
      </div>
    </div>
  );
}
