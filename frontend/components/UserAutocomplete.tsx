'use client';

import React, { useEffect, useState, useRef } from 'react';
import { User } from '@/types/user';
import toast from 'react-hot-toast';

interface Props {
  label: string;
  value?: number;
  onChange: (userId: number | undefined) => void;
  filterRole?: string;
  placeholder?: string;
}

export default function UserAutocomplete({
  label,
  value,
  onChange,
  filterRole,
  placeholder = 'Начните вводить имя или фамилию',
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data: User[] = await res.json();
        const result = filterRole
          ? data.filter((u) => u.role.toLowerCase() === filterRole.toLowerCase())
          : data;
        setUsers(result);
      } catch {
        toast.error('Ошибка при загрузке пользователей');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filterRole]);

  useEffect(() => {
    if (!query) {
      setFiltered([]);
      setActiveIdx(0);
      return;
    }
    const lower = query.toLowerCase();
    const results = users.filter((u) =>
      `${u.lastName} ${u.firstName} ${u.middleName || ''}`.toLowerCase().includes(lower)
    );
    setFiltered(results);
    setActiveIdx(0);
  }, [query, users]);

  const selectedUser = users.find((u) => u.id === value);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      setActiveIdx((idx) => Math.min(idx + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIdx((idx) => Math.max(idx - 1, 0));
    } else if (e.key === 'Enter' && filtered[activeIdx]) {
      e.preventDefault();
      const u = filtered[activeIdx];
      onChange(u.id);
      setIsOpen(false);
      setQuery(`${u.lastName} ${u.firstName}${u.middleName ? ' ' + u.middleName : ''}`);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Handle blur (closes dropdown with a tiny delay so click on list works)
  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => setIsOpen(false), 100);
  };
  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setIsOpen(true);
  };

  return (
    <div className="relative space-y-1">
      <label className="text-sm font-semibold text-cyan-200">{label}</label>
      <input
        ref={inputRef}
        type="text"
        className="w-full p-3 rounded-xl bg-white/10 border border-cyan-200/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        placeholder={placeholder}
        value={
          selectedUser
            ? `${selectedUser.lastName} ${selectedUser.firstName}${selectedUser.middleName ? ' ' + selectedUser.middleName : ''}`
            : query
        }
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          onChange(undefined);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
      />

      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-20 w-full max-h-48 overflow-y-auto bg-gradient-to-br from-[#193150]/95 to-[#172435]/95 border border-cyan-200/20 rounded-2xl shadow-xl mt-2 animate-fade-in">
          {filtered.map((user, idx) => (
            <li
              key={user.id}
              onMouseDown={() => {
                onChange(user.id);
                setIsOpen(false);
                setQuery(`${user.lastName} ${user.firstName}${user.middleName ? ' ' + user.middleName : ''}`);
              }}
              className={`px-4 py-2 cursor-pointer select-none transition
                ${idx === activeIdx ? 'bg-cyan-400/10 text-cyan-200' : 'hover:bg-cyan-400/10 hover:text-cyan-100'}
              `}
            >
              <span className="font-semibold text-cyan-100">
                {user.lastName} {user.firstName}
              </span>
              {user.middleName ? ` ${user.middleName}` : ''}{' '}
              <span className="text-cyan-200/70 text-xs">
                {user.position ? ` (${user.position})` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="text-xs text-cyan-200/60">Загрузка...</p>}
    </div>
  );
}
