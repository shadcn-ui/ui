'use client';

import React, { useEffect, useState } from 'react';

interface RequestFiltersProps {
  filterTitle: string;
  setFilterTitle: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterDate: string;
  setFilterDate: (value: string) => void;
  filterPriority: string;
  setFilterPriority: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Завершена',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function RequestFilters({
  filterTitle,
  setFilterTitle,
  filterStatus,
  setFilterStatus,
  filterDate,
  setFilterDate,
  filterPriority,
  setFilterPriority,
  filterCategory,
  setFilterCategory,
}: RequestFiltersProps) {
  const [priorities, setPriorities] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/priorities`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((p: any) => { map[p.code] = p.name; });
        setPriorities(map);
      })
      .catch(() => setPriorities({}));
    fetch(`${API_URL}/categories`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setCategories(data.map((c: any) => c.name)))
      .catch(() => setCategories([]));
  }, []);
  const handleReset = () => {
    setFilterTitle('');
    setFilterStatus('');
    setFilterDate('');
    setFilterPriority('');
    setFilterCategory('');
  };

  return (
    <div className="flex flex-wrap gap-4 items-end bg-gradient-to-br from-[#18243c]/80 to-[#172e44]/70 border border-cyan-400/10 rounded-2xl p-5 shadow-lg">
      <input
        type="text"
        placeholder="Поиск по заголовку..."
        value={filterTitle}
        onChange={(e) => setFilterTitle(e.target.value)}
        className="p-3 rounded-xl bg-white/10 border border-cyan-200/20 text-white flex-1 min-w-[180px] placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
      />

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="p-3 rounded-xl bg-white/10 border border-cyan-200/20 text-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
      >
        <option value="">Все статусы</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="p-3 rounded-xl bg-white/10 border border-cyan-200/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
      />

      <select
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
        className="p-3 rounded-xl bg-white/10 border border-cyan-200/20 text-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
      >
        <option value="">Все приоритеты</option>
        {Object.entries(priorities).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="p-3 rounded-xl bg-white/10 border border-cyan-200/20 text-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
      >
        <option value="">Все категории</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <button
        onClick={handleReset}
        className="bg-gradient-to-tr from-cyan-400/90 to-teal-300/90 hover:from-cyan-300 hover:to-teal-200 text-[#101622] font-bold px-4 py-2 rounded-xl shadow transition text-sm"
        type="button"
      >
        ✖ Сбросить
      </button>
    </div>
  );
}
