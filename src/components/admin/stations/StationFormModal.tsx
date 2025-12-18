"use client";

import { useEffect, useState } from "react";
import { API_ROUTES, BASE_URL } from "@/src/lib/routes";
import { authFetch } from "@/src/lib/authFetch";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { useToastStore } from "@/store/toastStore";
import { IBicycleStations } from "@/src/interfaces/bicycles-stations.interface";

interface Props {
    station: IBicycleStations | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function StationFormModal({ station, onClose, onSuccess }: Props) {
    const isDev = process.env.NODE_ENV === "development";
    const showToast = useToastStore((s) => s.show);
    const { token } = useAuthStore();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (station) {
            setName(station.name);
            setAddress(station.address);
            setDescription(station.description ?? "");
            setPreview(station.img_path ? BASE_URL + station.img_path : null);
        }
    }, [station]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Можно загружать только изображения");
            return;
        }

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!token) return;

        setLoading(true);
        try {
            // 1. Создаем или редактируем станцию
            const payload = { name, address, description };
            const res = await authFetch(API_ROUTES.STATIONS.BY_ID(station?.id),
                {
                    method: station?.id ? "PATCH" : "POST",
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw await res.json();
            const savedStation = await res.json();
            console.log(savedStation)
            // 2. Загружаем картинку, если выбран файл
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const imgRes = await fetch(API_ROUTES.STATIONS.SET_IMAGE(savedStation.id), {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                if (!imgRes.ok) throw await imgRes.json();
            }

            onSuccess();
        } catch (err) {
            console.error("Ошибка при сохранении станции:", err);
            showToast("error", "Ошибка при сохранении. Проверьте консоль.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold">
                    {station ? "Редактирование станции" : "Новая станция"}
                </h2>

                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Название станции"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Адрес"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />

                <textarea
                    className="w-full border rounded px-3 py-2"
                    placeholder="Описание"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <div className="flex flex-col gap-2">
                    {preview && (
                        <div className="h-32 w-full relative rounded overflow-hidden border">
                            <Image
                                src={preview}
                                alt={station?.name || "Станция"}
                                fill
                                className="object-cover"
                                unoptimized={isDev}
                            />
                        </div>
                    )}
                    <label className="text-sm text-blue-600 cursor-pointer hover:underline">
                        {loading ? "Загрузка..." : "Выбрать изображение"}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                            disabled={loading}
                        />
                    </label>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border cursor-pointer"
                        disabled={loading}
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded bg-veloprimary text-white cursor-pointer"
                        disabled={loading}
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}
