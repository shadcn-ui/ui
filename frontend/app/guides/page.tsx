'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface Guide { id: number; title: string; }

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/guides`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setGuides(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Не удалось загрузить инструкции'));
  }, [token]);

  return (
    <div className="min-h-screen bg-[#1b2232] text-white p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">Инструкции</h1>
      <ul className="space-y-3">
        {guides.map(g => (
          <li key={g.id} className="border-b border-gray-600 pb-2">
            <Link href={`/guides/${g.id}`} className="text-cyan-300 hover:underline">
              {g.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
