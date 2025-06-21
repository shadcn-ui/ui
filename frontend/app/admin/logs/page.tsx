"use client";

import { useEffect, useRef, useState } from "react";
import AdminNavbar from '@/components/AdminNavbar';
import { TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(`ws://${window.location.hostname}:3000/admin/logs`);
      ws.onmessage = (e) => {
        setLogs((prev) => [...prev.slice(-199), e.data]);
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
      <div className="max-w-5xl mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-6 shadow-xl"
        >
          <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <TerminalSquare className="w-6 h-6 text-cyan-400" />
            Live-лог
          </h1>
          <div ref={logRef} className="h-[70vh] overflow-y-auto bg-black/40 rounded-xl p-3 space-y-1 text-sm font-mono text-white/80">
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
