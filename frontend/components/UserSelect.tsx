'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { User } from '@/types/user';
import { User as UserIcon, X } from 'lucide-react';

interface UserSelectCardProps {
  label?: string;
  value?: number;
  onChange: (userId: number | undefined) => void;
  placeholder?: string;
  filterRole?: string;
  enableDepartmentFilter?: boolean;
}

export default function UserSelectCard({
  label,
  value,
  onChange,
  placeholder = 'Выберите пользователя',
  filterRole,
  enableDepartmentFilter = false,
}: UserSelectCardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const filtered = filterRole
          ? list.filter((u) => u.role?.toLowerCase() === filterRole.toLowerCase())
          : list;
        setUsers(filtered);
      } catch (err) {
        setUsers([]);
        // Можно обработать ошибку тут
      }
    };
    load();
  }, [filterRole]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line
  }, [isOpen]);

  const departments = useMemo(() => {
    return Array.from(new Set(users.map((u) => u.department).filter(Boolean))).sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return users.filter((u) => {
      const fullName = `${u.lastName} ${u.firstName} ${u.middleName || ''}`.toLowerCase();
      const phones = (u.mobilePhone || '') + (u.internalPhone || '');
      return (
        (!q || fullName.includes(q) || phones.includes(q)) &&
        (!selectedDepartment || u.department === selectedDepartment)
      );
    });
  }, [search, selectedDepartment, users]);

  const selectedUser = users.find((u) => u.id === value);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'Tab') setIsOpen(false);
  }

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      {label && (
        <label className="text-sm font-semibold text-cyan-200">{label}</label>
      )}

      {enableDepartmentFilter && (
        <select
          className="w-full p-3 rounded-xl bg-white/10 border border-cyan-200/10 text-white mb-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">Все отделы</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      )}

      <div className="relative">
        <input
          type="text"
          className="w-full p-3 rounded-xl bg-white/10 border border-cyan-200/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition pr-10"
          placeholder={placeholder}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            onChange(undefined);
          }}
          value={selectedUser ? `${selectedUser.lastName} ${selectedUser.firstName}` : search}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
        {(search || selectedUser) && (
          <button
            type="button"
            aria-label="Сбросить выбор"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-200 hover:text-pink-400 transition p-1"
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
          absolute z-30 w-full mt-2 max-h-64 overflow-y-auto
          bg-gradient-to-br from-[#162d47]/95 to-[#183146]/95
          border border-cyan-200/20 rounded-2xl shadow-2xl animate-fade-in
        ">
          {filteredUsers.length === 0 && (
            <li className="px-4 py-3 text-cyan-100/70 text-base">Нет результатов</li>
          )}
          {filteredUsers.map((user) => {
            const isSelected = user.id === value;
            return (
              <li
                key={user.id}
                onClick={() => {
                  onChange(user.id);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`
                  flex items-start gap-3 px-4 py-3 cursor-pointer
                  ${isSelected ? 'bg-cyan-400/20' : 'hover:bg-cyan-400/10'}
                  text-white transition rounded-xl
                `}
                tabIndex={0}
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-400/20 text-xl font-bold text-cyan-200 select-none">
                  {user.firstName?.[0] ?? <UserIcon size={18} />}
                </div>
                <div className="flex flex-col text-base">
                  <span className="font-semibold text-cyan-100">
                    {user.lastName} {user.firstName}
                  </span>
                  {user.position && <span className="text-cyan-100/60 text-sm">{user.position}</span>}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {user.department && (
                      <span className="text-xs bg-cyan-700/50 text-cyan-100 px-2 py-0.5 rounded-full">
                        {user.department}
                      </span>
                    )}
                    {user.internalPhone && (
                      <span className="text-xs text-cyan-100/70">доб. {user.internalPhone}</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
