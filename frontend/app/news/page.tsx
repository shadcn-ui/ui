'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface NewsItem { id: number; title: string; content: string; createdAt: string }

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setUser(data))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/news`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setNews(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Не удалось загрузить новости'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1b2232] text-white flex justify-center items-center">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1b2232] text-white">
      <Navbar user={user} currentPage="news" />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Новости</h1>
        <ul className="space-y-5">
          {news.map(n => (
            <li key={n.id} className="border-b border-gray-600 pb-4">
              <h2 className="text-xl font-semibold text-cyan-300 mb-2">{n.title}</h2>
              <p className="text-sm text-gray-400 mb-1">{new Date(n.createdAt).toLocaleDateString()}</p>
              <p>{n.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
