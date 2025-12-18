"use client";

import { IUser } from "@/store/interfaces/auth-user.interface";
import Image from "next/image";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { API_ROUTES, BASE_URL } from "@/src/lib/routes";
import { useAuthStore } from "@/store/authStore";

interface Props {
    user: IUser;
}

export default function UserProfileCard({ user }: Props) {
    const isDev = process.env.NODE_ENV === "development";

    const [editOpen, setEditOpen] = useState(false);
    const { token, login } = useAuthStore();
    const [loading, setLoading] = useState(false);


    const onAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        if (!file.type.startsWith("image/")) {
            alert("Можно загружать только изображения");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            setLoading(true);

            const res = await fetch(
                API_ROUTES.USERS.SET_IMAGE(user.id),
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );
            if (!res.ok) {
                throw await res.json();
            }

            const updatedUser = await res.json();

            login(token, updatedUser);
        } catch (e) {
            console.error("Ошибка загрузки аватара", e);
        } finally {
            setLoading(false);
        }
    };

    console.log(user);
    const avatar = user.img_path
        ? BASE_URL + user.img_path
        : "/avatar-placeholder.png";
    console.log(avatar);

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100">
                    <Image
                        src={avatar}
                        alt="Аватар"
                        fill
                        className="object-cover"
                        unoptimized={isDev}
                    />
                </div>
                <label className="text-sm text-blue-600 cursor-pointer hover:underline">
                    {loading ? "Загрузка..." : "Сменить фото"}
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={onAvatarChange}
                        disabled={loading}
                    />
                </label>

                <h2 className="text-xl font-semibold">
                    {user.fio || "Без имени"}
                </h2>
            </div>

            <div className="mt-6 space-y-3 text-sm">
                <div>
                    <span className="text-gray-500">Email</span>
                    <div>{user.email}</div>
                </div>

                <div>
                    <span className="text-gray-500">Телефон</span>
                    <div>{user.phone || "—"}</div>
                </div>
            </div>

            <button
                onClick={() => setEditOpen(true)}
                className="mt-4 w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
                Редактировать профиль
            </button>

            {editOpen && (
                <EditProfileModal onClose={() => setEditOpen(false)} />
            )}

        </div>
    );
}
