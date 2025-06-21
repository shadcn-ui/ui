'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Guide { id: number; title: string; content: string; fileUrl?: string; }

export default function GuideDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [guide, setGuide] = useState<Guide | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!id || !token) return;
    fetch(`${API_URL}/guides/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setGuide(data))
      .catch(() => {
        toast.error('Инструкция не найдена');
        router.push('/guides');
      });
  }, [id, token]);

  if (!guide) return <div className="min-h-screen bg-[#1b2232] text-white p-6">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-[#1b2232] text-white p-6">
      <Toaster />
      <button onClick={() => router.back()} className="text-cyan-300 hover:underline mb-4">← Назад</button>
      <h1 className="text-2xl font-bold mb-4">{guide.title}</h1>
      <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: guide.content }} />
      {guide.fileUrl && (
        <a href={guide.fileUrl} target="_blank" className="text-cyan-300 hover:underline block mt-4">Скачать файл</a>
      )}
    </div>
  );
}
