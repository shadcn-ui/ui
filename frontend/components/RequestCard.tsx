"use client";

import React from 'react';
import { Repeat2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RequestCardProps {
  request: {
    id: number;
    title: string;
    content: string;
    status: string;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    category?: string;
    createdAt: string;
    resolvedAt?: string | null;
    expectedResolutionDate?: string | null;
    feedback?: string | null;
    rating?: number | null;
    fileUrls?: string[];
    executor?: {
      id?: number;
      firstName: string;
      lastName: string;
      middleName?: string;
      internalPhone?: string;
    } | null;
    comments: {
      id: number;
      content: string;
      createdAt: string;
      user: {
        firstName: string;
        lastName: string;
      };
    }[];
  };
  onRepeat: () => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Низкий',
  NORMAL: 'Обычный',
  HIGH: 'Высокий',
  URGENT: 'Срочный',
};

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  DONE: 'Завершена',
  COMPLETED: 'Выполнена',
  REJECTED: 'Отклонена',
};

export default function RequestCard({ request, onRepeat }: RequestCardProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const isClosed = request.status === 'COMPLETED' || request.status === 'DONE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.23 }}
      className="bg-gradient-to-br from-[#1c2332]/90 via-[#1d273c]/90 to-[#182030]/90 border border-cyan-300/15
        backdrop-blur-2xl rounded-2xl shadow-xl p-6 mb-2 transition hover:bg-cyan-400/10"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2">
        <h2 className="text-lg font-bold text-cyan-200">{request.title}</h2>
        <span
          className="text-xs font-semibold rounded-full px-4 py-1 shadow border border-cyan-200/10"
          style={{
            background:
              request.status === "NEW"
                ? "rgba(34,211,238,0.13)"
                : request.status === "IN_PROGRESS"
                  ? "rgba(252,211,77,0.12)"
                  : isClosed
                    ? "rgba(74,222,128,0.13)"
                    : "rgba(100,116,139,0.09)"
          }}
        >
          {STATUS_LABELS[request.status] || request.status}
        </span>
      </div>

      <p className="text-base mb-2 text-white/90">{request.content}</p>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-cyan-100/70 font-medium mb-1">
        <span>🕒 <span className="font-semibold">Создано:</span> {new Date(request.createdAt).toLocaleString()}</span>
        {request.expectedResolutionDate && (
          <span>📆 <span className="font-semibold">Дедлайн:</span> {new Date(request.expectedResolutionDate).toLocaleDateString()}</span>
        )}
        {request.resolvedAt && (
          <span>✅ <span className="font-semibold">Завершено:</span> {new Date(request.resolvedAt).toLocaleString()}</span>
        )}
        {request.priority && <span>⚡ <span className="font-semibold">Приоритет:</span> {PRIORITY_LABELS[request.priority]}</span>}
        {request.category && <span>📁 <span className="font-semibold">Категория:</span> {request.category}</span>}
      </div>

      {isClosed && request.rating != null && (
        <div className="mt-2 text-xs text-yellow-400 flex items-center gap-2">
          <span>⭐ <span className="font-medium">Оценка:</span> {request.rating} / 5</span>
        </div>
      )}
      {isClosed && request.feedback && (
        <div className="mt-1 text-xs text-cyan-200">
          💬 <span className="font-medium">Отзыв:</span> {request.feedback}
        </div>
      )}

      <div className="mt-2 flex flex-col md:flex-row gap-3 md:gap-8 items-start md:items-center">
        {request.executor ? (
          <span className="text-sm text-cyan-200 flex items-center gap-2">
            🛠 <span className="font-semibold">Исполнитель:</span>{' '}
            {`${request.executor.lastName} ${request.executor.firstName}${request.executor.middleName ? ' ' + request.executor.middleName : ''}`}
            {request.executor.internalPhone && (
              <span className="ml-3 text-cyan-100/60 text-xs">📞 <span className="font-semibold">Вн. тел:</span> {request.executor.internalPhone}</span>
            )}
          </span>
        ) : (
          <p className="text-sm text-white/50">🛠 Исполнитель не назначен</p>
        )}
      </div>

      {Array.isArray(request.fileUrls) && request.fileUrls.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-cyan-300 mb-2">📎 Вложения:</p>
          <div className="flex flex-wrap gap-3">
            {request.fileUrls.map((url, idx) => {
              const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
              return (
                <div key={idx} className="bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-2 text-center text-xs shadow hover:shadow-lg transition max-w-[130px]">
                  {fullUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={fullUrl}
                      alt={`Файл ${idx + 1}`}
                      className="max-h-24 mx-auto rounded shadow cursor-pointer hover:scale-105 transition"
                    />
                  ) : fullUrl.match(/\.pdf$/i) ? (
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-cyan-400 hover:underline"
                      title="Открыть PDF"
                    >
                      PDF файл
                    </a>
                  ) : (
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-cyan-300 hover:underline"
                    >
                      {url.split('/').pop()}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="text-sm font-semibold text-cyan-300">💬 Комментарии:</p>
        {request.comments.length === 0 ? (
          <p className="text-cyan-100/60 italic">Комментариев пока нет.</p>
        ) : (
          <div className="space-y-2 mt-1">
            {request.comments.map((c) => (
              <div key={c.id} className="p-2 bg-white/10 rounded-xl text-white/80 shadow-sm">
                <p className="text-sm">{c.content}</p>
                <p className="text-xs text-white/40">
                  — {c.user.lastName} {c.user.firstName} · {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-4">
        <button
          onClick={e => {
            e.stopPropagation();
            onRepeat();
          }}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-cyan-100 bg-cyan-400/20 hover:bg-cyan-400/40 hover:text-white text-sm font-bold transition shadow"
        >
          <Repeat2 className="w-4 h-4" /> Отправить заново
        </button>
      </div>
    </motion.div>
  );
}
