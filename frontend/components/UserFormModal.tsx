'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';

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

const ROLE_OPTIONS = [
  { value: 'user', label: 'Пользователь' },
  { value: 'admin', label: 'Администратор' },
  { value: 'superuser', label: 'Суперадмин' },
];

export interface UserForm {
  firstName: string;
  lastName: string;
  middleName: string;
  department: string;
  mobilePhone: string;
  internalPhone: string;
  position: string;
  floor: string;
  cabinet: string;
  password?: string;
  role: string;
  snils: string;
  birthDate: string;
}

interface UserFormModalProps {
  user: UserForm;
  onUpdate: (user: UserForm) => void | Promise<void>;
  isOpen?: boolean;
  onClose?: () => void;
  showPasswordField?: boolean; // для создания true, для редактирования — false
  showTitle?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

// Форматирование СНИЛС
function formatSnils(input: string): string {
  let numbers = input.replace(/\D/g, '').slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 9)} ${numbers.slice(9, 11)}`;
}

// Маска телефона (UI)
function formatPhone(input: string): string {
  let onlyNums = input.replace(/\D/g, '');
  if (onlyNums.startsWith('8')) onlyNums = '7' + onlyNums.slice(1);
  else if (!onlyNums.startsWith('7')) onlyNums = '7' + onlyNums;
  onlyNums = onlyNums.slice(0, 11);
  return new AsYouType('RU').input('+' + onlyNums);
}

// Очистка перед API
function prepareDataForApi(data: UserForm): UserForm {
  return {
    ...data,
    mobilePhone: '+' + data.mobilePhone.replace(/\D/g, '').replace(/^7/, '7'),
    snils: data.snils.replace(/\D/g, '').slice(0, 11),
    internalPhone: typeof data.internalPhone === "string" ? data.internalPhone : "",
    birthDate: data.birthDate || '',
    middleName: data.middleName ?? '',
    role: data.role ?? 'user',
    floor: data.floor ?? '',
    cabinet: data.cabinet ?? '',
    password: data.password ?? '', // Всегда строка (пустая если не меняется)
  };
}

// Все поля string!
function cleanUserForm(obj: Partial<UserForm> | undefined): UserForm {
  return {
    firstName: obj?.firstName ?? '',
    lastName: obj?.lastName ?? '',
    middleName: obj?.middleName ?? '',
    department: obj?.department ?? '',
    mobilePhone: obj?.mobilePhone ?? '',
    internalPhone: typeof obj?.internalPhone === 'string' ? obj.internalPhone : '',
    position: obj?.position ?? '',
    floor: obj?.floor ?? '',
    cabinet: obj?.cabinet ?? '',
    password: '', // Никогда не показываем старый пароль!
    role: obj?.role ?? 'user',
    snils: obj?.snils ?? '',
    birthDate: obj?.birthDate ? obj.birthDate.slice(0, 10) : '',
  };
}

export default function UserFormModal({
  user,
  onUpdate,
  isOpen = true,
  onClose,
  showPasswordField = false,
  showTitle = true,
  isEdit = true,
  onCancel,
}: UserFormModalProps) {
  const [formData, setFormData] = useState<UserForm>(cleanUserForm(user));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(cleanUserForm(user));
    setError(null);
    setSuccess(false);
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 150);
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'snils') {
      setFormData((prev) => ({ ...prev, snils: formatSnils(value) }));
    } else if (name === 'mobilePhone') {
      setFormData((prev) => ({ ...prev, mobilePhone: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value ?? '' }));
    }
  };

  const handleReset = () => {
    setFormData(cleanUserForm(user));
    setError(null);
    setSuccess(false);
    if (firstInputRef.current) firstInputRef.current.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setLoading(true);
    try {
      const apiData = prepareDataForApi(formData);

      if (!apiData.lastName) {
        setError('Фамилия обязательна');
        setLoading(false);
        return;
      }
      if (!apiData.firstName) {
        setError('Имя обязательно');
        setLoading(false);
        return;
      }
      if (!isEdit && (!apiData.password || apiData.password.length < 6)) {
        setError('Пароль обязателен и минимум 6 символов');
        setLoading(false);
        return;
      }
      if (isEdit && apiData.password && apiData.password.length < 6) {
        setError('Пароль должен быть минимум 6 символов');
        setLoading(false);
        return;
      }
      if (!apiData.snils || apiData.snils.length !== 11) {
        setError('СНИЛС должен содержать 11 цифр');
        setLoading(false);
        return;
      }
      if (!isValidPhoneNumber(apiData.mobilePhone, 'RU')) {
        setError('Мобильный должен быть в формате +7XXXXXXXXXX');
        setLoading(false);
        return;
      }
      if (typeof apiData.internalPhone !== "string") {
        setError('Внутренний номер должен быть строкой (пусть даже пустой)');
        setLoading(false);
        return;
      }
      if (!apiData.department) {
        setError('Отдел обязателен');
        setLoading(false);
        return;
      }
      if (!apiData.position) {
        setError('Должность обязательна');
        setLoading(false);
        return;
      }
      if (!apiData.birthDate) {
        setError('Дата рождения обязательна');
        setLoading(false);
        return;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(apiData.birthDate)) {
        setError('Дата рождения должна быть в формате ГГГГ-ММ-ДД');
        setLoading(false);
        return;
      }

      // Если редактируем — если поле пароля пустое, не отправляем его (оно не будет изменено)
      if (isEdit && !apiData.password) delete apiData.password;

      await onUpdate(apiData);
      setSuccess(true);
      if (onClose) setTimeout(onClose, 700);
    } catch (err) {
      setError('Ошибка при отправке формы');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return <div>Раздел в разработке</div>;

  return (
    <div className={onClose ? "fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in" : ""}>
      <form
        onSubmit={handleSubmit}
        className="relative bg-gradient-to-br from-[#1b2438]/90 via-[#25304a]/80 to-[#192234]/90 border border-cyan-400/20 text-white rounded-2xl p-6 md:p-10 w-full max-w-md md:max-w-2xl space-y-7 shadow-2xl mx-auto animate-fade-in"
        autoComplete="off"
        style={{ minWidth: 320 }}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-6 text-cyan-200 hover:text-pink-400 text-2xl"
            aria-label="Закрыть"
          >
            ✖
          </button>
        )}

        {showTitle && (
          <h2 className="text-2xl font-bold text-cyan-200 text-center mb-2 drop-shadow">
            {isEdit ? 'Редактировать профиль' : 'Добавить пользователя'}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Фамилия"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Иванов"
            inputRef={firstInputRef}
          />
          <Input label="Имя" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Иван" />
          <Input label="Отчество" name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Петрович" />
          <Input label="Должность" name="position" value={formData.position} onChange={handleChange} required placeholder="Инженер" />

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-cyan-200 mb-1">Отдел</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-cyan-200/10 bg-[#232b39] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            >
              <option value="">Выберите отдел...</option>
              {Object.entries(departmentLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <Input
            label="СНИЛС"
            name="snils"
            value={formData.snils}
            onChange={handleChange}
            required
            placeholder="123-456-789 01"
            inputMode="numeric"
            maxLength={14}
          />

          <Input
            label="Мобильный"
            name="mobilePhone"
            value={formData.mobilePhone}
            onChange={handleChange}
            required
            placeholder="+7 (___) ___-__-__"
            inputMode="tel"
            maxLength={18}
          />

          <Input
            label="Внутренний"
            name="internalPhone"
            value={formData.internalPhone}
            onChange={handleChange}
            required
            placeholder="1234"
          />

          <Input
            label="Дата рождения"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Этаж" name="floor" value={formData.floor || ''} onChange={handleChange} placeholder="2" inputMode="numeric" />
          <Input label="Кабинет" name="cabinet" value={formData.cabinet || ''} onChange={handleChange} placeholder="204" inputMode="numeric" />
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-cyan-200 mb-1">Роль</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-cyan-200/10 bg-[#232b39] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            >
              <option value="">Выберите...</option>
              {ROLE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {/* Поле для пароля — показывается всегда при создании, и при редактировании, если пользователь желает сменить пароль */}
          <Input
            label={isEdit ? "Новый пароль (если нужно сменить)" : "Пароль"}
            name="password"
            value={formData.password ?? ''}
            onChange={handleChange}
            required={!isEdit} // обязательно только при создании!
            placeholder={isEdit ? "Оставьте пустым, чтобы не менять" : "Установить пароль"}
            type="password"
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-[#15202b] font-bold py-2 px-4 rounded-xl shadow-lg transition"
          >
            {loading ? (isEdit ? 'Сохранение...' : 'Создание...') : (isEdit ? '💾 Сохранить' : '➕ Создать')}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="flex-0 bg-gray-700 hover:bg-gray-600 text-cyan-200 px-4 py-2 rounded-xl transition"
          >
            Сбросить
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
            >
              Отмена
            </button>
          )}
        </div>

        {success && <p className="text-green-400 text-center text-sm mt-2 animate-pulse">{isEdit ? '✔ Изменения сохранены' : '✔ Пользователь создан'}</p>}
        {error && <p className="text-pink-400 text-center text-sm mt-2">❌ {error}</p>}
      </form>
    </div>
  );
}

// Универсальный input
function Input({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  inputRef,
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  inputRef?: React.Ref<HTMLInputElement>;
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-cyan-200 mb-1">
        {label}
      </label>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        className="w-full p-3 rounded-xl bg-white/10 border border-cyan-200/10 text-white placeholder-cyan-100/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
      />
    </div>
  );
}
