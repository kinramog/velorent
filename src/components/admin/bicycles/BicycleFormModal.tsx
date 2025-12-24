"use client";

import { useEffect, useState } from "react";
import { API_ROUTES, BASE_URL } from "@/src/lib/routes";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { IBicycleModel } from "@/src/interfaces/bicycle.interface";
import { authFetch } from "@/src/lib/authFetch";
import { IBicycleType } from "@/src/interfaces/bicycle-type.interface";
import { useToastStore } from "@/store/toastStore";

interface Props {
    bicycle: IBicycleModel | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BicycleFormModal({ bicycle, onClose, onSuccess }: Props) {
    const isDev = process.env.NODE_ENV === "development";

    const showToast = useToastStore((s) => s.show);
    const { token } = useAuthStore();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [minHeight, setMinHeight] = useState("");
    const [maxHeight, setMaxHeight] = useState("");
    const [frameSize, setFrameSize] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [bicycleTypes, setBicycleTypes] = useState<IBicycleType[] | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (bicycle) {
            setName(bicycle.name);
            setType(bicycle.type.id);
            setPrice(String(bicycle.price_per_hour));
            setMinHeight(bicycle.cyclist_min_height);
            setMaxHeight(bicycle.cyclist_max_height);
            setFrameSize(bicycle.frame_size);
            setDescription(bicycle.description ?? "");
            setPreview(bicycle.img_path ? BASE_URL + bicycle.img_path : null);
        }
    }, [bicycle]);


    const loadBicycleTypes = () => {
        authFetch(API_ROUTES.BICYCLE_TYPES.ALL)
            .then(res => res.json())
            .then(data => {
                console.log("Все типы велосипедов\n", data);
                setBicycleTypes(data);
            });
    };

    useEffect(() => {
        loadBicycleTypes();
    }, []);

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
        setLoading(true);
        try {
            const payload = {
                name,
                price_per_hour: Number(price),
                description,
                type_id: type,
                cyclist_min_height: minHeight,
                cyclist_max_height: maxHeight,
                frame_size: frameSize,
            };

            // Создание или редактирование велосипеда
            const res = await fetch(
                bicycle ? API_ROUTES.BICYCLE_MODELS.BY_ID(bicycle.id) : API_ROUTES.BICYCLE_MODELS.ALL,
                {
                    method: bicycle ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw await res.json();
            const savedBike = await res.json();


            // Загрузка картинки, если выбран файл
            if (imageFile && token) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const imgRes = await fetch(API_ROUTES.BICYCLE_MODELS.SET_IMAGE(savedBike.id), {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });

                if (!imgRes.ok) throw await imgRes.json();
            }

            onSuccess();
        } catch (err: any) {
            if (typeof (err.message) == 'string') {
                const msg = [err.message];
                showToast("error", msg || "Произошла ошибка");
            } else {
                showToast("error", err.message || "Произошла ошибка");
            }
            console.error("Ошибка при сохранении велосипеда:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold">
                    {bicycle ? "Редактирование велосипеда" : "Новый велосипед"}
                </h2>

                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Название"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Цена за час"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Минимальный рост"
                    type="number"
                    value={minHeight}
                    onChange={e => setMinHeight(e.target.value)}
                />
                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Максимальный рост"
                    type="number"
                    value={maxHeight}
                    onChange={e => setMaxHeight(e.target.value)}
                />
                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Размер рамы"
                    type="number"
                    value={frameSize}
                    onChange={e => setFrameSize(e.target.value)}
                />

                <textarea
                    className="w-full border rounded px-3 py-2"
                    placeholder="Описание"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <select onChange={e => setType(e.target.value)}>
                    <option value="">Тип велосипеда</option>
                    {bicycleTypes?.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                </select>

                <div className="flex flex-col gap-2">
                    {preview && (
                        <div className="h-32 w-full relative rounded overflow-hidden border">
                            <Image
                                src={preview}
                                alt={bicycle?.name || "Велосипед"}
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
