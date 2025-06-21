'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import AdminNavbar from '@/components/AdminNavbar';
import SoftwareFormModal from '@/components/SoftwareFormModal';
import SoftwareDetailsCard from '@/components/SoftwareDetailsCard';
import UserDetailsCard from '@/components/UserDetailsCard';
import toast from 'react-hot-toast';
import { SoftwareDetails, SoftwareFormData } from '@/types/software';
import { UserDetails } from '@/types/user';
import { Equipment, EquipmentDetails } from '@/types/equipment';

export default function AdminSoftwarePage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const [softwareList, setSoftwareList] = useState<SoftwareDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSoftware, setEditingSoftware] = useState<SoftwareDetails | null>(null);
  const [viewingSoftware, setViewingSoftware] = useState<SoftwareDetails | null>(null);
  const [viewingUser, setViewingUser] = useState<UserDetails | null>(null);
  const [viewingEquipment, setViewingEquipment] = useState<EquipmentDetails | null>(null);
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [equipment, setEquipment] = useState<EquipmentDetails[]>([]);

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
      }
    } catch {
      toast.error('Ошибка токена');
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    fetchSoftware();
    fetchUsersAndEquipment();
  }, []);

  const fetchSoftware = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/software`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSoftwareList(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Ошибка загрузки списка ПО');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersAndEquipment = async () => {
    try {
      const [usersRes, equipmentRes] = await Promise.all([
        fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/equipment`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(await usersRes.json());
      setEquipment(await equipmentRes.json());
    } catch {
      toast.error('Ошибка загрузки пользователей и оборудования');
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent, data: Partial<SoftwareFormData>) => {
    e.preventDefault();
    const isEdit = Boolean(editingSoftware);
    const url = isEdit
      ? `${API_URL}/software/${editingSoftware!.id}`
      : `${API_URL}/software`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const { fileUrls, ...cleanedData } = data;

      ['purchaseDate', 'supportStart', 'supportEnd', 'expiryDate'].forEach((key) => {
        const val = (cleanedData as any)[key];
        if (!val || String(val).trim() === '') {
          delete (cleanedData as any)[key];
        } else {
          (cleanedData as any)[key] = new Date(val).toISOString();
        }
      });

      if (isEdit) {
        ['users', 'equipment', 'fileUrls'].forEach((key) => {
          delete (cleanedData as any)[key];
        });
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      if (res.ok) {
        await fetchSoftware();
        setIsModalOpen(false);
        setEditingSoftware(null);
        toast.success(isEdit ? 'ПО обновлено' : 'ПО добавлено');
      } else {
        toast.error('Ошибка при сохранении');
      }
    } catch {
      toast.error('Ошибка сети при сохранении ПО');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить это ПО?')) return;
    try {
      const res = await fetch(`${API_URL}/software/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        await fetchSoftware();
        toast.success('ПО удалено');
      } else {
        toast.error('Ошибка при удалении ПО');
      }
    } catch {
      toast.error('Ошибка сети при удалении ПО');
    }
  };

  const handleUserClick = (user: any) => {
    const safeUser: UserDetails = {
      id: user.id,
      firstName: user.firstName ?? '—',
      lastName: user.lastName ?? '—',
      middleName: user.middleName ?? '',
      birthDate: user.birthDate ?? '—',
      snils: user.snils ?? '—',
      mobilePhone: user.mobilePhone ?? '—',
      internalPhone: user.internalPhone ?? '—',
      role: user.role ?? 'user',
      position: user.position ?? '—',
      department: user.department ?? '—',
      floor: user.floor ?? '',
      cabinet: user.cabinet ?? '',
    };
    setViewingUser(safeUser);
  };

  const handleEquipmentClick = (equipmentItem: Equipment) => {
    const detailed = equipment.find(e => e.id === equipmentItem.id);
    if (detailed) setViewingEquipment(detailed);
  };

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white pt-20 px-3 md:px-10 py-10 space-y-10">
      <AdminNavbar />

      {/* Оформление блока и кнопки как у оборудования */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 mt-10">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-200">
          💽 Управление программным обеспечением
        </h1>
        <button
          onClick={() => {
            setEditingSoftware(null);
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-[#191b25] font-bold rounded-2xl shadow-xl border border-cyan-200/40 transition-all"
        >
          ➕ Добавить ПО
        </button>
      </div>

      {viewingSoftware && (
        <div className="mb-6">
          <SoftwareDetailsCard
            software={viewingSoftware}
            onClose={() => setViewingSoftware(null)}
            onUserClick={(userId) => {
              const user = users.find(u => u.id === userId);
              if (user) handleUserClick(user);
            }}
            onEquipmentClick={(eqId) => {
              const eq = equipment.find(e => e.id === eqId);
              if (eq) handleEquipmentClick(eq);
            }}
          />
        </div>
      )}

      {viewingUser && (
        <div className="mb-6">
          <UserDetailsCard details={viewingUser} onClose={() => setViewingUser(null)} />
        </div>
      )}

      {viewingEquipment && (
        <div className="mb-6 bg-gray-800 p-4 rounded">
          <h3 className="text-xl font-bold">{viewingEquipment.name}</h3>
          <p>Инв. номер: {viewingEquipment.inventoryNumber}</p>
          <p>Тип: {viewingEquipment.type}</p>
          <p>IP: {viewingEquipment.ipAddress || '—'}</p>
          <p>MAC: {viewingEquipment.macAddress || '—'}</p>
          <p>Локация: {viewingEquipment.location}</p>
          <p>Этаж: {viewingEquipment.floor || '—'}</p>
          <p>Кабинет: {viewingEquipment.cabinet || '—'}</p>
          <button className="text-blue-500 hover:underline mt-2" onClick={() => setViewingEquipment(null)}>
            Закрыть
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-cyan-400/10 bg-white/5 shadow-2xl">
        <table className="min-w-full text-sm text-left text-white/90">
          <thead className="bg-cyan-900/60 text-cyan-100/70">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Версия</th>
              <th className="px-4 py-3">Лицензия</th>
              <th className="px-4 py-3">Адрес</th>
              <th className="px-4 py-3">Пользователь</th>
              <th className="px-4 py-3">Оборудование</th>
              <th className="px-4 py-3">Срок лицензии</th>
              <th className="px-4 py-3">Поддержка</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-white/50">Загрузка ПО...</td>
              </tr>
            ) : softwareList.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-white/50">ПО не найдено</td>
              </tr>
            ) : (
              softwareList.map((sw) => (
                <tr key={sw.id} className="border-t border-cyan-400/10 hover:bg-cyan-800/10 transition">
                  <td className="px-4 py-2 text-cyan-300 hover:underline cursor-pointer" onClick={() => setViewingSoftware(sw)}>{sw.name}</td>
                  <td className="px-4 py-2">{sw.version || '—'}</td>
                  <td className="px-4 py-2">{sw.licenseKey || '—'}</td>
                  <td className="px-4 py-2">{sw.networkAddress || '—'}</td>
                  <td className="px-4 py-2">
                    {sw.users?.length ? sw.users.map((u, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        <span className="text-cyan-300 hover:underline cursor-pointer" onClick={() => handleUserClick(u)}>
                          {u.lastName} {u.firstName}
                        </span>
                      </span>
                    )) : '—'}
                  </td>
                  <td className="px-4 py-2">
                    {sw.equipment?.length ? sw.equipment.map((e, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        <span className="text-cyan-300 hover:underline cursor-pointer" onClick={() => handleEquipmentClick(e)}>
                          {e.name}
                        </span>
                      </span>
                    )) : '—'}
                  </td>
                  <td className="px-4 py-2">{formatDate(sw.expiryDate)}</td>
                  <td className="px-4 py-2">
                    {sw.supportStart && sw.supportEnd
                      ? `${formatDate(sw.supportStart)} — ${formatDate(sw.supportEnd)}`
                      : '—'}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button onClick={() => { setEditingSoftware(sw); setIsModalOpen(true); }} className="text-cyan-400 hover:text-cyan-200 text-sm font-bold px-3 py-1 rounded-xl border border-cyan-300/20">
                      Редактировать
                    </button>
                    <button onClick={() => handleDelete(sw.id)} className="text-pink-400 hover:text-pink-300 text-sm font-bold px-3 py-1 rounded-xl border border-pink-300/20">
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SoftwareFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSoftware(null);
          fetchSoftware();
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingSoftware ? { ...editingSoftware, fileUrls: undefined } : undefined}
        users={users}
        equipment={equipment}
      />
    </div>
  );
}
