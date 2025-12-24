"use client";

import { useEffect, useState } from "react";
import { API_ROUTES } from "@/src/lib/routes";
import { authFetch } from "@/src/lib/authFetch";
import { IBicycleModel } from "@/src/interfaces/bicycle.interface";
import { IBicycleStations } from "@/src/interfaces/bicycles-stations.interface";
import BicycleFormModal from "@/src/components/admin/bicycles/BicycleFormModal";
import { AddBicyclesToStationModal } from "@/src/components/admin/bicycles/AddBicyclesToStationModal";
import RemoveBicyclesFromStationModal from "@/src/components/admin/bicycles/RemoveBicyclesFromStationModal";
import { Minus, Plus } from "lucide-react";

export default function AdminBicyclesPage() {
    const [bicycles, setBicycles] = useState<IBicycleModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [editingBike, setEditingBike] = useState<IBicycleModel | null>(null);
    const [removeModalBike, setRemoveModalBike] = useState<IBicycleModel | null>(null);
    const [stations, setStations] = useState<IBicycleStations[] | null>(null);

    const loadBicycles = () => {
        setLoading(true);
        authFetch(API_ROUTES.BICYCLE_MODELS.ALL)
            .then(res => res.json())
            .then(data => {
                console.log("Все модели велосипедов\n", data);
                setBicycles(data)
            })
            .finally(() => setLoading(false));
    };

    const loadStations = () => {
        authFetch(API_ROUTES.STATIONS.ROOT)
            .then(res => res.json())
            .then(data => {
                console.log("Все станции проката\n", data);
                setStations(data);
            });
    };

    useEffect(() => {
        loadBicycles();
        loadStations();
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
                    className="bg-veloprimary text-white px-4 py-2 rounded-lg cursor-pointer"
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
                                <th className="p-3 text-right">Количество</th>
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

                                    <td className="p-3 text-right font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-gray-700 mr-5">{bike.bicycles_count ?? "-"}</span>

                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => {
                                                        setEditingBike(bike);
                                                        setAddModalOpen(true);
                                                    }}
                                                    className="flex items-center justify-center w-8 h-8 rounded bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer"
                                                >
                                                    <Plus size={16} />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setRemoveModalBike(bike);
                                                        setRemoveModalOpen(true);
                                                    }}
                                                    className="flex items-center justify-center w-8 h-8 rounded bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-3 text-right space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingBike(bike);
                                                setModalOpen(true);
                                            }}
                                            className="text-blue-600 hover:underline cursor-pointer"
                                        >
                                            Редактировать
                                        </button>

                                        <button
                                            onClick={() => handleDelete(bike.id)}
                                            className="text-red-600 hover:underline cursor-pointer"
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

            {addModalOpen && (
                <AddBicyclesToStationModal
                    modelId={editingBike?.id || null}
                    stations={stations || []}
                    onClose={() => setAddModalOpen(false)}
                    onSuccess={() => {
                        setModalOpen(false);
                        loadBicycles();
                    }}
                />
            )}
            {removeModalOpen && removeModalBike && (
                <RemoveBicyclesFromStationModal
                    model_id={removeModalBike.id}
                    stations={stations || []}
                    onClose={() => setRemoveModalOpen(false)}
                    onSuccess={() => { setRemoveModalOpen(false); loadBicycles(); }}
                />
            )}
        </div>
    );
}
