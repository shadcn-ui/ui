'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  department?: string;
  position?: string;
  role: string;
}

interface Props {
  value?: number;
  onChange: (userId: number | undefined) => void;
  filterRole?: string;
  placeholder?: string;
}

export default function UserSelectCard({
  value,
  onChange,
  filterRole,
  placeholder = 'Выберите пользователя',
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = filterRole
      ? `${process.env.NEXT_PUBLIC_API_URL || ''}/users?role=${encodeURIComponent(filterRole)}`
      : `${process.env.NEXT_PUBLIC_API_URL || ''}/users`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(() => {
        setUsers([]);
        toast.error('Ошибка загрузки пользователей');
      });
  }, [filterRole]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // Сброс значения, если выбранный пользователь больше не найден
  useEffect(() => {
    if (value && !users.some((u) => u.id === value)) {
      onChange(undefined);
    }
    // eslint-disable-next-line
  }, [users]);

  const selectedUser = users.find((u) => u.id === value);
  const filtered = users.filter((u) =>
    `${u.lastName} ${u.firstName} ${u.middleName || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSelect = (userId: number) => {
    onChange(userId);
    setSearch('');
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative space-y-1">
      <div className="relative">
        <input
          type="text"
          aria-label="Поиск пользователя"
          value={
            selectedUser
              ? `${selectedUser.lastName} ${selectedUser.firstName}${selectedUser.middleName ? ' ' + selectedUser.middleName : ''}`
              : search
          }
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            onChange(undefined);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
          className="w-full p-3 rounded-xl bg-white/10 border border-cyan-200/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition pr-9"
          placeholder={placeholder}
          autoComplete="off"
        />
        {(search || selectedUser) && (
          <button
            type="button"
            aria-label="Сбросить выбор"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-300 hover:text-pink-400 transition p-1"
            onClick={() => {
              setSearch('');
              onChange(undefined);
              setIsOpen(true);
            }}
            tabIndex={-1}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && (
        <ul className="
          absolute z-20 mt-2 w-full bg-gradient-to-br from-[#15304a]/95 to-[#182b42]/95
          rounded-2xl border border-cyan-200/20 max-h-60 overflow-y-auto text-white shadow-2xl animate-fade-in
        ">
          {filtered.length === 0 && (
            <li className="p-3 text-base text-cyan-100/60">Нет результатов</li>
          )}
          {filtered.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelect(user.id)}
              className={`
                p-3 cursor-pointer text-base rounded-xl transition flex flex-col
                ${user.id === value ? 'bg-cyan-400/20 text-cyan-100 font-semibold' : 'hover:bg-cyan-400/10'}
              `}
            >
              <span>
                {user.lastName} {user.firstName}
                {user.middleName && ` ${user.middleName}`}
              </span>
              <div className="flex gap-2 flex-wrap mt-0.5">
                {user.position && (
                  <span className="text-xs text-cyan-100/70 bg-cyan-900/30 px-2 py-0.5 rounded-full">
                    {user.position}
                  </span>
                )}
                {user.department && (
                  <span className="text-xs text-cyan-200/60 bg-cyan-700/20 px-2 py-0.5 rounded-full">
                    {user.department}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
