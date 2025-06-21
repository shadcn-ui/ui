'use client';

export default function SkeletonCard() {
  return (
    <div
      className="bg-gradient-to-br from-[#16243a]/70 via-[#22334d]/60 to-[#16282e]/70 border border-cyan-400/10
      backdrop-blur-xl p-7 rounded-2xl shadow-2xl w-full max-w-sm animate-pulse relative overflow-hidden"
      role="status"
      aria-label="Загрузка карточки"
    >
      {/* Светлый эффект “мигания” */}
      <div className="absolute inset-0 pointer-events-none z-10 animate-[shine_1.3s_linear_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex flex-col items-center space-y-7 relative z-20">
        {/* Аватар */}
        <div className="w-24 h-24 bg-cyan-400/15 rounded-full shadow-inner" />

        {/* Имя */}
        <div className="h-6 bg-white/15 rounded-xl w-2/3" />

        {/* Подписи */}
        <div className="h-4 bg-white/10 rounded-xl w-1/2" />
        <div className="h-4 bg-white/10 rounded-xl w-3/4" />
        <div className="h-4 bg-white/10 rounded-xl w-2/3" />

        {/* Кнопка */}
        <div className="h-10 w-full bg-cyan-400/10 rounded-xl" />
      </div>
      <span className="sr-only">Загрузка...</span>
      <style>{`
        @keyframes shine {
          0% { opacity: 0.4; }
          50% { opacity: 0.9; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
