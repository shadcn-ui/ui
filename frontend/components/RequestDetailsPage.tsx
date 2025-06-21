'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Navbar from '@/components/Navbar';
import AssignExecutorModal from '@/components/AssignExecutorModal';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter, useParams } from 'next/navigation';

type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
type Status = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'REJECTED' | 'COMPLETED';

const STATUS_LABELS: Record<Status, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  DONE: 'Завершена',
  REJECTED: 'Отклонена',
  COMPLETED: 'Выполнена',
};

const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Низкий',
  NORMAL: 'Обычный',
  HIGH: 'Высокий',
  URGENT: 'Срочный',
};

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  internalPhone?: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    firstName?: string;
    lastName?: string;
  };
}

interface RequestType {
  id: number;
  title: string;
  content: string;
  status: Status;
  priority?: Priority;
  category?: string;
  createdAt: string;
  resolvedAt?: string | null;
  expectedResolutionDate?: string | null;
  feedback?: string | null;
  rating?: number | null;
  fileUrls?: string[];
  user?: User;
  executor?: User;
  comments: Comment[];
}

function getInitials(user?: { firstName?: string; lastName?: string }) {
  if (!user) return '';
  return ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase();
}

// --- Модалка для оценки ---
function RatingModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
}) {
  const [localRating, setLocalRating] = useState(5);
  const [localFeedback, setLocalFeedback] = useState('');
  useEffect(() => {
    if (open) {
      setLocalRating(5);
      setLocalFeedback('');
    }
  }, [open]);
  if (!open) return <div>Раздел в разработке</div>;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#232c3f]/95 to-[#18223b]/90 border border-cyan-300/20 p-8 rounded-2xl shadow-2xl min-w-[320px] max-w-[98vw]">
        <h2 className="text-xl font-bold mb-4 text-cyan-300 text-center">Пожалуйста, оцените работу по заявке</h2>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Ваша оценка:</label>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                className={`text-3xl transition ${n <= localRating ? 'text-yellow-400' : 'text-gray-500/70'} hover:scale-125`}
                onClick={() => setLocalRating(n)}
                type="button"
                aria-label={`Оценка ${n}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Комментарий (необязательно):</label>
          <textarea
            className="w-full p-2 rounded-xl bg-white/10 border border-cyan-700/30 text-white"
            value={localFeedback}
            onChange={e => setLocalFeedback(e.target.value)}
            placeholder="Поделитесь впечатлением"
            rows={2}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-900/70 text-cyan-100 hover:bg-cyan-800/90 transition font-semibold"
          >
            Позже
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-cyan-400 text-[#13202d] font-bold hover:bg-cyan-300 transition"
            onClick={() => onSubmit(localRating, localFeedback)}
            disabled={!localRating}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export default function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [request, setRequest] = useState<RequestType | null>(null);
  const [comment, setComment] = useState('');
  const [priority, setPriority] = useState<Priority>('NORMAL');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<Status>('NEW');
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [executorModalOpen, setExecutorModalOpen] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Status | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const userRole = useUserRole?.() || {};
  const { isAdmin, role, user } = userRole as any;
  const canAssignExecutor = isAdmin || role === 'superuser';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const canEdit = true;

  // Только эти доступны для выбора пользователем
  const STATUS_CHOICES: Status[] = ['NEW', 'IN_PROGRESS', 'DONE', 'REJECTED'];

  useEffect(() => {
    if (!id) return;
    fetch(`${baseUrl}/requests/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject('Ошибка загрузки'))
      .then((data: RequestType) => {
        setRequest(data);
        setPriority(data.priority ?? 'NORMAL');
        setCategory(data.category ?? '');
        setStatus(data.status);
        setFileUrls(data.fileUrls ?? []);
        setComments(data.comments ?? []);
        setShowRatingModal(false);
      })
      .catch(() => setErrorMessage('Ошибка загрузки заявки'));
    // eslint-disable-next-line
  }, [id]);

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#17223a] via-[#212a44] to-[#19243a] text-white">
        <Navbar user={user ?? null} currentPage="requests" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-white/60">Загрузка заявки...</div>
        </div>
      </div>
    );
  }

  const totalTime = request.resolvedAt
    ? Math.round((new Date(request.resolvedAt).getTime() - new Date(request.createdAt).getTime()) / 60000)
    : null;

  const handleNewFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setNewFiles(Array.from(e.target.files));
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    setErrorMessage('');
    const body = { text: comment, requestId: request.id };
    try {
      const res = await fetch(`/api/requests/${request.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Ошибка добавления комментария');

      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setComment('');
    } catch (e) {
      setErrorMessage('Ошибка добавления комментария. Проверьте заполненность полей и авторизацию.');
    }
  };

  // Обработка смены статуса (DONE - только через модалку оценки!)
  const handleStatusChange = (newStatus: Status) => {
    if (newStatus === 'DONE') {
      setPendingStatus(newStatus);
      setShowRatingModal(true);
    } else {
      setStatus(newStatus);
      updateRequest(newStatus);
    }
  };

  // PATCH заявки, для DONE требует rating/feedback
  const updateRequest = async (
    customStatus?: Status,
    customRating?: number,
    customFeedback?: string
  ) => {
    setErrorMessage('');
    const reqStatus = customStatus ?? status;

    try {
      let res;
      if (newFiles.length === 0) {
        res = await fetch(`/api/requests/${request.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            priority,
            category,
            status: reqStatus,
            rating: reqStatus === 'DONE' ? customRating : undefined,
            feedback: reqStatus === 'DONE' ? customFeedback : undefined,
            fileUrls,
          }),
        });
      } else {
        const formData = new FormData();
        formData.append('priority', priority);
        formData.append('category', category);
        formData.append('status', reqStatus);
        if (reqStatus === 'DONE' && customRating) {
          formData.append('rating', customRating.toString());
          formData.append('feedback', customFeedback || '');
        }
        fileUrls.forEach((url) => formData.append('fileUrls[]', url));
        newFiles.forEach((file) => formData.append('files', file));
        res = await fetch(`/api/requests/${request.id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      if (!res.ok) throw new Error('Ошибка при сохранении изменений');

      const updated = await res.json();
      setRequest(updated);
      setStatus(reqStatus);
      setSuccessMessage('✔️ Изменения успешно сохранены');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e) {
      setErrorMessage('Ошибка при сохранении изменений.');
    }
  };

  // Отправка оценки из модалки, завершение заявки
  const handleSendRating = async (rate: number, fb: string) => {
    setShowRatingModal(false);
    if (pendingStatus === 'DONE') {
      await updateRequest('DONE', rate, fb);
      setPendingStatus(null);
    }
  };

  function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div className="mb-3">
        <span className="text-xs text-white/60">{label}:</span>
        <div className="text-base font-semibold">{children}</div>
      </div>
    );
  }

  const displayedComments = showAllComments ? comments : comments.slice(-5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17223a] via-[#212a44] to-[#19243a] text-white flex flex-col">
      <Navbar user={user ?? null} currentPage="requests" />
      <div className="flex-1 py-10">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-8 px-6 md:px-10">
          <div>
            <button
              onClick={() => router.back()}
              className="text-cyan-400 hover:underline text-base flex items-center gap-2"
            >
              ← Назад к списку
            </button>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 flex items-center gap-2 text-cyan-200 drop-shadow">
              📝 {request.title}
            </h1>
            <div className="text-base text-cyan-100/80 mt-1">{request.content}</div>
          </div>
          <div>
            {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}
            {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
          </div>
        </div>

        <div className="
          max-w-[1700px] mx-auto grid gap-14
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          auto-rows-fr
          px-6 md:px-10
        ">
          {/* Левая карточка — Информация */}
          <div className="bg-gradient-to-br from-[#192642]/90 to-[#243a53]/90 border border-cyan-300/10 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col min-h-[340px]">
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">Информация</h2>
            <div className="space-y-4 text-base">
              <Field label="Категория">{category || '—'}</Field>
              <Field label="Статус">{STATUS_LABELS[status as Status] || status}</Field>
              <Field label="Приоритет">{PRIORITY_LABELS[priority as Priority]}</Field>
              <Field label="Создано">{new Date(request.createdAt).toLocaleString()}</Field>
              {request.expectedResolutionDate && (
                <Field label="Дедлайн">{new Date(request.expectedResolutionDate).toLocaleDateString()}</Field>
              )}
              {request.resolvedAt && (
                <Field label="Завершено">{new Date(request.resolvedAt).toLocaleString()}</Field>
              )}
              {totalTime && <Field label="Время решения">{totalTime} мин</Field>}
              <Field label="Автор">
                {request.user
                  ? `${request.user.lastName} ${request.user.firstName} ${request.user.middleName ?? ''}`
                  : 'Неизвестный'}
                {request.user?.internalPhone && (
                  <span className="block text-xs text-white/40">📞 {request.user.internalPhone}</span>
                )}
              </Field>
              <Field label="Исполнитель">
                {request.executor
                  ? <span className="text-cyan-300">{`${request.executor.lastName} ${request.executor.firstName}`}</span>
                  : <span className="text-white/40">Не назначен</span>
                }
                {request.executor?.internalPhone && (
                  <span className="block text-xs text-white/40">📞 {request.executor.internalPhone}</span>
                )}
              </Field>
              {status === 'COMPLETED' && (
                <>
                  <Field label="Оценка">
                    {request.rating ? (
                      <span className="text-yellow-400">{'★'.repeat(request.rating)}{'☆'.repeat(5 - request.rating)}</span>
                    ) : (
                      <span className="text-gray-400">Нет оценки</span>
                    )}
                  </Field>
                  <Field label="Отзыв">
                    {request.feedback || <span className="text-gray-400">Без отзыва</span>}
                  </Field>
                </>
              )}
            </div>
            {canAssignExecutor && (
              <button
                className="mt-8 px-4 py-2 text-sm rounded-xl bg-cyan-400/30 hover:bg-cyan-400/60 transition font-semibold text-cyan-100"
                onClick={() => setExecutorModalOpen(true)}
              >
                🛠️ Назначить исполнителя
              </button>
            )}
          </div>

          {/* Центральная карточка — Файлы + Редактирование */}
          <div className="bg-gradient-to-br from-[#202c49]/90 to-[#263d5a]/90 border border-cyan-300/10 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col min-h-[340px]">
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">Редактировать заявку</h2>
            <div className="mb-6">
              <span className="font-semibold text-cyan-300">📎 Вложения:</span>
              {fileUrls.length === 0 ? (
                <span className="ml-2 text-white/50">Нет файлов</span>
              ) : (
                <div className="flex flex-wrap gap-3 mt-2">
                  {fileUrls.map((url, idx) => {
                    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
                    return (
                      <a
                        key={idx}
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border border-cyan-700/30 bg-cyan-900/20 p-2 rounded-xl text-center text-xs hover:border-cyan-400 transition min-w-[86px]"
                      >
                        {fullUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                          <img src={fullUrl} alt={`Вложение ${idx + 1}`} className="max-w-full max-h-16 rounded mx-auto mb-1" />
                        ) : fullUrl.match(/\.pdf$/i) ? (
                          <span className="text-cyan-300 text-2xl">📄</span>
                        ) : (
                          <span className="text-cyan-300 text-xl">📁</span>
                        )}
                        <span>Файл {idx + 1}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
            {canEdit && (
              <div className="border-t border-cyan-700/20 pt-4 flex-1">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm mb-1">Изменить приоритет:</label>
                    <select
                      className="w-full p-2 rounded-xl bg-white/10 border border-cyan-200/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      value={priority}
                      onChange={e => setPriority(e.target.value as Priority)}
                    >
                      {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Категория:</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-xl bg-white/10 border border-cyan-200/20 text-white"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Статус:</label>
                    <select
                      className="w-full p-2 rounded-xl bg-white/10 border border-cyan-200/20 text-white"
                      value={status}
                      onChange={e => handleStatusChange(e.target.value as Status)}
                    >
                      {STATUS_CHOICES.map((key) => (
                        <option key={key} value={key}>{STATUS_LABELS[key]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Загрузить файлы:</label>
                    <input
                      type="file"
                      multiple
                      onChange={handleNewFileChange}
                      className="w-full text-sm text-white file:bg-cyan-400/20 file:border-0 file:px-4 file:py-2 file:rounded-xl"
                    />
                  </div>
                  <button
                    onClick={() => updateRequest()}
                    className="bg-cyan-400 mt-2 px-6 py-2 rounded-xl hover:bg-cyan-300 text-base font-bold transition w-full text-[#191b25]"
                  >
                    💾 Сохранить изменения
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Правая карточка — Комментарии */}
          <div className="bg-gradient-to-br from-[#202849]/90 to-[#28355a]/90 border border-cyan-300/10 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col min-h-[340px]">
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">💬 Комментарии</h2>
            <div className="space-y-2 max-h-72 overflow-y-auto mb-6">
              {comments.length === 0 ? (
                <p className="text-cyan-100/50 italic">Комментариев пока нет.</p>
              ) : (
                <>
                  {!showAllComments && comments.length > 5 && (
                    <button
                      className="text-cyan-400 hover:underline mb-2"
                      onClick={() => setShowAllComments(true)}
                    >
                      Показать все комментарии ({comments.length})
                    </button>
                  )}
                  {displayedComments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                      <div className="w-9 h-9 flex-shrink-0 rounded-full bg-cyan-800 text-white flex items-center justify-center font-bold text-lg mt-1">
                        {getInitials(c.user)}
                      </div>
                      <div className="bg-white/10 rounded-xl px-3 py-2 text-white/90 flex-1">
                        <div className="text-sm">{c.content}</div>
                        <div className="text-xs text-cyan-100/70 mt-1">
                          — {c.user.lastName} {c.user.firstName} · {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <textarea
              className="w-full mt-3 p-2 rounded-xl bg-white/10 border border-cyan-200/20 text-white placeholder-white/60"
              placeholder="Написать комментарий..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={submitComment}
              className="mt-2 bg-green-500 hover:bg-green-400 px-4 py-2 rounded-xl transition text-white font-semibold"
              disabled={!comment.trim()}
            >
              💬 Добавить комментарий
            </button>
            {errorMessage && <p className="text-pink-400 text-sm mt-1">{errorMessage}</p>}
          </div>
        </div>
      </div>

      {/* Модал смены исполнителя */}
      <AssignExecutorModal
        requestId={request.id}
        isOpen={executorModalOpen}
        onClose={() => setExecutorModalOpen(false)}
        onAssign={async () => {
          setExecutorModalOpen(false);
          try {
            const res = await fetch(`${baseUrl}/requests/${request.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!res.ok) throw new Error('Ошибка загрузки');
            const updated = await res.json();
            setRequest(updated);
            setSuccessMessage('✔️ Исполнитель обновлён');
          } catch (e) {
            setErrorMessage('Ошибка обновления заявки');
          }
        }}
      />

      {/* Модальное окно оценки */}
      <RatingModal
        open={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSendRating}
      />
    </div>
  );
}
