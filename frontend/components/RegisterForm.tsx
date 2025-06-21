'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, User, Lock, Phone, Building2, Calendar, Hash } from 'lucide-react';

const departmentLabels: Record<string, string> = {
  AHO: 'Административно-хозяйственная часть',
  ADMIN: 'Администрация',
  STATIONAR: 'Дневной стационар',
  GYN: 'Женская консультация',
  INFECT: 'Кабинет врача-инфекциониста',
  GP: 'Кабинет врача общей практики',
  OPHTHALMO: 'Кабинет врача-офтальмолога',
  ENT: 'Кабинет врачей-оториноларингологов',
  NURSE: 'Кабинет доврачебной помощи',
  EMERGENCY: 'Кабинет неотложной медицинской помощи',
  UZI: 'Кабинет ультразвуковой диагностики',
  STATISTICS: 'Кабинет учета и медицинской статистики',
  DIABET_SCHOOL: 'Кабинет "Школа для пациентов с сахарным диабетом"',
  ENDOSCOPY: 'Кабинет эндоскопии',
  LAB: 'Клинико-диагностическая лаборатория',
  VOENKOM: 'Медицинская комиссия при Райвоенкомате',
  ELDERLY: 'Помощь пожилым и инвалидам',
  PREVENTION: 'Отделение медицинской профилактики',
  PAID: 'Платные медицинские услуги',
  FUNCTIONAL: 'Функциональная диагностика',
  VACCINATION: 'Прививочный кабинет',
  PROCEDURE: 'Процедурный кабинет',
  REGISTRY: 'Регистратура',
  XRAY: 'Рентгеновское отделение',
  THERAPY_1: 'Терапевтическое отделение №1',
  THERAPY_2: 'Терапевтическое отделение №2',
  THERAPY_3: 'Терапевтическое отделение №3',
  THERAPY_4: 'Терапевтическое отделение №4',
  THERAPY_5: 'Терапевтическое отделение №5',
  PHYSIOTHERAPY: 'Физиотерапевтическое отделение',
  SURGERY: 'Хирургическое отделение',
  STERILIZATION: 'Централизованная стерилизационная',
  HEALTH_CENTER: 'Центр здоровья',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const inputStyle =
    'bg-white/20 backdrop-blur-md px-12 py-4 pr-4 min-w-0 rounded-2xl text-white text-lg placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-lg transition w-full disabled:bg-gray-200/10 disabled:opacity-60 relative';

  const selectStyle =
    'bg-[#1e293b] border border-cyan-400/10 focus:border-cyan-400 text-white text-lg py-4 px-6 rounded-2xl w-full shadow-lg focus:ring-2 focus:ring-cyan-400/50 transition placeholder-white/70 appearance-none';

  const IconInput = ({ icon, ...props }: any) => (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300">
        {icon}
      </div>
      <input {...props} className={inputStyle} />
    </div>
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const user = {
      snils: formData.get('snils'),
      password: formData.get('password'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      middleName: formData.get('middleName'),
      birthDate: formData.get('birthDate'),
      mobilePhone: formData.get('mobilePhone'),
      internalPhone: formData.get('internalPhone'),
      position: formData.get('position'),
      department: formData.get('department'),
      floor: formData.get('floor'),
      cabinet: formData.get('cabinet'),
    };

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка при регистрации');
      }

      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ snils: user.snils, password: user.password }),
      });

      if (!loginRes.ok) {
        throw new Error('Регистрация прошла, но вход не удался');
      }

      const loginData = await loginRes.json();
      if (!loginData.access_token || !loginData.role) {
        throw new Error('Не удалось получить токен после регистрации');
      }

      localStorage.setItem('token', loginData.access_token);
      const role = loginData.role.toUpperCase();
      localStorage.setItem('role', role);

      alert('\uD83D\uDD17 Чтобы получать уведомления в Telegram — нажмите: \"Написать боту\"');
      window.open('https://t.me/it_otdel_bot', '_blank');

      let destination = '/dashboard';
      if (role === 'ADMIN') destination = '/admin';
      else if (role === 'SUPERUSER') destination = '/superadmin';

      router.push(destination);
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации или входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-7 bg-gradient-to-br from-[#172a42]/90 to-[#23304f]/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-3xl mx-auto border border-cyan-400/15"
    >
      <motion.h2
        className="text-3xl font-bold text-center text-white mb-4 tracking-tight"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Регистрация нового сотрудника
      </motion.h2>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-pink-500/90 to-red-500/80 px-4 py-3 rounded-lg text-base text-white text-center shadow-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <IconInput name="snils" type="text" placeholder="СНИЛС" required disabled={loading} icon={<Hash size={20} />} />
        <IconInput name="password" type="password" placeholder="Пароль" required disabled={loading} icon={<Lock size={20} />} />
        <IconInput name="lastName" type="text" placeholder="Фамилия" required disabled={loading} icon={<User size={20} />} />
        <IconInput name="firstName" type="text" placeholder="Имя" required disabled={loading} icon={<User size={20} />} />
        <IconInput name="middleName" type="text" placeholder="Отчество" disabled={loading} icon={<User size={20} />} />
        <IconInput name="birthDate" type="date" required disabled={loading} icon={<Calendar size={20} />} />

        <div className="col-span-1">
          <IconInput name="mobilePhone" type="tel" placeholder="Мобильный телефон" required disabled={loading} icon={<Phone size={20} />} />
          <p className="text-sm text-cyan-100 opacity-80 mt-1 ml-1">
            Этот номер будет использоваться для уведомлений через Telegram-бота.
          </p>
        </div>

        <IconInput name="internalPhone" type="text" placeholder="Внутренний номер" required disabled={loading} icon={<Phone size={20} />} />
        <IconInput name="position" type="text" placeholder="Должность" required disabled={loading} icon={<Building2 size={20} />} />
        <div className="relative w-full">
          <select
            name="department"
            required
            className={selectStyle}
            disabled={loading}
            defaultValue=""
            style={{ background: '#1e293b', color: 'white' }}
          >
            <option value="" disabled className="text-gray-400 bg-[#232f47]">
              Выберите отдел
            </option>
            {Object.entries(departmentLabels).map(([value, label]) => (
              <option key={value} value={value} className="bg-[#232f47] text-white">
                {label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-cyan-200 text-xl">▼</span>
        </div>
        <IconInput name="floor" type="text" placeholder="Этаж" disabled={loading} icon={<Building2 size={20} />} />
        <IconInput name="cabinet" type="text" placeholder="Кабинет" disabled={loading} icon={<Building2 size={20} />} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 transition text-[#15171c] font-bold py-4 rounded-2xl shadow-lg active:scale-95 duration-100 mt-3 text-lg"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-6 h-6" />
            Регистрация...
          </>
        ) : (
          'Зарегистрироваться'
        )}
      </button>
    </form>
  );
}
