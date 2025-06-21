"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import {
  User,
  Phone,
  Building2,
  CalendarDays,
  Edit2,
  QrCode,
  UploadCloud,
  Clock4
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';

const departmentLabels: Record<string, string> = {
  AHO: 'Административно-хозяйственная часть',
  ADMIN: 'Администрация',
  STATIONAR: 'Дневной стационар',
  HEALTH_CENTER: 'Центр здоровья'
  // ... остальные отделы
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const qrRef = useRef<HTMLDivElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!token) return router.push('/login');
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded?.sub) router.push('/login');
    } catch {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) return router.push('/login');
        const data = await res.json();
        setUser(data);
        setAvatarUrl(data.avatarUrl || '/placeholder-avatar.png');
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(`${API_URL}/users/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setAvatarUrl(data.avatarUrl);
        toast.success('Аватар обновлён');
      } else {
        toast.error('Не удалось загрузить аватар');
      }
    } catch {
      toast.error('Ошибка при загрузке');
    }
  };

  const handleDownloadQR = async () => {
    if (!qrRef.current) return;
    const canvas = await html2canvas(qrRef.current);
    const link = document.createElement('a');
    link.download = 'profile-qr.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#12161f] to-[#182439] text-white flex justify-center items-center">
        <span className="text-cyan-200 text-xl">Загрузка...</span>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#12161f] to-[#182439] text-white flex justify-center items-center">
        <span className="text-pink-400">Ошибка загрузки профиля</span>
      </div>
    );

  const fullName = [user.lastName, user.firstName, user.middleName].filter(Boolean).join(' ');
  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${user.id}`;

  return (
    <>
      <Toaster />
      <Navbar user={user} currentPage="profile" />
      <div className="min-h-screen bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white px-3 md:px-10 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="flex flex-col items-center mb-14">
            <div className="relative w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden border-4 border-cyan-400/80 shadow-2xl bg-white/10 backdrop-blur">
              <img
                src={avatarUrl}
                alt="Аватар"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-cyan-400 hover:bg-cyan-300 p-2 rounded-full shadow-md border-2 border-white/70 transition"
                title="Загрузить новый аватар"
              >
                <UploadCloud className="w-5 h-5 text-white" />
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-200 drop-shadow mb-1">{fullName}</h1>
            <p className="text-cyan-100/70 mt-1 text-lg text-center">
              {user.position || '—'} • {departmentLabels[user.department] || user.department || '—'}
            </p>
          </div>

          {/* Info cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard label="Дата рождения" icon={<CalendarDays className="w-5 h-5 text-cyan-300" />}>
              {user.birthDate ? new Date(user.birthDate).toLocaleDateString('ru-RU') : '—'}
            </InfoCard>
            <InfoCard label="Мобильный" icon={<Phone className="w-5 h-5 text-cyan-300" />}>
              {user.mobilePhone || '—'}
            </InfoCard>
            <InfoCard label="Кабинет" icon={<Building2 className="w-5 h-5 text-cyan-300" />}>
              {user.cabinet || '—'} • Этаж {user.floor || '—'}
            </InfoCard>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <InfoCard label="СНИЛС" icon={<User className="w-5 h-5 text-cyan-300" />}>
              {user.snils || '—'}
            </InfoCard>
            <InfoCard label="Внутренний телефон" icon={<Phone className="w-5 h-5 text-cyan-300" />}>
              {user.internalPhone || '—'}
            </InfoCard>
          </div>

          {/* Last login */}
          <div className="mt-10 bg-white/10 border border-cyan-200/10 rounded-2xl p-5 shadow-xl text-center max-w-md mx-auto">
            <p className="text-sm text-cyan-100/60 flex items-center gap-2 justify-center mb-2">
              <Clock4 className="w-5 h-5 text-cyan-300" /> Последний вход
            </p>
            <p className="text-lg text-white/80">
              {user.lastLogin
                ? new Date(user.lastLogin).toLocaleString('ru-RU')
                : 'нет данных'}
              {user.lastLoginIp && (
                <span className="ml-2 text-cyan-100/50">(IP: {user.lastLoginIp})</span>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-10 text-center flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => router.push('/profile')}
              className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-[#101622] px-6 py-2 rounded-2xl font-bold shadow transition"
            >
              <Edit2 className="w-5 h-5" /> Изменить профиль
            </button>
            <button
              onClick={() => setShowQR(!showQR)}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-cyan-400/20 text-cyan-100 px-6 py-2 rounded-2xl font-semibold shadow border border-cyan-300/10 transition"
            >
              <QrCode className="w-5 h-5" /> QR-код
            </button>
          </div>

          {/* QR Modal */}
          {showQR && (
            <div className="mt-8 flex flex-col items-center gap-2" ref={qrRef}>
              <div className="bg-white/5 p-4 rounded-2xl border border-cyan-300/20">
                <QRCode
                  value={profileUrl}
                  size={160}
                  fgColor="#22d3ee"
                  bgColor="#1a2130"
                />
              </div>
              <button
                onClick={handleDownloadQR}
                className="text-sm text-cyan-300 hover:underline mt-2"
              >
                Скачать QR-код
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InfoCard({
  label,
  icon,
  children
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/10 border border-cyan-200/10 rounded-2xl p-5 shadow flex flex-col gap-2">
      <p className="text-sm text-cyan-100/70 flex items-center gap-2">
        {icon}
        {label}
      </p>
      <p className="text-lg text-white/90">{children}</p>
    </div>
  );
}
