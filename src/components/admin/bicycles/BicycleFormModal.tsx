"use client";

import { useEffect, useState } from "react";
import { API_ROUTES } from "@/src/lib/routes";
import { authFetch } from "@/src/lib/authFetch";
import { IBicycleModel } from "@/src/interfaces/bicycle.interface";

interface Props {
    bicycle: IBicycleModel | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BicycleFormModal({ bicycle, onClose, onSuccess }: Props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (bicycle) {
            setName(bicycle.name);
            setPrice(String(bicycle.price_per_hour));
            setDescription(bicycle.description ?? "");
        }
    }, [bicycle]);

    const handleSubmit = async () => {
        const payload = {
            name,
            price_per_hour: Number(price),
            description,
        };

        await authFetch(
            bicycle
                ? API_ROUTES.BICYCLE_MODELS.BY_ID(bicycle.id)
                : API_ROUTES.BICYCLE_MODELS.ALL,
            {
                method: bicycle ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        );

        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {bicycle ? "Редактирование велосипеда" : "Новый велосипед"}
                </h2>

                <div className="space-y-3">
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

                    <textarea
                        className="w-full border rounded px-3 py-2"
                        placeholder="Описание"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border"
                    >
                        Отмена
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded bg-veloprimary text-white"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}
