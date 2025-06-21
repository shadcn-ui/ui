'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { jwtDecode } from 'jwt-decode';

export default function Home() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const router = useRouter();

  useEffect(() => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (cookie) {
      const token = cookie.split('=')[1];
      try {
        const payload = jwtDecode(token);
        // @ts-ignore
        const role = payload.role;
        if (role === 'superuser') {
          router.push('/superadmin');
        } else if (role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } catch (e) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 md:px-8 bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white">
      {/* Лого/иконка и название */}
      <motion.div
        initial={{ opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center mb-8 select-none"
      >
        <span className="bg-gradient-to-tr from-cyan-400 to-teal-200 rounded-full p-4 shadow-xl mb-3">
          <ShieldCheck className="w-12 h-12 text-white drop-shadow-lg" />
        </span>
        <h1 className="text-2xl md:text-3xl text-center font-extrabold text-cyan-200 tracking-tight drop-shadow max-w-2xl leading-tight">
          Портал технической поддержки<br />медицинской организации
        </h1>
        <div className="text-xs text-cyan-100/60 font-mono mt-2">
          Ростов-на-Дону &middot; Поликлиника №16
        </div>
      </motion.div>

      {/* Табы */}
      <motion.div
        className="flex gap-3 mb-8 rounded-full bg-white/10 border border-cyan-200/20 backdrop-blur-xl p-2 shadow-inner"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => setTab('login')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition text-base
            ${tab === 'login'
              ? 'bg-cyan-400 text-[#14242c] shadow-lg'
              : 'text-cyan-100 hover:bg-white/10'}`}
        >
          <LogIn className="w-5 h-5" /> Вход
        </button>
        <button
          onClick={() => setTab('register')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition text-base
            ${tab === 'register'
              ? 'bg-cyan-400 text-[#14242c] shadow-lg'
              : 'text-cyan-100 hover:bg-white/10'}`}
        >
          <UserPlus className="w-5 h-5" /> Регистрация
        </button>
      </motion.div>

      {/* Форма */}
      <motion.div
        className={`bg-white/10 border border-cyan-200/10 backdrop-blur-2xl p-9 rounded-2xl shadow-2xl w-full transition-all duration-300
          ${tab === 'register' ? 'max-w-3xl' : 'max-w-md'}`}
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {tab === 'login' ? <LoginForm /> : <RegisterForm />}
      </motion.div>

      {/* Нижняя микро-подсказка */}
      <div className="text-[11px] text-cyan-100/40 mt-8 font-light text-center select-none">
        <span className="opacity-70">© 2025 IT-отдел. Всё анонимно. Все права защищены.</span>
      </div>
    </div>
  );
}
