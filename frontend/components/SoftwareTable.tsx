'use client';

import { useState } from 'react';

export interface SoftwareItem {
  id: number;
  name: string;
  licenseKey?: string;
  version: string;
  assignedTo?: string;
  deviceId?: number;
}

interface SoftwareTableProps {
  data: SoftwareItem[];
  onEdit: (item: SoftwareItem) => void;
  onDelete: (id: number) => void;
}

export default function SoftwareTable({ data, onEdit, onDelete }: SoftwareTableProps) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'version'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = (key: 'name' | 'version') => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const renderSortIcon = (key: 'name' | 'version') => {
    if (sortKey !== key)
      return <span className="ml-1 text-cyan-300/50">⇅</span>;
    return sortAsc
      ? <span className="ml-1 text-cyan-400">▲</span>
      : <span className="ml-1 text-cyan-400">▼</span>;
  };

  const filtered = data
    .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const valA = (a[sortKey] ?? '').toLowerCase();
      const valB = (b[sortKey] ?? '').toLowerCase();
      return valA.localeCompare(valB) * (sortAsc ? 1 : -1);
    });

  return (
    <div className="space-y-5">
      <input
        type="text"
        placeholder="Поиск по названию ПО..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-xl bg-white/10 border border-cyan-400/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition mb-1"
      />

      <div className="overflow-x-auto rounded-2xl border border-cyan-400/10 bg-gradient-to-br from-[#162436]/80 to-[#22324c]/80 shadow-xl">
        <table className="min-w-full table-auto text-base text-left text-white">
          <thead className="bg-gradient-to-r from-cyan-900/60 via-[#182c41]/70 to-cyan-700/30 text-cyan-100">
            <tr>
              <th
                className="px-6 py-3 cursor-pointer select-none font-semibold tracking-wide"
                onClick={() => toggleSort('name')}
                scope="col"
              >
                Название {renderSortIcon('name')}
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none font-semibold tracking-wide"
                onClick={() => toggleSort('version')}
                scope="col"
              >
                Версия {renderSortIcon('version')}
              </th>
              <th className="px-4 py-3 font-semibold tracking-wide">Лицензия</th>
              <th className="px-4 py-3 font-semibold tracking-wide">Пользователь</th>
              <th className="px-4 py-3 font-semibold tracking-wide">Оборудование</th>
              <th className="px-4 py-3 font-semibold text-right tracking-wide">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-400/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-cyan-100/60 text-lg italic">
                  Ничего не найдено
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-cyan-400/5 hover:shadow-lg transition group"
                >
                  <td
                    className="px-6 py-3 cursor-pointer text-cyan-300 font-semibold hover:underline transition"
                    onClick={() => onEdit(item)}
                  >
                    {item.name}
                  </td>
                  <td
                    className="px-4 py-3 cursor-pointer text-cyan-200 hover:underline transition"
                    onClick={() => onEdit(item)}
                  >
                    {item.version}
                  </td>
                  <td className="px-4 py-3">{item.licenseKey || '—'}</td>
                  <td className="px-4 py-3">{item.assignedTo || '—'}</td>
                  <td className="px-4 py-3">{item.deviceId != null ? item.deviceId : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Удалить ПО "${item.name}"?`)) {
                          onDelete(item.id);
                        }
                      }}
                      className="text-pink-500 hover:text-pink-400 underline text-base font-semibold px-2 py-1 rounded-lg transition"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
