'use client';

import { useEffect, useRef } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
}

interface FormData {
  inventoryNumber: string;
  name: string;
  type: string;
  macAddress: string;
  ipAddress: string;
  login: string;
  password: string;
  location: string;
  floor: string;
  cabinet: string;
  assignedToUserId: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent, file?: File | null) => void;
  form: FormData;
  setForm: (data: FormData) => void;
  isEdit: boolean;
  users: User[];
}

export default function EquipmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isEdit,
  users,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => firstInputRef.current?.focus(), 150);
  }, [isOpen]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  if (!isOpen) return <div>Раздел в разработке</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    const file = fileInputRef.current?.files?.[0] || null;
    onSubmit(e, file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* blur-background */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[3px] transition-opacity duration-300"
        onClick={onClose}
        tabIndex={-1}
        aria-label="Закрыть модальное окно"
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-gradient-to-br from-[#19203a]/95 to-[#25324b]/95 border border-cyan-400/20
        p-7 md:p-10 w-full max-w-lg rounded-2xl shadow-2xl text-white space-y-8 mx-2 animate-fade-in"
        encType="multipart/form-data"
        onClick={e => e.stopPropagation()}
        tabIndex={0}
        aria-modal="true"
        role="dialog"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-5 text-cyan-200 hover:text-pink-400 text-2xl transition"
          aria-label="Закрыть"
        >✖</button>

        <h2 className="text-2xl font-bold mb-2 text-center select-none tracking-wide text-cyan-200">
          {isEdit ? '✏️ Редактировать оборудование' : '➕ Добавить оборудование'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            ref={firstInputRef}
            name="inventoryNumber"
            value={form.inventoryNumber}
            onChange={handleChange}
            placeholder="Инвентарный номер"
            required
            label="Инвентарный номер"
          />
          <InputField name="name" value={form.name} onChange={handleChange} placeholder="Название устройства" required label="Название" />
          <InputField name="type" value={form.type} onChange={handleChange} placeholder="Тип (ПК, принтер…)" required label="Тип" />
          <InputField
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Местоположение"
            label="Местоположение"
            required
            list="location-options"
          />
          <datalist id="location-options">
            <option value="Склад" />
            <option value="Кабинет" />
            <option value="В ремонте" />
          </datalist>
          <InputField name="floor" value={form.floor} onChange={handleChange} placeholder="Этаж" label="Этаж" />
          <InputField name="cabinet" value={form.cabinet} onChange={handleChange} placeholder="Кабинет" label="Кабинет" />
          <InputField name="macAddress" value={form.macAddress} onChange={handleChange} placeholder="MAC-адрес" label="MAC-адрес" />
          <InputField name="ipAddress" value={form.ipAddress} onChange={handleChange} placeholder="IP-адрес" label="IP-адрес" />
          <InputField name="login" value={form.login} onChange={handleChange} placeholder="Логин" label="Логин" />
          <InputField name="password" value={form.password} onChange={handleChange} placeholder="Пароль" label="Пароль" type="password" />
        </div>

        <div>
          <label htmlFor="assignedToUserId" className="block text-sm mb-1 text-cyan-200 font-medium">
            👤 Закрепить за пользователем:
          </label>
          <select
            name="assignedToUserId"
            id="assignedToUserId"
            value={form.assignedToUserId}
            onChange={handleChange}
            className="w-full p-3 bg-white/10 border border-cyan-200/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">— Не назначено —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.lastName} {u.firstName} {u.middleName ?? ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="file" className="block text-sm mb-1 text-cyan-200 font-medium">📎 Прикрепить файл:</label>
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            className="w-full p-3 bg-white/10 border border-cyan-200/20 rounded-xl text-white file:bg-cyan-400 file:text-[#15232c] file:font-semibold file:rounded-lg file:px-4 file:py-2 file:border-none focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" variant="accent">
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
}

// Универсальный InputField — удобно и красиво (с поддержкой label и ref)
type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};
const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { label, required, ...props },
  ref
) {
  return (
    <div>
      {label && (
        <label htmlFor={props.name} className="block text-sm text-cyan-200 mb-1 font-medium">
          {label}
          {required && <span className="text-pink-400">*</span>}
        </label>
      )}
      <input
        {...props}
        ref={ref}
        required={required}
        className="w-full p-3 bg-white/10 border border-cyan-200/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
      />
    </div>
  );
});
