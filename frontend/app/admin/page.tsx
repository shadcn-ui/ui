"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Legend
} from "recharts";
import toast from "react-hot-toast";
import {
  Users, ServerCrash, FileText, SendHorizonal,
  TerminalSquare, Activity, Settings2, BarChart3, Lightbulb, CalendarClock,
  CalendarCheck, MonitorSmartphone, RefreshCw, Star
} from "lucide-react";
import { motion } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminNavbar from "@/components/AdminNavbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const statusRu: Record<string, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  COMPLETED: "Завершена",
  CANCELLED: "Отменена",
  REJECTED: "Отклонена",
  APPROVED: "Одобрена",
};
const sourceRu: Record<string, string> = {
  PORTAL: "Портал",
  TELEGRAM: "Телеграм",
  EMAIL: "E-mail",
  PHONE: "Телефон",
  UNKNOWN: "Неизвестно",
};

function getStatusRu(status: string) {
  return statusRu[status] || status || "Статус";
}
function getSourceRu(source: string) {
  return sourceRu[source] || source || "Источник";
}

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f472b6"];
const quickTools = [
  { icon: <Activity />, label: "Мониторинг", link: "/admin/monitoring" },
  { icon: <Settings2 />, label: "Настройки", link: "/admin/settings" },
  { icon: <BarChart3 />, label: "Отчёты", link: "/admin/reports" }
];

// Типизация ключей для stats и widgets
type StatsKey = "users" | "equipment" | "requests" | "telegram";
interface WidgetType {
  icon: JSX.Element;
  label: string;
  valueKey: StatsKey;
  link: string;
}
const widgets: WidgetType[] = [
  { icon: <Users className="text-sky-500 w-6 h-6" />, label: "Пользователи", valueKey: "users", link: "/admin/users" },
  { icon: <ServerCrash className="text-emerald-500 w-6 h-6" />, label: "Оборудование", valueKey: "equipment", link: "/admin/equipment" },
  { icon: <FileText className="text-amber-400 w-6 h-6" />, label: "Заявки", valueKey: "requests", link: "/admin/requests" },
  { icon: <SendHorizonal className="text-pink-500 w-6 h-6" />, label: "Telegram", valueKey: "telegram", link: "/admin/notifications" }
];

type HourlyActivity = { hour: string; count: number };

interface RequestItem {
  id: number;
  status: string;
  executor?: { id: number };
  rating?: number | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const [token, setToken] = useState<string | null>(null);

  const [stats, setStats] = useState<Record<StatsKey, number>>({ users: 0, equipment: 0, requests: 0, telegram: 0 });
  const [requestStats, setRequestStats] = useState<{ byStatus: any[]; bySource: any[] }>({ byStatus: [], bySource: [] });
  const [hourlyActivity, setHourlyActivity] = useState<HourlyActivity[]>([]);
  const [telegramNotifications, setTelegramNotifications] = useState<any[]>([]);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Для рейтинга
  const [myAverageRating, setMyAverageRating] = useState<string>("—");
  const [myId, setMyId] = useState<number | null>(null);

