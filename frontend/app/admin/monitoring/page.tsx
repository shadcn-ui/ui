"use client";

import { useEffect, useState, useRef } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { MonitorSmartphone, TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface MonitorItem {
  id: number;
  name: string;
  ipAddress?: string | null;
  status: string;
}

export default function AdminMonitoringPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [equipment, setEquipment] = useState<MonitorItem[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/monitoring`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setEquipment(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Ошибка загрузки статусов');
      setEquipment([]);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(`ws://${window.location.hostname}:3000/admin/logs`);
      ws.onmessage = (e) => {
        setLogs((prev) => [...prev.slice(-29), e.data]);
        setTimeout(() => {
          if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
        }, 50);
      };
    } catch {
      toast.error('WebSocket error');
    }
    return () => { if (ws) ws.close(); };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white pt-20 px-3 md:px-10 py-10">
      <AdminNavbar />
      <div className="max-w-5xl mx-auto space-y-10 mt-8">
        <div className="flex items-center gap-3">
          <MonitorSmartphone className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-200">Мониторинг</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-6 shadow-xl space-y-2"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MonitorSmartphone className="w-5 h-5 text-cyan-400" /> Статус оборудования
          </h2>
          {equipment.length === 0 ? (
            <div className="text-white/60">Нет данных</div>
          ) : (
            equipment.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-xl">
                <span>{item.name}{item.ipAddress ? ` (${item.ipAddress})` : ''}</span>
                <span className={`text-sm font-semibold ${item.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.status === 'online' ? '🟢 Онлайн' : '🔴 Оффлайн'}
                </span>
              </div>
            ))
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TerminalSquare className="w-5 h-5 text-cyan-400" /> Последние логи
          </h2>
          <div ref={logRef} className="h-64 overflow-y-auto bg-black/40 rounded-xl p-3 text-sm font-mono text-white/80 space-y-1">
            {logs.length === 0 ? (
              <div className="text-white/60">Нет событий</div>
            ) : (
              logs.map((log, idx) => <div key={idx}>{log}</div>)
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
