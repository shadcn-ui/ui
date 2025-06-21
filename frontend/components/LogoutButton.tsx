'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      toast.error('Ошибка при выходе');
    } finally {
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  return (
    <>
      <Button
        variant="danger"
        onClick={() => setConfirm(true)}
        disabled={loading}
        aria-label="Выход из аккаунта"
        className="flex items-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Выйти
      </Button>

      <AnimatePresence>
        {confirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* blur-фон */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-[2.5px] transition-opacity duration-300"
              onClick={() => setConfirm(false)}
            />
            <motion.div
              className="relative z-10 bg-gradient-to-br from-[#251520]/95 to-[#41233a]/90 border border-pink-400/20 p-8 rounded-2xl shadow-2xl text-white flex flex-col items-center gap-6 max-w-xs"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.18, duration: 0.22 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-lg font-semibold text-center text-pink-200">Выйти из аккаунта?</div>
              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setConfirm(false)} disabled={loading}>
                  Отмена
                </Button>
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  disabled={loading}
                  loading={loading}
                  loadingText="Выход..."
                >
                  Выйти
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
