"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AdminNavbar from "@/components/AdminNavbar";
import EquipmentFormModal from "@/components/EquipmentFormModal";
import EquipmentDetailsCard from "@/components/EquipmentDetailsCard";
import UserDetailsCard from "@/components/UserDetailsCard";
import { EquipmentDetails } from "@/types/equipment";
import { User, UserDetails } from "@/types/user";

const initialForm = {
  inventoryNumber: "",
  name: "",
  type: "",
  macAddress: "",
  ipAddress: "",
  login: "",
  password: "",
  location: "",
  floor: "",
  cabinet: "",
  assignedToUserId: "",
};

export default function AdminEquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<EquipmentDetails[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [details, setDetails] = useState<EquipmentDetails | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const [form, setForm] = useState(initialForm);

  // Получить токен (из localStorage, как на дашборде)
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Заготовка для корректных headers
  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Получить список оборудования
  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/equipment`,
        {
          credentials: "include",
          headers: getAuthHeaders(),
        }
      );
      const data = await res.json();
      setEquipmentList(Array.isArray(data) ? data : []);
    } catch {
      setEquipmentList([]);
      toast.error("Ошибка загрузки оборудования");
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Получить пользователей
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          credentials: "include",
          headers: getAuthHeaders(),
        }
      );
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
      toast.error("Ошибка загрузки пользователей");
    }
  }, [getAuthHeaders]);

  // Детальная информация об оборудовании
  const viewDetails = useCallback(
    async (id: number) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`,
          {
            credentials: "include",
            headers: getAuthHeaders(),
          }
        );
        const data = await res.json();
        setDetails(data);
        setUserDetails(null);
      } catch {
        toast.error("Ошибка загрузки подробностей оборудования");
      }
    },
    [getAuthHeaders]
  );

  // Детальная информация о пользователе
  const handleUserClick = useCallback(
    async (userId: number) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/details/${userId}`,
          {
            credentials: "include",
            headers: getAuthHeaders(),
          }
        );
        const data = await res.json();
        setUserDetails(data);
      } catch {
        toast.error("Ошибка загрузки пользователя");
      }
    },
    [getAuthHeaders]
  );

  // Удалить оборудование
  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Удалить это оборудование?")) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: getAuthHeaders(),
          }
        );
        if (res.ok) {
          await fetchEquipment();
          setDetails(null);
        } else {
          alert("Ошибка при удалении");
        }
      } catch (err) {
        alert("Ошибка сети при удалении");
      }
    },
    [fetchEquipment, getAuthHeaders]
  );

  useEffect(() => {
    fetchEquipment();
    fetchUsers();
    // eslint-disable-next-line
  }, [fetchEquipment, fetchUsers]);

  // Сохранить оборудование (создать или отредактировать)
  const handleSubmit = async (e: React.FormEvent, file?: File | null) => {
    e.preventDefault();
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_API_URL}/equipment/${editId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/equipment`;

    try {
      const sanitized = {
        ...form,
        macAddress: form.macAddress || undefined,
        ipAddress: form.ipAddress || undefined,
        login: form.login || undefined,
        password: form.password || undefined,
        floor: form.floor || undefined,
        cabinet: form.cabinet || undefined,
        assignedToUserId: form.assignedToUserId
          ? Number(form.assignedToUserId)
          : null,
      };
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        body: JSON.stringify(sanitized),
      });

      if (res.ok) {
        const newEquipment = await res.json();
        const eqId = editId ?? newEquipment.id;
        if (eqId && file) {
          const formData = new FormData();
          formData.append("file", file);
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/equipment/${eqId}/upload`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
              headers: getAuthHeaders(),
            }
          );
        }

        await fetchEquipment();
        setIsModalOpen(false);
        setForm(initialForm);
        setIsEdit(false);
        setEditId(null);
      } else {
        alert("Ошибка при сохранении оборудования");
      }
    } catch (err) {
      alert("Ошибка сети при сохранении");
    }
  };

  // Открыть модалку для редактирования
  const openEditModal = (item: EquipmentDetails) => {
    setForm({
      inventoryNumber: item.inventoryNumber,
      name: item.name,
      type: item.type,
      macAddress: item.macAddress || "",
      ipAddress: item.ipAddress || "",
      login: item.login || "",
      password: item.password || "",
      location: item.location,
      floor: item.floor || "",
      cabinet: item.cabinet || "",
      assignedToUserId: item.assignedTo?.id?.toString() || "",
    });
    setEditId(item.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13151e] via-[#182232] to-[#212e43] text-white pt-20 px-3 md:px-10 py-10 space-y-10">
      <AdminNavbar />

      {/* Добавлен отступ сверху mt-10, чтобы опустить блок ниже */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 mt-10">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-200">
          🖥️ Учет оборудования
        </h1>
        <button
          onClick={() => {
            setForm(initialForm);
            setIsEdit(false);
            setEditId(null);
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-[#191b25] font-bold rounded-2xl shadow-xl border border-cyan-200/40 transition-all"
        >
          ➕ Добавить оборудование
        </button>
      </div>

      {details && (
        <EquipmentDetailsCard details={details} onUserClick={handleUserClick} />
      )}

      {userDetails && (
        <UserDetailsCard
          details={userDetails}
          onClose={() => setUserDetails(null)}
        />
      )}

      <motion.div
        className="overflow-x-auto rounded-2xl border border-cyan-400/10 bg-white/5 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <table className="min-w-full text-sm text-left text-white/90">
          <thead className="bg-cyan-900/60 text-cyan-100/70">
            <tr>
              <th className="px-4 py-3">Инв. №</th>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Тип</th>
              <th className="px-4 py-3">Расположение</th>
              <th className="px-4 py-3">Пользователь</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-white/50">
                  Загрузка оборудования...
                </td>
              </tr>
            ) : equipmentList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-white/50">
                  Оборудование не найдено
                </td>
              </tr>
            ) : (
              equipmentList.map((eq, idx) => (
                <motion.tr
                  key={eq.id}
                  className="border-t border-cyan-400/10 hover:bg-cyan-800/10 transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                >
                  <td className="px-4 py-2">{eq.inventoryNumber}</td>
                  <td
                    className="px-4 py-2 text-cyan-300 hover:underline cursor-pointer"
                    onClick={() => viewDetails(eq.id)}
                  >
                    {eq.name}
                  </td>
                  <td className="px-4 py-2">{eq.type}</td>
                  <td className="px-4 py-2">{eq.location}</td>
                  <td className="px-4 py-2">
                    {eq.assignedTo ? (
                      <span
                        onClick={() =>
                          eq.assignedTo?.id && handleUserClick(eq.assignedTo.id)
                        }
                        className="text-cyan-300 hover:underline cursor-pointer"
                        title={`${eq.assignedTo.firstName ?? ""} ${eq.assignedTo.lastName ?? ""}`}
                      >
                        {(eq.assignedTo.lastName ?? "") +
                          (eq.assignedTo.firstName
                            ? ` ${eq.assignedTo.firstName[0]}.`
                            : "")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(eq)}
                      className="text-cyan-400 hover:text-cyan-200 text-sm font-bold px-3 py-1 rounded-xl border border-cyan-300/20"
                    >
                      Редактировать
                    </button>
                    <button
                      className="text-pink-400 hover:text-pink-300 text-sm font-bold px-3 py-1 rounded-xl border border-pink-300/20"
                      onClick={() => handleDelete(eq.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      <EquipmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        isEdit={isEdit}
        users={users}
      />
    </div>
  );
}
