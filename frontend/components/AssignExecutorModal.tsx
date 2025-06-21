import React, { useEffect, useState } from 'react';
import { User } from '../types/user';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

interface AssignExecutorModalProps {
  requestId: number;
  isOpen: boolean;
  onClose: () => void;
  currentExecutorId?: number | null;
  onAssign: () => void;
}

export default function AssignExecutorModal({
  requestId,
  isOpen,
  onClose,
  currentExecutorId,
  onAssign,
}: AssignExecutorModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedExecutorId, setSelectedExecutorId] = useState<number | null>(currentExecutorId ?? null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/users`, {
          credentials: 'include',
        });

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        if (!res.ok) {
          alert('Не удалось загрузить список пользователей. Проверьте авторизацию.');
          return;
        }

        const data = await res.json();
        const admins = data.filter((user: User) => {
          const role = user.role?.toUpperCase();
          return role === 'ADMIN' || role === 'SUPERUSER';
        });
        setUsers(admins);
      } catch {
        alert('Не удалось загрузить список пользователей. Проверьте авторизацию.');
      }
    };

    if (isOpen) {
      fetchUsers();
      setSelectedExecutorId(currentExecutorId ?? null);
    }
  }, [isOpen, API_BASE, currentExecutorId, router]);

  const handleAssign = async () => {
    if (!selectedExecutorId) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/requests/${requestId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ executorId: selectedExecutorId }),
      });

      if (!res.ok) {
        alert('Не удалось переназначить заявку');
        return;
      }

      onAssign();
      onClose();
    } catch (err) {
      alert('Не удалось переназначить заявку');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Glass-фон */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.18, duration: 0.28 }}
            className="relative z-10 bg-gradient-to-br from-[#172142]/95 to-[#24334b]/95 border border-cyan-400/15
            p-8 w-full max-w-md rounded-2xl shadow-2xl text-white flex flex-col gap-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2 text-center flex items-center justify-center gap-2 text-cyan-200">
              🔁 Переназначить заявку
            </h2>

            {users.length === 0 ? (
              <p className="text-sm text-cyan-100/70 mb-2 text-center">
                Нет доступных исполнителей
              </p>
            ) : (
              <select
                className="w-full p-3 rounded-xl bg-white/10 border border-cyan-300/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow"
                value={selectedExecutorId ?? ''}
                onChange={(e) => setSelectedExecutorId(Number(e.target.value))}
                disabled={loading}
              >
                <option value="">Выберите исполнителя</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.lastName} {user.firstName} ({user.role})
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end gap-3 pt-5 border-t border-cyan-200/10 mt-2">
              <Button variant="ghost" onClick={onClose} disabled={loading}>
                Отмена
              </Button>
              <Button
                variant="accent"
                onClick={handleAssign}
                disabled={loading || !selectedExecutorId}
                loading={loading}
                loadingText="Сохраняем..."
              >
                Сохранить
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
