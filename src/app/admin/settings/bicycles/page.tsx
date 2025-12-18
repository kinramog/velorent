"use client";

import { useEffect, useState } from "react";
import { API_ROUTES } from "@/src/lib/routes";
import { authFetch } from "@/src/lib/authFetch";
import { IBicycleModel } from "@/src/interfaces/bicycle.interface";
import BicycleFormModal from "@/src/components/admin/bicycles/BicycleFormModal";

export default function AdminBicyclesPage() {
    const [bicycles, setBicycles] = useState<IBicycleModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBike, setEditingBike] = useState<IBicycleModel | null>(null);

    const loadBicycles = () => {
        setLoading(true);
        authFetch(API_ROUTES.BICYCLE_MODELS.ALL)
            .then(res => res.json())
            .then(data => setBicycles(data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadBicycles();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Удалить велосипед?")) return;

        await authFetch(API_ROUTES.BICYCLE_MODELS.BY_ID(id), {
            method: "DELETE",
        });

        loadBicycles();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Велосипеды
                </h1>

                <button
                    onClick={() => {
                        setEditingBike(null);
                        setModalOpen(true);
                    }}
                    className="bg-veloprimary text-white px-4 py-2 rounded-lg"
                >
                    + Добавить
                </button>
            </div>

            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Название</th>
                                <th className="p-3">Цена / час</th>
                                <th className="p-3">Тип</th>
                                <th className="p-3 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bicycles.map(bike => (
                                <tr key={bike.id} className="border-t">
                                    <td className="p-3 font-medium">
                                        {bike.name}
                                    </td>
                                    <td className="p-3">
                                        {bike.price_per_hour} ₽
                                    </td>
                                    <td className="p-3">
                                        {bike.type?.name}
                                    </td>
                                    <td className="p-3 text-right space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingBike(bike);
                                                setModalOpen(true);
                                            }}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Редактировать
                                        </button>

                                        <button
                                            onClick={() => handleDelete(bike.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && (
                <BicycleFormModal
                    bicycle={editingBike}
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => {
                        setModalOpen(false);
                        loadBicycles();
                    }}
                />
            )}
        </div>
    );
}
