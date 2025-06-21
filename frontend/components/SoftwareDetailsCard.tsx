'use client';

import React, { useState } from 'react';
import { FaFilePdf, FaFileImage, FaFileAlt, FaTimes } from 'react-icons/fa';
import { SoftwareDetails } from '@/types/software';

interface Props {
  software: SoftwareDetails;
  onClose: () => void;
  onUserClick?: (userId: number) => void;
  onEquipmentClick?: (equipmentId: number) => void;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function SoftwareDetailsCard({ software, onClose, onUserClick, onEquipmentClick }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!software || !software.name) return <div>Раздел в разработке</div>;

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : '—';

  const isImage = (filename: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
  const isPdf = (filename: string) => /\.pdf$/i.test(filename);

  const getIcon = (filename: string) => {
    if (isPdf(filename)) return <FaFilePdf className="inline mr-2 text-red-400" />;
    if (isImage(filename)) return <FaFileImage className="inline mr-2 text-cyan-400" />;
    return <FaFileAlt className="inline mr-2 text-cyan-200" />;
  };

  return (
    <div className="bg-gradient-to-br from-[#18243b]/90 to-[#21314a]/85 border border-cyan-400/15 
      backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-2xl text-white space-y-5 max-w-2xl mx-auto relative animate-fade-in">
      <div className="flex justify-between items-center border-b border-cyan-400/10 pb-2 mb-2">
        <h2 className="text-2xl font-bold select-none tracking-wide flex items-center gap-2">
          💽 {software.name}
        </h2>
        <button
          onClick={onClose}
          className="text-cyan-300 hover:text-pink-500 text-2xl bg-white/5 hover:bg-white/10 rounded-full p-2 transition"
          aria-label="Закрыть"
        >
          <FaTimes />
        </button>
      </div>

      <ul className="text-base space-y-1">
        <InfoItem label="Версия" value={software.version} icon="🧩" />
        <InfoItem label="Лицензия" value={software.licenseKey} icon="🔑" />
        <InfoItem label="Лицензировано для" value={software.licensedTo} icon="👤" />
        <InfoItem label="Доступ" value={`${software.adminLogin || '—'} / ${software.adminPassword ? '••••••' : '—'}`} icon="🔐" />
        <InfoItem label="Сетевой адрес" value={software.networkAddress} icon="🌐" />
        <InfoItem label="Место установки" value={software.installLocation} icon="📍" />
        <InfoItem label="Дата покупки" value={formatDate(software.purchaseDate)} icon="🛒" />
        <InfoItem
          label="Поддержка"
          value={
            software.supportStart && software.supportEnd
              ? `${formatDate(software.supportStart)} — ${formatDate(software.supportEnd)}`
              : '—'
          }
          icon="📅"
        />
        <InfoItem label="Срок действия" value={formatDate(software.expiryDate)} icon="⏳" />
        <li>
          <span className="font-medium text-white/60">👥 Пользователи:</span>{' '}
          {software.users?.length ? (
            software.users.map((u, i) => (
              <span key={u.id || i}>
                {i > 0 && ', '}
                <span
                  onClick={() => u.id && onUserClick?.(u.id)}
                  className={u.id ? 'text-cyan-300 hover:underline cursor-pointer transition' : ''}
                  title={u.id ? 'Открыть профиль пользователя' : undefined}
                >
                  {`${u.lastName} ${u.firstName}${u.middleName ? ` ${u.middleName}` : ''}`}
                </span>
              </span>
            ))
          ) : '—'}
        </li>
        <li>
          <span className="font-medium text-white/60">🖥 Оборудование:</span>{' '}
          {software.equipment?.length ? (
            software.equipment.map((e, i) => (
              <span key={e.id || i}>
                {i > 0 && ', '}
                <span
                  onClick={() => e.id && onEquipmentClick?.(e.id)}
                  className={e.id && onEquipmentClick ? 'text-cyan-300 hover:underline cursor-pointer transition' : ''}
                  title={e.id && onEquipmentClick ? 'Открыть оборудование' : undefined}
                >
                  {e.name}
                </span>
              </span>
            ))
          ) : (
            <span className="text-white/50">—</span>
          )}
        </li>
      </ul>

      {/* Файлы */}
      {software.fileUrls?.length ? (
        <div className="pt-3">
          <h4 className="text-base font-semibold mb-2 text-cyan-300">📎 Прикреплённые файлы:</h4>
          <div className="flex flex-wrap gap-4">
            {software.fileUrls.map((url, i) => {
              const fullUrl = url.startsWith('http') ? url : `${baseUrl}/${url}`;
              const fileName = url.split('/').pop() || `Файл ${i + 1}`;

              return (
                <div key={i} className="bg-white/10 rounded-xl p-3 min-w-[120px] max-w-[170px] flex flex-col items-center">
                  <div className="text-sm text-white/80 flex items-center truncate w-full">{getIcon(url)}{fileName}</div>
                  {isImage(url) ? (
                    <img
                      src={fullUrl}
                      alt={`Вложение ${i + 1}`}
                      className="rounded-lg max-h-36 border border-cyan-300/10 mt-2 cursor-pointer hover:scale-105 transition"
                      onClick={() => setPreviewUrl(fullUrl)}
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  ) : isPdf(url) ? (
                    <iframe
                      src={fullUrl}
                      className="w-full h-24 border rounded bg-white/90 mt-2"
                      title={`PDF файл ${i + 1}`}
                    />
                  ) : (
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 underline text-sm hover:text-cyan-100 mt-2 transition"
                    >
                      Скачать
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Модальное окно для просмотра картинки */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-pointer"
          onClick={() => setPreviewUrl(null)}
        >
          <img
            src={previewUrl}
            className="max-w-full max-h-[92vh] rounded-2xl border-4 border-cyan-300/40 shadow-2xl"
            alt="Просмотр файла"
          />
        </div>
      )}
    </div>
  );
}

// Красивый компонент строки-инфо
function InfoItem({ label, value, icon }: { label: string; value?: React.ReactNode; icon: string }) {
  return (
    <li>
      <span className="font-medium text-white/60">{icon} {label}:</span>{' '}
      <span className="text-white/90">{value || <span className="text-white/40">—</span>}</span>
    </li>
  );
}
