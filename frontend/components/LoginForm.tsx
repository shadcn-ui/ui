'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const snils = formData.get('snils')?.toString().trim();
    const password = formData.get('password')?.toString();

    if (!snils || !password) {
      setError('Пожалуйста, заполните все поля');
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ snils, password }),
      });

      if (!res.ok) {
        throw new Error('Неверный СНИЛС или пароль');
      }

      const data = await res.json();
      if (!data.role || !data.access_token) {
        throw new Error('Не удалось получить токен или роль');
      }
      const role = data.role.toUpperCase();

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', role);

      let destination = '/dashboard';
      if (role === 'ADMIN') destination = '/admin';
      else if (role === 'SUPERUSER') destination = '/superadmin';

      await router.push(destination);
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-red-500/90 to-pink-500/80 px-3 py-2 rounded-lg text-sm text-white text-center shadow-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <input
          type="text"
          name="snils"
          autoComplete="username"
          placeholder="СНИЛС (например, 123-456-789 00)"
          className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-md transition w-full"
          required
          disabled={loading}
        />
      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          placeholder="Пароль"
          className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-md transition w-full pr-12"
          required
          disabled={loading}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-cyan-300 hover:text-cyan-100 transition"
          onClick={() => setShowPassword(v => !v)}
          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 transition text-[#15171c] font-bold py-3 rounded-2xl shadow-lg active:scale-95 duration-100"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Вход...
          </>
        ) : (
          "Войти"
        )}
      </button>
    </form>
  );
}
