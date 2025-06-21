"use client";

import { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import UserFormModal from '@/components/UserFormModal';
import UserDetailsCard from '@/components/UserDetailsCard';
import EquipmentDetailsCard from '@/components/EquipmentDetailsCard';
import { User, UserDetails } from '@/types/user';
import { EquipmentDetails } from '@/types/equipment';
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

interface UserForm {
  lastName: string;
  firstName: string;
  middleName: string;
  department: string;
  position: string;
  role: string;
  mobilePhone: string;
  internalPhone: string;
  floor: string;
  cabinet: string;
  password?: string;
  snils: string;
  birthDate: string;
  telegramUserId?: string;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const emptyUser: UserForm = {
  lastName: '',
  firstName: '',
  middleName: '',
  department: '',
  position: '',
  role: 'user',
  mobilePhone: '',
  internalPhone: '',
  floor: '',
  cabinet: '',
  snils: '',
  birthDate: '',
  telegramUserId: '',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [equipmentDetails, setEquipmentDetails] = useState<EquipmentDetails | null>(null);
  const [form, setForm] = useState<UserForm>(emptyUser);

  const resetForm = () => setForm(emptyUser);

  const fetchUsers = async () => {
    if (!apiBase) {
      setError('NEXT_PUBLIC_API_URL не определён');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/users`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
        setError('');
      } else {
        setError('Ошибка загрузки пользователей');
        setUsers([]);
      }
    } catch {
      toast.error('Ошибка загрузки пользователей');
      setError('Ошибка загрузки пользователей');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (id: number) => {
    if (!apiBase) {
      setError('NEXT_PUBLIC_API_URL не определён');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/users/details/${id}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setDetails(data);
        setEquipmentDetails(null);
      } else {
        setError('Ошибка загрузки подробностей');
      }
    } catch {
      toast.error('Ошибка загрузки подробностей');
      setError('Ошибка загрузки подробностей');
    }
  };

  const handleEquipmentClick = async (equipmentId: number) => {
    if (!apiBase) {
      setError('NEXT_PUBLIC_API_URL не определён');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/equipment/${equipmentId}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setEquipmentDetails(data);
      } else {
        setError('Ошибка загрузки оборудования');
      }
    } catch {
      toast.error('Ошибка загрузки оборудования');
      setError('Ошибка загрузки оборудования');
    }
  };

  const handleEditById = async (id: number) => {
    if (!apiBase) {
      setError('NEXT_PUBLIC_API_URL не определён');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/users/details/${id}`, { headers: getHeaders() });
      if (!res.ok) {
        setError('Ошибка при загрузке пользователя');
        return;
      }
      const user = await res.json();

      setForm({
        lastName: user.lastName ?? '',
        firstName: user.firstName ?? '',
        middleName: user.middleName ?? '',
        department: user.department ?? '',
        position: user.position ?? '',
        role: user.role ?? 'user',
        mobilePhone: user.mobilePhone ?? '',
        internalPhone: typeof user.internalPhone === 'string'
          ? user.internalPhone
          : (user.internalPhone !== undefined && user.internalPhone !== null ? String(user.internalPhone) : ''),
        floor: user.floor ?? '',
        cabinet: user.cabinet ?? '',
        snils: user.snils ?? '',
        birthDate: user.birthDate
          ? user.birthDate.slice(0, 10) // форматируем к "YYYY-MM-DD" для input[type="date"]
          : '',
        telegramUserId: user.telegramUserId ?? '',
        password: '', // поле всегда пустое для формы редактирования!
      });

      setEditUserId(user.id);
      setIsModalOpen(true);
      setError('');
    } catch {
      toast.error('Ошибка при загрузке пользователя');
      setError('Ошибка при загрузке пользователя');
    }
  };

  const handleUpdate = async (data: UserForm) => {
    if (!apiBase) {
      alert('NEXT_PUBLIC_API_URL не определён');
      return;
    }
    const isEdit = !!editUserId;
    const url = isEdit ? `${apiBase}/users/${editUserId}` : `${apiBase}/users`;
    const method = isEdit ? 'PUT' : 'POST';

    // Готовим объект для отправки: не отправляем пустой пароль, если его не меняли!
    const body: any = { ...data, internalPhone: data.internalPhone === '' ? null : data.internalPhone };
    if (isEdit && !body.password) delete body.password;

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchUsers();
        resetForm();
        setIsModalOpen(false);
        setEditUserId(null);
        setError('');
      } else {
        alert('Ошибка при сохранении пользователя');
      }
    } catch (err) {
      alert('Ошибка сети при сохранении');
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить пользователя?')) return;
    if (!apiBase) {
      setError('NEXT_PUBLIC_API_URL не определён');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchUsers();
        setError('');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Ошибка при удалении: ${errData.message || res.statusText}`);
      }
    } catch {
      toast.error('Ошибка при удалении');
      alert('Ошибка сети при удалении');
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white pt-20 px-3 md:px-10 py-10 space-y-10">
      <AdminNavbar />

      {!apiBase && (
        <div className="p-4 mb-4 bg-pink-500/20 text-pink-300 rounded-2xl font-bold">
          Ошибка конфигурации: переменная окружения <b>NEXT_PUBLIC_API_URL</b> не задана!
        </div>
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 mt-10">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-200">
          👤 Пользователи системы
        </h1>
        <button
          onClick={() => {
            resetForm();
            setEditUserId(null);
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-[#191b25] font-bold rounded-2xl shadow-xl border border-cyan-200/40 transition-all"
        >
          ➕ Добавить пользователя
        </button>
      </div>

      {error && <p className="text-pink-400 mb-4">{error}</p>}

      {details && (
        <UserDetailsCard
          details={details}
          onEquipmentClick={handleEquipmentClick}
          onClose={() => setDetails(null)}
        />
      )}

      {equipmentDetails && <EquipmentDetailsCard details={equipmentDetails} />}

      <motion.div
        className="overflow-x-auto rounded-2xl border border-cyan-400/10 bg-white/5 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <table className="min-w-full text-sm text-left text-white/90">
          <thead className="bg-cyan-900/60 text-cyan-100/70">
            <tr>
              <th className="px-4 py-3">ФИО</th>
              <th className="px-4 py-3">Отдел</th>
              <th className="px-4 py-3">Должность</th>
              <th className="px-4 py-3">Роль</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/50">
                  Загрузка пользователей...
                </td>
              </tr>
            ) : !Array.isArray(users) ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-pink-400">
                  Ошибка: некорректный формат данных пользователей!
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/50">
                  Нет пользователей
                </td>
              </tr>
            ) : (
              users.map((u, idx) => (
                <motion.tr
                  key={u.id ?? idx}
                  className="border-t border-cyan-400/10 hover:bg-cyan-800/10 transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                >
                  <td
                    className="px-4 py-2 cursor-pointer text-cyan-300 hover:underline"
                    onClick={() => viewDetails(u.id)}
                  >
                    {u.lastName} {u.firstName} {u.middleName}
                  </td>
                  <td className="px-4 py-2">{u.department}</td>
                  <td className="px-4 py-2">{u.position}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => handleEditById(u.id)}
                      className="text-cyan-400 hover:text-cyan-200 text-sm font-bold px-3 py-1 rounded-xl border border-cyan-300/20"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-pink-400 hover:text-pink-300 text-sm font-bold px-3 py-1 rounded-xl border border-pink-300/20"
                    >
                      Удалить
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      <UserFormModal
        user={{
          ...form,
          birthDate: form.birthDate ?? '',
          internalPhone: form.internalPhone ?? '',
          middleName: form.middleName ?? '',
          role: form.role ?? 'user',
          floor: form.floor ?? '',
          cabinet: form.cabinet ?? '',
        }}
        onUpdate={handleUpdate}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditUserId(null);
          resetForm();
        }}
        showPasswordField={!editUserId}
        showTitle={true}
        isEdit={!!editUserId}
      />
    </div>
  );
}
