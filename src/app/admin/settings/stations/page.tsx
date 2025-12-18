"use client";

import { useEffect, useState } from "react";
import { API_ROUTES } from "@/src/lib/routes";
import { authFetch } from "@/src/lib/authFetch";
import StationFormModal from "@/src/components/admin/stations/StationFormModal";
import { IBicycleStations } from "@/src/interfaces/bicycles-stations.interface";


export default function AdminStationsPage() {
    const [stations, setStations] = useState<IBicycleStations[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingStation, setEditingStation] = useState<IBicycleStations | null>(null);

    const loadStations = () => {
        setLoading(true);
        authFetch(API_ROUTES.STATIONS.ROOT)
            .then(res => res.json())
            .then(data => setStations(data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadStations();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Удалить станцию?")) return;

        await authFetch(API_ROUTES.STATIONS.ROOT + `/${id}`,
            { method: "DELETE" }
        );
        loadStations();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Станции проката</h1>
                <button
                    onClick={() => { setEditingStation(null); setModalOpen(true); }}
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
                                <th className="p-3">Адрес</th>
                                <th className="p-3">Описание</th>
                                <th className="p-3 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stations.map(station => (
                                <tr key={station.id} className="border-t">
                                    <td className="p-3">{station.name}</td>
                                    <td className="p-3">{station.address}</td>
                                    <td className="p-3">{station.description}</td>
                                    <td className="p-3 text-right space-x-2">
                                        <button
                                            onClick={() => { setEditingStation(station); setModalOpen(true); }}
                                            className="text-blue-600 hover:underline cursor-pointer"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleDelete(station.id)}
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
                <StationFormModal
                    station={editingStation}
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => {
                        setModalOpen(false);
                        loadStations();
                    }}
                />
            )}
        </div>
    );
}
