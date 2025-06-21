'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { SoftwareFormData } from '@/types/software';
import { User } from '@/types/user';
import { Equipment } from '@/types/equipment';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent, data: SoftwareFormData) => void;
  initialData?: Partial<SoftwareFormData & { id?: number }>;
  users: User[];
  equipment: Equipment[];
}

const emptyForm: SoftwareFormData = {
  name: '',
  version: '',
  licenseKey: '',
  licensedTo: '',
  adminLogin: '',
  adminPassword: '',
  networkAddress: '',
  installLocation: '',
  purchaseDate: '',
  supportStart: '',
  supportEnd: '',
  expiryDate: '',
  fileUrls: [],
  assignedUserId: undefined,
  equipmentIds: [],
};

export default function SoftwareFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  users,
  equipment,
}: Props) {
  const [form, setForm] = useState<SoftwareFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setForm(emptyForm);
    setSubmitting(false);
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        purchaseDate: initialData.purchaseDate?.slice(0, 10) || '',
        supportStart: initialData.supportStart?.slice(0, 10) || '',
        supportEnd: initialData.supportEnd?.slice(0, 10) || '',
        expiryDate: initialData.expiryDate?.slice(0, 10) || '',
      });
    } else {
      resetForm();
    }
  }, [initialData]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setForm((prev) => ({
        ...prev,
        fileUrls: Array.from(files),
      }));
    }
  };

  if (!isOpen) return <div>Раздел в разработке</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* blur-background */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity duration-300" onClick={onClose} />
      <div className="relative z-10 bg-gradient-to-br from-[#18243b]/95 via-[#25304a]/90 to-[#16202e]/95 border border-cyan-400/15 text-white rounded-2xl p-8 md:p-10 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[92vh] animate-fade-in">
        <h2 className="text-2xl font-bold mb-7 text-cyan-200 text-center select-none tracking-wide">
          {initialData?.id ? '✏️ Редактировать ПО' : '➕ Добавить ПО'}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim()) return;
            setSubmitting(true);
            onSubmit(e, form);
          }}
          className="space-y-6"
        >
          {/* Текстовые поля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Название ПО *', key: 'name', required: true },
              { label: 'Версия', key: 'version' },
              { label: 'Лицензионный ключ', key: 'licenseKey' },
              { label: 'Поставщик', key: 'licensedTo' },
              { label: 'Логин администратора', key: 'adminLogin' },
              { label: 'Пароль администратора', key: 'adminPassword', type: 'password' },
              { label: 'Сетевой адрес (IP/URL)', key: 'networkAddress' },
              { label: 'Место установки', key: 'installLocation' },
            ].map(({ label, key, required, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-cyan-200 mb-1">{label}</label>
                <input
                  type={type || 'text'}
                  value={(form[key as keyof SoftwareFormData] as string) || ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-white/10 border border-cyan-200/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  required={required}
                />
              </div>
            ))}
          </div>

          {/* Даты */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Дата покупки', key: 'purchaseDate' },
              { label: 'Начало поддержки', key: 'supportStart' },
              { label: 'Конец поддержки', key: 'supportEnd' },
              { label: 'Окончание лицензии', key: 'expiryDate' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-cyan-200 mb-1">{label}</label>
                <input
                  type="date"
                  value={(form[key as keyof SoftwareFormData] as string) || ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-white/10 border border-cyan-200/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
              </div>
            ))}
          </div>

          {/* Пользователь */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-1">Закреплённый пользователь</label>
            <select
              value={form.assignedUserId?.toString() || ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  assignedUserId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full p-3 rounded-xl bg-white/10 border border-cyan-200/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">— Не выбрано —</option>
              {users
                .sort((a, b) => a.lastName.localeCompare(b.lastName))
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.lastName} {u.firstName} {u.middleName || ''}
                  </option>
                ))}
            </select>
          </div>

          {/* Оборудование */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-1">Оборудование</label>
            <div className="space-y-2">
              <select
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  if (selectedId && !form.equipmentIds?.includes(selectedId)) {
                    setForm((prev) => ({
                      ...prev,
                      equipmentIds: [...(prev.equipmentIds || []), selectedId],
                    }));
                  }
                }}
                className="w-full p-3 rounded-xl bg-white/10 border border-cyan-200/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">— Выберите оборудование —</option>
                {equipment
                  .filter((eq) => !form.equipmentIds?.includes(eq.id))
                  .map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} ({eq.inventoryNumber})
                    </option>
                  ))}
              </select>

              {form.equipmentIds && form.equipmentIds.length > 0 && (
                <ul className="text-sm space-y-1">
                  {form.equipmentIds.map((id) => {
                    const item = equipment.find((e) => e.id === id);
                    return (
                      <li
                        key={id}
                        className="flex justify-between items-center bg-white/10 border border-cyan-200/10 px-3 py-1 rounded-xl"
                      >
                        <span>{item?.name} ({item?.inventoryNumber})</span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              equipmentIds: prev.equipmentIds?.filter((eid) => eid !== id),
                            }))
                          }
                          className="text-pink-400 hover:text-pink-200 text-lg px-2 py-1"
                        >
                          ✖
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Файлы */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-1">📎 Прикрепить файлы</label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-cyan-200/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-4 pt-6 border-t border-cyan-300/10">
            <button
              type="button"
              className="bg-white/10 text-cyan-300 hover:bg-cyan-400/10 hover:text-white px-6 py-2 rounded-xl shadow transition font-semibold"
              onClick={() => {
                onClose();
                if (!initialData?.id) resetForm();
              }}
            >
              ✖ Закрыть
            </button>
            <button
              type="submit"
              className="bg-cyan-400 hover:bg-cyan-300 text-[#181e2a] font-bold px-7 py-2 rounded-xl shadow-lg transition"
              disabled={submitting}
            >
              💾 Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
