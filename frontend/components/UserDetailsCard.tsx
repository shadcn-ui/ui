'use client';

import { UserDetails } from '@/types/user';

interface Props {
  details: UserDetails;
  onClose: () => void;
  onEquipmentClick?: (equipmentId: number) => void;
  onSoftwareClick?: (softwareId: number) => void;
}

export default function UserDetailsCard({
  details,
  onClose,
  onEquipmentClick,
  onSoftwareClick,
}: Props) {
  const {
    lastName,
    firstName,
    middleName,
    department,
    position,
    role,
    snils,
    birthDate,
    mobilePhone,
    internalPhone,
    floor,
    cabinet,
    assignedEquipment = [],
    software = [],
  } = details;

  const formatDate = (date?: string) =>
    date && !isNaN(Date.parse(date)) ? new Date(date).toLocaleDateString() : '—';

  return (
    <div className="
      bg-gradient-to-br from-[#193554]/90 via-[#243858]/95 to-[#172740]/90
      border border-cyan-300/15 rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto text-white space-y-5
      animate-fade-in
    ">
      <div className="flex justify-between items-center border-b border-cyan-300/10 pb-3 mb-4">
        <h3 className="text-2xl font-bold text-cyan-100/90 select-none drop-shadow">📄 Подробности пользователя</h3>
        <button
          onClick={onClose}
          className="text-pink-400 hover:text-pink-300 text-2xl px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full transition"
        >
          ✖
        </button>
      </div>

      <ul className="text-base space-y-2">
        <Info label="👤 ФИО" value={<span className="font-bold text-cyan-200">{lastName} {firstName} {middleName || ''}</span>} />
        <Info label="🏢 Отдел" value={department || <span className="text-white/40">—</span>} />
        <Info label="📌 Должность" value={position || <span className="text-white/40">—</span>} />
        <Info label="🎓 Роль" value={
          <span className="font-semibold text-cyan-400">{role || <span className="text-white/40">—</span>}</span>
        } />
        <Info label="🆔 СНИЛС" value={snils || <span className="text-white/40">—</span>} />
        <Info label="📅 Дата рождения" value={formatDate(birthDate)} />
        <Info
          label="📞 Телефон"
          value={
            <>
              {mobilePhone || <span className="text-white/40">—</span>}
              <span className="text-cyan-100/30">, Вн.:</span>
              {' '}
              {internalPhone || <span className="text-white/40">—</span>}
            </>
          }
        />
        <Info
          label="🏢 Этаж/Кабинет"
          value={
            <>
              {floor || <span className="text-white/40">—</span>}, <span className="font-bold">Кабинет:</span> {cabinet || <span className="text-white/40">—</span>}
            </>
          }
        />

        <li>
          <span className="font-semibold text-cyan-300">🖥 Оборудование:</span>{' '}
          {assignedEquipment.length > 0 ? (
            <ul className="ml-4 mt-1 list-disc text-cyan-100/90 space-y-1">
              {assignedEquipment.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onEquipmentClick?.(item.id)}
                    className="text-cyan-200 hover:underline hover:text-cyan-300 font-semibold transition bg-transparent"
                  >
                    {item.name} <span className="text-cyan-100/70">({item.type}, №{item.inventoryNumber})</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : <span className="text-white/40">—</span>}
        </li>

        <li>
          <span className="font-semibold text-green-300">💽 Программное обеспечение:</span>{' '}
          {software.length > 0 ? (
            <ul className="ml-4 mt-1 list-disc text-green-100/90 space-y-1">
              {software.map((sw) => (
                <li key={sw.id}>
                  <button
                    type="button"
                    onClick={() => onSoftwareClick?.(sw.id)}
                    className="text-green-200 hover:underline hover:text-green-300 font-semibold transition bg-transparent"
                  >
                    {sw.name} {sw.version ? <span className="text-green-100/70">(v{sw.version})</span> : ''}
                  </button>
                </li>
              ))}
            </ul>
          ) : <span className="text-white/40">—</span>}
        </li>
      </ul>
    </div>
  );
}

// Универсальный инфоблок
function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <li>
      <span className="font-semibold text-cyan-100/80">{label}:</span>{' '}
      <span>{value}</span>
    </li>
  );
}
