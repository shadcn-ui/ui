'use client';

interface User {
  firstName: string;
  lastName: string;
  middleName?: string;
  role: 'user' | 'admin' | 'superuser';
  department?: string;
  mobilePhone?: string;
  internalPhone?: string;
  position?: string;
  avatarUrl?: string; // добавлено для аватарки (опционально)
}

interface UserCardProps {
  user: User;
}

const roleLabels: Record<User['role'], string> = {
  user: 'Пользователь',
  admin: 'Администратор',
  superuser: 'Суперадмин',
};

export default function UserCard({ user }: UserCardProps) {
  const fullName = [user.lastName, user.firstName, user.middleName]
    .filter(Boolean)
    .join(' ');

  // Вспомогательная функция для инициалов, если нет аватара
  const initials = [user.firstName?.[0], user.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase();

  return (
    <div className="
      bg-gradient-to-br from-[#182234]/80 via-[#1b2638]/90 to-[#13243a]/80 
      border border-cyan-400/15
      p-8 rounded-2xl shadow-2xl flex flex-col items-center 
      space-y-6 w-full max-w-md text-white
      backdrop-blur-2xl animate-fade-in
    ">
      {/* Аватар */}
      <div className="w-24 h-24 rounded-full flex items-center justify-center bg-cyan-400/15 shadow-lg mb-2 overflow-hidden">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl select-none text-cyan-200">{initials || '👤'}</span>
        )}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-center text-cyan-200 drop-shadow">
        {fullName}
      </h2>

      <div className="w-full text-base space-y-2">
        <Info
          label="Роль"
          value={<span className="font-semibold text-cyan-300">{roleLabels[user.role]}</span>}
        />
        <Info
          label="Отдел"
          value={user.department || <span className="text-white/40">Не указано</span>}
        />
        {user.position && <Info label="Должность" value={user.position} />}
        {user.mobilePhone && <Info label="📱 Мобильный" value={user.mobilePhone} />}
        {user.internalPhone && <Info label="☎️ Внутренний" value={user.internalPhone} />}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-cyan-100/70 whitespace-nowrap">{label}:</span>
      <span className="truncate">{value}</span>
    </div>
  );
}
