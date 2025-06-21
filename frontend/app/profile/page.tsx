'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ProfileEditPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    mobilePhone: '',
    internalPhone: '',
    position: '',
  });
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!token) return router.push('/login');
    fetch(`${API_URL}/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          middleName: data.middleName || '',
          mobilePhone: data.mobilePhone || '',
          internalPhone: data.internalPhone || '',
          position: data.position || '',
        });
      })
      .catch(() => router.push('/login'));
  }, [token]);

  const handleSubmit = async () => {
    if (!token) return;
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('Профиль обновлён');
    } else {
      toast.error('Не удалось сохранить изменения');
    }
  };

  return (
    <div className="min-h-screen bg-[#1b2232] text-white p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Редактирование профиля</h1>
      <div className="space-y-3 max-w-md">
        <input className="w-full p-2 rounded bg-gray-800" placeholder="Фамилия" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        <input className="w-full p-2 rounded bg-gray-800" placeholder="Имя" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input className="w-full p-2 rounded bg-gray-800" placeholder="Отчество" value={form.middleName} onChange={e => setForm({ ...form, middleName: e.target.value })} />
        <input className="w-full p-2 rounded bg-gray-800" placeholder="Мобильный" value={form.mobilePhone} onChange={e => setForm({ ...form, mobilePhone: e.target.value })} />
        <input className="w-full p-2 rounded bg-gray-800" placeholder="Внутренний телефон" value={form.internalPhone} onChange={e => setForm({ ...form, internalPhone: e.target.value })} />
        <input className="w-full p-2 rounded bg-gray-800" placeholder="Должность" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
        <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-cyan-400 text-[#101622] rounded">Сохранить</button>
      </div>
    </div>
  );
}
