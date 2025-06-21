'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EquipmentDetails } from '@/types/equipment';

interface Props {
  details: EquipmentDetails;
  onUserClick?: (userId: number) => void;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

export default function EquipmentDetailsCard({ details, onUserClick }: Props) {
  const {
    inventoryNumber,
    name,
    type,
    location,
    floor,
    cabinet,
    ipAddress,
    macAddress,
    login,
    password,
    createdAt,
    assignedTo,
    assignedUsers = [],
    software = [],
    fileUrls = [],
  } = details;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : '—';

  const isImage = (filename: string) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);

  const isPdf = (filename: string) => /\.pdf$/i.test(filename);

  return (
    <div className="bg-gradient-to-br from-[#172142]/90 to-[#24334b]/95 border border-cyan-400/15 
      backdrop-blur-xl rounded-2xl p-7 sm:p-10 text-white shadow-2xl space-y-5 max-w-2xl mx-auto animate-fade-in">
      <h3 className="text-2xl font-bold flex items-center gap-2 mb-3 tracking-wide text-cyan-200">
        <span role="img" aria-label="equipment">📦</span> Подробности оборудования
      </h3>

      <ul className="text-base space-y-2">
        <InfoItem label="Инв. №" value={inventoryNumber} icon="🔢" />
        <InfoItem label="Название" value={name} icon="🖥️" />
        <InfoItem label="Тип" value={type} icon="📂" />
        <InfoItem
          label="Местоположение"
          value={`${location || '—'}, этаж ${floor || '—'}, каб. ${cabinet || '—'}`}
          icon="📍"
        />
        <InfoItem
          label="IP / MAC"
          value={
            <>
              <span className="font-mono">IP: {ipAddress || '—'}</span>{' '}
              <span className="font-mono ml-3">MAC: {macAddress || '—'}</span>
            </>
          }
          icon="🌐"
        />
        <InfoItem
          label="Доступ"
          value={
            <>
              <span className="font-mono">{login || '—'}</span>
              <span className="mx-1 text-white/50">/</span>
              <span className="font-mono">{password ? '••••••' : '—'}</span>
            </>
          }
          icon="🔑"
        />
        <InfoItem label="Добавлено" value={formattedDate} icon="📅" />
        <li>
          <span className="font-medium text-white/60">👤 Закреплено за:</span>{' '}
          {assignedTo ? (
            <button
              type="button"
              onClick={() => assignedTo.id && onUserClick?.(assignedTo.id)}
              className="text-cyan-300 hover:underline hover:text-cyan-200 font-semibold transition"
            >
              {assignedTo.lastName} {assignedTo.firstName}
              {assignedTo.middleName ? ` ${assignedTo.middleName}` : ''}
              {assignedTo.department ? ` (${assignedTo.department})` : ''}
            </button>
          ) : (
            <span className="text-white/50">—</span>
          )}
        </li>
        {assignedUsers.length > 0 && (
          <li>
            <span className="font-medium text-white/60">👥 Пользователи:</span>{' '}
            <ul className="ml-4 mt-1 list-disc text-cyan-100 space-y-1">
              {assignedUsers.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => u.id && onUserClick?.(u.id)}
                    className="text-cyan-300 hover:underline hover:text-cyan-200 font-semibold transition bg-transparent"
                  >
                    {u.lastName} {u.firstName}
                    {u.middleName ? ` ${u.middleName}` : ''}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        )}
        <li>
          <span className="font-medium text-white/60">💽 ПО:</span>{' '}
          {software && software.length > 0 ? (
            <ul className="ml-4 mt-1 list-disc text-cyan-100 space-y-1">
              {software.map(sw => (
                <li key={sw.id}>{sw.name}{sw.version ? ` v${sw.version}` : ''}</li>
              ))}
            </ul>
          ) : (
            <span className="text-white/50">—</span>
          )}
        </li>
      </ul>

      <hr className="my-4 border-cyan-300/10" />

      {/* Блок с файлами */}
      <div>
        <span className="font-medium text-cyan-300">📎 Прикреплённые файлы:</span>
        {fileUrls.length > 0 ? (
          <div className="flex flex-wrap gap-4 mt-3">
            {fileUrls.map((url, index) => {
              const fullUrl = url.startsWith('http') ? url : `${apiBase}/${url}`;
              if (isImage(url)) {
                return (
                  <img
                    key={index}
                    src={fullUrl}
                    alt={`file-${index}`}
                    className="rounded-xl max-h-32 max-w-[130px] border border-cyan-400/20 shadow cursor-pointer hover:scale-105 transition"
                    onClick={() => setPreviewUrl(fullUrl)}
                    title="Открыть превью"
                  />
                );
              } else if (isPdf(url)) {
                return (
                  <a
                    key={index}
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-cyan-400/10 text-cyan-300 hover:bg-white/20 transition">
                      <span role="img" aria-label="PDF">📄</span> PDF-файл {index + 1}
                    </div>
                  </a>
                );
              } else {
                return (
                  <a
                    key={index}
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-cyan-400/10 text-cyan-300 hover:bg-white/20 transition">
                      <span role="img" aria-label="file">📁</span> Скачать файл {index + 1}
                    </div>
                  </a>
                );
              }
            })}
          </div>
        ) : (
          <div className="mt-3 text-sm text-white/50 italic">Нет прикреплённых файлов</div>
        )}
      </div>

      {/* Модальное превью изображения */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewUrl(null)}
          >
            <motion.img
              src={previewUrl}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="max-w-full max-h-[90vh] rounded-2xl border-4 border-cyan-300/40 shadow-2xl"
              alt="Просмотр файла"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Информационный пункт
function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: string;
}) {
  return (
    <li>
      <span className="font-medium text-white/60">{icon} {label}:</span>{' '}
      <span className="text-white/90">{value || <span className="text-white/40">—</span>}</span>
    </li>
  );
}
