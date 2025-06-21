'use client';

import { useEffect, useState } from 'react';

interface User {
  firstName: string;
  lastName: string;
  middleName?: string;
  department?: string;
  mobilePhone?: string;
  internalPhone?: string;
  position?: string;
  floor?: string;
  cabinet?: string;
}

interface UserEditFormProps {
  user: User;
  onUpdate: (user: User) => void;
  isOpen?: boolean;      // Если нужен режим модалки
  onClose?: () => void;  // Если нужен режим модалки
}

export default function UserEditForm({ user, onUpdate, isOpen = true, onClose }: UserEditFormProps) {
  const [formData, setFormData] = useState<User>({ ...user });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({ ...user });
    setSuccess(false);
    setError(null);
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({ ...user });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/users/update-profile`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error('Ошибка при обновлении профиля');

      const updatedUser = await res.json();
      onUpdate(updatedUser);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Если режим модального окна и не isOpen — не рендерим ничего
  if (isOpen === false) return <div>Раздел в разработке</div>;

  return (
    <div className={onClose ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in' : ''}>
      <form
        onSubmit={handleSubmit}
        className="
          relative
          bg-gradient-to-br from-[#19273d]/90 via-[#243658]/90 to-[#17243a]/90
          border border-cyan-400/20 text-white rounded-2xl p-8 w-full max-w-md
          space-y-5 shadow-2xl mx-auto animate-fade-in
        "
        style={{ minWidth: 280 }}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-6 text-cyan-200 hover:text-pink-400 text-2xl"
            aria-label="Закрыть"
          >
            ✖
          </button>
        )}
        <h2 className="text-2xl font-bold text-cyan-200 text-center mb-3 drop-shadow">Редактировать профиль</h2>

        <div className="space-y-3">
          <Input label="Фамилия" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Иванов" />
          <Input label="Имя" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Иван" />
          <Input label="Отчество" name="middleName" value={formData.middleName || ''} onChange={handleChange} placeholder="Петрович" />
          <Input label="Отдел" name="department" value={formData.department || ''} onChange={handleChange} placeholder="Технический отдел" />
          <Input label="Должность" name="position" value={formData.position || ''} onChange={handleChange} placeholder="Инженер" />
          <Input label="Мобильный" name="mobilePhone" value={formData.mobilePhone || ''} onChange={handleChange} placeholder="+7 (___) ___-__-__" />
          <Input label="Внутренний" name="internalPhone" value={formData.internalPhone || ''} onChange={handleChange} placeholder="1234" />
          <Input label="Этаж" name="floor" value={formData.floor || ''} onChange={handleChange} placeholder="2" />
          <Input label="Кабинет" name="cabinet" value={formData.cabinet || ''} onChange={handleChange} placeholder="204" />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-[#15202b] font-bold py-2 px-4 rounded-xl shadow-lg transition"
          >
            {loading ? 'Сохранение...' : '💾 Сохранить'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="flex-0 bg-gray-700 hover:bg-gray-600 text-cyan-200 px-4 py-2 rounded-xl transition"
          >
            Сбросить
          </button>
        </div>

        {success && <p className="text-green-400 text-center text-sm mt-2">✔ Изменения сохранены</p>}
        {error && <p className="text-pink-400 text-center text-sm mt-2">❌ {error}</p>}
      </form>
    </div>
  );
}

// Универсальный input с лейблом
function Input({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-cyan-200 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full p-3 rounded-xl bg-white/10 border border-cyan-200/10 text-white placeholder-cyan-100/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
      />
    </div>
  );
}