  // --- AUTH ---
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;
    try {
      const decoded: any = jwtDecode(token);
      const role = decoded.role?.toUpperCase();
      if (role !== "ADMIN" && role !== "SUPERUSER") router.push("/dashboard");
      setMyId(decoded.sub);
    } catch {
      router.push("/login");
    }
  }, [token, router]);

  // Получение персонального рейтинга для текущего администратора
  useEffect(() => {
    if (!token || !myId) return;
    fetch(`${API_URL}/requests/assigned`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data: RequestItem[]) => {
        const completed = Array.isArray(data)
          ? data.filter(
              r =>
                r.executor &&
                r.executor.id === myId &&
                r.status === "COMPLETED" &&
                typeof r.rating === "number"
            )
          : [];
        if (!completed.length) {
          setMyAverageRating("—");
          return;
        }
        const avg =
          completed.reduce((sum, r) => sum + (r.rating ?? 0), 0) / completed.length;
        setMyAverageRating(avg.toFixed(2));
      })
      .catch(() => setMyAverageRating("—"));
  }, [token, myId]);

  // --- Загрузка всех данных ---
  const fetchAllData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [
        statsRes, reqStatsRes, hourlyRes, insightsRes,
        calendarRes, telegramRes, equipmentRes
      ] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/stats-requests`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/hourly-activity`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/insights`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/calendar-requests`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/telegram-feed`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/equipment`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const responses = [
        statsRes,
        reqStatsRes,
        hourlyRes,
        insightsRes,
        calendarRes,
        telegramRes,
        equipmentRes,
      ];
      if (responses.some((r) => !r.ok)) throw new Error('Server error');

      setStats(await statsRes.json());
      setRequestStats(await reqStatsRes.json());
      setHourlyActivity(await hourlyRes.json());

      const insightsData = await insightsRes.json();
      setInsights(Array.isArray(insightsData.insights) ? insightsData.insights : []);

      const calData = await calendarRes.json();
      setCalendarEvents(Array.isArray(calData) ? calData : []);

      const teleData = await telegramRes.json();
      setTelegramNotifications(Array.isArray(teleData) ? teleData : []);

      const eqData = await equipmentRes.json();
      setEquipmentList(Array.isArray(eqData) ? eqData : []);
    } catch {
      toast.error("Ошибка загрузки данных");
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchAllData(); /* eslint-disable-next-line */ }, [token]);

  useEffect(() => {
    if (!token) return;
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(`ws://${window.location.hostname}:3000/admin/logs`);
      ws.onmessage = (event) => {
        setLiveLogs((prev) => [...prev.slice(-29), event.data]);
        setTimeout(() => {
          if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
        }, 100);
      };
    } catch {
      toast.error('WebSocket error');
    }
    return () => { if (ws) ws.close(); };
  }, [token]);

  const sendTelegram = async () => {
    if (!messageText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/admin/telegram-send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: messageText })
      });
      if (res.ok) {
        toast.success("Сообщение отправлено в Telegram");
        setMessageText("");
        fetchAllData();
      } else toast.error("Ошибка отправки");
    } catch {
      toast.error("Сервер не отвечает");
    }
  };

  const filteredEvents = Array.isArray(calendarEvents) && selectedDate
    ? calendarEvents.filter(e => new Date(e.date).toDateString() === selectedDate.toDateString())
    : [];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white px-3 md:px-8 py-8 md:py-14 space-y-14">
        <AdminNavbar />

      {/* Блок с рейтингом */}
      <div className="mb-8 flex items-center gap-3 text-lg">
        <Star className="w-6 h-6 text-yellow-400" />
        <span className="font-semibold text-cyan-300">
          Ваш средний рейтинг:{" "}
          {myAverageRating === "—" ? (
            <span className="text-white/60 italic">нет оценок</span>
          ) : (
            <span className="text-yellow-300">{myAverageRating} ★</span>
          )}
        </span>
      </div>

      {/* Быстрые действия */}
      <div className="flex flex-wrap justify-center gap-4">
        {quickTools.map((tool, idx) => (
          <motion.button
            key={idx}
            onClick={() => router.push(tool.link)}
            whileHover={{ scale: 1.06 }}
            className="px-6 py-3 bg-white/10 hover:bg-cyan-700/20 text-cyan-100 rounded-2xl flex items-center gap-2 border border-cyan-300/10 shadow-lg backdrop-blur-xl transition"
          >
            {tool.icon}
            <span className="font-semibold">{tool.label}</span>
          </motion.button>
        ))}
        <button
          onClick={fetchAllData}
          disabled={isLoading}
          className="px-6 py-3 flex items-center gap-2 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition text-[#191b25] font-bold shadow-lg border border-cyan-200/30 ml-4"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          Обновить
        </button>
      </div>

      {/* ВИДЖЕТЫ */}
      <div className="grid md:grid-cols-4 gap-7">
        {widgets.map((w, idx) => (
          <motion.div
            key={idx}
            onClick={() => router.push(w.link)}
            whileHover={{ scale: 1.09 }}
            className="cursor-pointer bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-2xl p-6 flex items-center gap-5 border border-cyan-300/10 hover:shadow-xl transition"
          >
            <div className="p-4 bg-cyan-800/20 rounded-full border border-cyan-400/30">{w.icon}</div>
            <div>
              <p className="text-sm text-cyan-100/80">{w.label}</p>
              <p className="text-2xl font-extrabold text-white mt-1">{stats[w.valueKey]}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Графики и статистика */}
      <div className="grid md:grid-cols-2 gap-7">
        <motion.div
          className="bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Статусы заявок
          </h2>
          {requestStats.byStatus.length === 0 ? (
            <div className="text-white/50">Нет данных для отображения</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={requestStats.byStatus.map(item => ({ ...item, status: getStatusRu(item.status) }))}>
                <XAxis dataKey="status" stroke="#a5b4fc" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
        <motion.div
          className="bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            Источники заявок
          </h2>
          {requestStats.bySource.length === 0 ? (
            <div className="text-white/50">Нет данных для отображения</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={requestStats.bySource.map(item => ({ ...item, source: getSourceRu(item.source) }))}
                  dataKey="count"
                  nameKey="source"
                  outerRadius={80}
                  label={({ source }) => source}
                >
                  {requestStats.bySource.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Активность по часам */}
      <motion.div
        className="bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-8 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-cyan-400" /> Активность по часам
        </h2>
        {hourlyActivity.length === 0 ? (
          <div className="text-white/50">Нет данных для отображения</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourlyActivity}>
              <XAxis dataKey="hour" stroke="#a5b4fc" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" name="Заявок" stroke="#4ade80" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Telegram и Live-лог */}
      <div className="grid md:grid-cols-2 gap-7">
        <motion.div
          className="bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-8 shadow-xl flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
        >
          <h2 className="text-xl font-semibold mb-4">📨 Telegram</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto border-l-4 border-cyan-300/30 pl-4 relative">
            {telegramNotifications.length === 0 && <p className="text-white/60">Нет уведомлений</p>}
            {telegramNotifications.map((n, idx) => (
              <div key={idx} className="relative mb-4">
                <div className="absolute -left-3 w-4 h-4 bg-cyan-400 rounded-full border-2 border-white"></div>
                <p className="text-cyan-200 font-semibold text-sm">{n.title}</p>
                <p className="text-white/80 text-xs">{n.message}</p>
                <p className="text-white/40 text-xs">📅 {new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1 rounded-xl px-3 py-2 bg-white/10 text-white border border-cyan-400/20 focus:ring-2 focus:ring-cyan-400/60"
            />
            <button onClick={sendTelegram} className="bg-cyan-500 px-4 py-2 rounded-xl text-white font-bold hover:bg-cyan-400 transition">
              Отправить
            </button>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-8 shadow-xl flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TerminalSquare className="w-5 h-5 text-cyan-400" /> Live-лог
          </h2>
          <div ref={logRef} className="h-64 overflow-y-auto bg-black/40 rounded-xl p-3 space-y-1 text-sm font-mono text-white/80">
            {liveLogs.length === 0 ? (
              <div className="text-white/60">Нет событий</div>
            ) : (
              liveLogs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Инсайты */}
      <div className="grid md:grid-cols-3 gap-7">
        {insights.map((text, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-cyan-900 via-blue-900 to-cyan-800/90 p-7 rounded-2xl shadow-2xl border border-cyan-400/10"
          >
            <div className="flex items-center gap-3 mb-2 text-cyan-300">
              <Lightbulb className="w-5 h-5" /> <span className="text-white font-semibold">Инсайт</span>
            </div>
            <p className="text-white/90 text-sm">{text}</p>
          </motion.div>
        ))}
      </div>

      {/* Календарь заявок и мониторинг */}
      <div className="grid md:grid-cols-2 gap-7">
        <motion.div
          className="bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-8 shadow-xl flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-cyan-400" /> Календарь заявок
          </h2>
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                setSelectedDate(value);
              }
            }}
            value={selectedDate}
            className="rounded-xl w-full text-black"
          />
          <div className="mt-4">
            {filteredEvents.length === 0 ? (
              <p className="text-white/60">Нет заявок на выбранную дату</p>
            ) : (
              <ul className="text-white/90 list-disc ml-4 space-y-1">
                {filteredEvents.map((event, idx) => (
                  <li key={idx}>{event.title}</li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-8 shadow-xl flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.15 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MonitorSmartphone className="w-5 h-5 text-cyan-400" /> Мониторинг оборудования
          </h2>
          <div className="space-y-2">
            {equipmentList.length === 0
              ? <div className="text-white/60">Нет данных об оборудовании</div>
              : equipmentList.map((device, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/10 px-4 py-2 rounded-xl">
                  <span>{device.name}</span>
                  <span className={`text-sm font-semibold ${device.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                    {device.status === 'online' ? '🟢 Онлайн' : '🔴 Оффлайн'}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
