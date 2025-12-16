"use client";

import { useState } from "react";
import { authFetch } from "@/src/lib/authFetch";
import { useAuthStore } from "@/store/authStore";
import { API_ROUTES } from "@/src/lib/routes";
import { useToastStore } from "@/store/toastStore";

interface Props {
    onClose: () => void;
}

export default function EditProfileModal({ onClose }: Props) {
    const { user, token, login } = useAuthStore();

    const [fio, setFio] = useState(user?.fio ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [loading, setLoading] = useState(false);
    const showToast = useToastStore((s) => s.show);

    if (!user) return null;

    const submit = async () => {
        setLoading(true);

        try {
            const res = await authFetch(
                API_ROUTES.USERS.UPDATE(user.id),
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fio, phone, email }),
                }
            );

            if (!res.ok) throw await res.json();

            const updatedUser = await res.json();
            onClose();

            login(token || "", updatedUser);

            showToast("success", "Профиль обновлён");

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-semibold">Редактировать профиль</h2>

                <input
                    value={fio}
                    onChange={e => setFio(e.target.value)}
                    placeholder="ФИО"
                    className="w-full p-2 border rounded-lg"
                />

                <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Телефон"
                    className="w-full p-2 border rounded-lg"
                />

                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    className="w-full p-2 border rounded-lg"
                />

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:underline"
                    >
                        Отмена
                    </button>

                    <button
                        onClick={submit}
                        disabled={loading}
                        className="px-4 py-2 bg-veloprimary text-white rounded-lg hover:bg-velodeep disabled:opacity-50"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}
