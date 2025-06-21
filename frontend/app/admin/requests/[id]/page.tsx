'use client';

import { useEffect, useState, useRef, ChangeEvent } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import AssignExecutorModal from '@/components/AssignExecutorModal';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter, useParams } from 'next/navigation';

const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Низкий',
  NORMAL: 'Обычный',
  HIGH: 'Высокий',
  URGENT: 'Срочный',
};

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  DONE: 'Выполнена',
  REJECTED: 'Отклонена',
  COMPLETED: 'Завершена',
};

type Status = keyof typeof STATUS_LABELS;

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
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
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

function getInitials(user: { firstName?: string; lastName?: string } | undefined) {
  if (!user) return '';
  return ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase();
}

export default function AdminRequestPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { isAdmin, role } = useUserRole?.() || { isAdmin: false, role: null };
  const canAssignExecutor = isAdmin || role === 'superuser';

  const [request, setRequest] = useState<RequestType | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [executorModalOpen, setExecutorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const [priority, setPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<Status>('NEW');
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(true);
    fetch(`${baseUrl}/requests/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data: RequestType = await res.json();
          setRequest(data);
          setComments(data.comments || []);
          setPriority((data.priority as any) || 'NORMAL');
          setCategory(data.category || '');
          // Статус должен быть из enum, если нет — по умолчанию 'NEW'
          let nextStatus: Status = data.status as Status;
          if (!(nextStatus in STATUS_LABELS)) nextStatus = 'NEW';
          setStatus(nextStatus);
          setFileUrls(data.fileUrls || []);
        } else if (res.status === 404) {
          setRequest(null);
        } else {
          setErrorMessage('Не удалось загрузить заявку');
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('Не удалось загрузить заявку');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, showAllComments]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-white/60">Загрузка...</div>
        </div>
      </div>
    );
  if (!request)
    return (
      <div className="min-h-screen flex flex-col bg-gray-950 text-red-400">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Заявка не найдена</div>
        </div>
      </div>
    );

  const totalTime = request.resolvedAt
    ? Math.round((new Date(request.resolvedAt).getTime() - new Date(request.createdAt).getTime()) / 60000)
    : null;

  const submitComment = async () => {
    if (!comment.trim()) return;
    setErrorMessage('');
    const body = { text: comment, requestId: request.id };
    const res = await fetch(`${baseUrl}/requests/${request.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setComment('');
    } else {
      setErrorMessage('Ошибка добавления комментария.');
    }
  };

  const updateRequest = async () => {
    setErrorMessage('');
    let res;
    if (newFiles.length === 0) {
      res = await fetch(`${baseUrl}/requests/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          priority,
          category,
          status,
          fileUrls,
        }),
      });
    } else {
      const formData = new FormData();
      formData.append('priority', priority || '');
      formData.append('category', category || '');
      formData.append('status', status || '');
      fileUrls.forEach((url) => formData.append('fileUrls[]', url));
      newFiles.forEach((file) => formData.append('files', file));
      res = await fetch(`${baseUrl}/requests/${request.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    }
    if (res && res.ok) {
      const updated: RequestType = await res.json();
      setRequest(updated);
      setSuccessMessage('✔️ Изменения сохранены');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage('Ошибка при сохранении изменений.');
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(-5);

  function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div className="mb-3">
        <span className="text-xs text-white/60">{label}:</span>
        <div className="text-base font-semibold">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <AdminNavbar />
      <div className="flex-1 py-10">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-8 px-10 mt-8">
          <div>
            <button
              onClick={() => router.back()}
              className="text-cyan-400 hover:underline text-base flex items-center gap-2"
            >
              ← К списку заявок
            </button>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 flex items-center gap-2">
              🛠️ {request.title}
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
          px-10
        ">
          {/* Левая карточка — Информация */}
          <div className="bg-[#24304b] rounded-2xl shadow-2xl p-12 border border-cyan-800/15 flex flex-col justify-between min-h-[340px]">
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">Информация</h2>
            <div className="space-y-4 text-base">
              <Field label="Категория">{category || '—'}</Field>
              <Field label="Статус">{STATUS_LABELS[status] || status}</Field>
              <Field label="Приоритет">{PRIORITY_LABELS[priority || 'NORMAL']}</Field>
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
            </div>
            {canAssignExecutor && (
              <button
                className="mt-8 px-4 py-2 text-sm rounded-xl bg-cyan-800 hover:bg-cyan-700 transition font-semibold"
                onClick={() => setExecutorModalOpen(true)}
              >
                🛠️ Назначить исполнителя
              </button>
            )}
          </div>

          {/* Центральная карточка — Файлы + Редактирование */}
          <div className="bg-[#223146] rounded-2xl shadow-2xl p-12 border border-cyan-800/15 flex flex-col min-h-[340px]">
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
                        className="block border border-cyan-700/40 bg-[#1e2836] p-2 rounded-xl text-center text-xs hover:border-cyan-500 transition min-w-[86px]"
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
            <div className="border-t border-cyan-700/30 pt-4 flex-1">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm mb-1">Изменить приоритет:</label>
                  <select
                    className="w-full p-2 rounded-xl bg-gray-800 border border-cyan-700/30"
                    value={priority}
                    onChange={e => setPriority(e.target.value as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT')}
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
                    className="w-full p-2 rounded-xl bg-gray-800 border border-cyan-700/30"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Статус:</label>
                  <select
                    className="w-full p-2 rounded-xl bg-gray-800 border border-cyan-700/30"
                    value={status}
                    onChange={e => setStatus(e.target.value as Status)}
                  >
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Загрузить файлы:</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files) setNewFiles(Array.from(e.target.files));
                    }}
                    className="w-full text-sm text-gray-300 file:bg-gray-700 file:border-0 file:px-4 file:py-2 file:rounded"
                  />
                </div>
                <button
                  onClick={updateRequest}
                  className="bg-blue-600 mt-2 px-6 py-2 rounded-xl hover:bg-blue-700 text-base font-bold transition w-full"
                >
                  💾 Сохранить изменения
                </button>
                {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
                {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
              </div>
            </div>
          </div>

          {/* Правая карточка — Комментарии */}
          <div className="bg-[#253254] rounded-2xl shadow-2xl p-12 border border-cyan-800/15 flex flex-col min-h-[340px]">
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
                  <div ref={commentsEndRef}></div>
                </>
              )}
            </div>
            <textarea
              className="w-full mt-3 p-2 rounded-xl bg-gray-800 border border-cyan-700/30 text-white"
              placeholder="Написать комментарий..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button
              onClick={submitComment}
              className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition"
              disabled={!comment.trim()}
            >
              💬 Добавить комментарий
            </button>
            {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
          </div>
        </div>
      </div>

      <AssignExecutorModal
        requestId={request.id}
        isOpen={executorModalOpen}
        onClose={() => setExecutorModalOpen(false)}
        onAssign={async () => {
          setExecutorModalOpen(false);
          const res = await fetch(`${baseUrl}/requests/${request.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const updated = await res.json();
            setRequest(updated);
          }
        }}
      />
    </div>
  );
}
