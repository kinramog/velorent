"use client";

import { useEffect, useState } from "react";
import { API_ROUTES, BASE_URL } from "@/src/lib/routes";
import { useToastStore } from "@/store/toastStore";
import { authFetch } from "@/src/lib/authFetch";
import { IRental } from "@/src/interfaces/rental.interface";
import AdminLayout from "@/src/app/admin/layout";

interface IStation {
    id: number;
    name: string;
}

export default function AdminRentalsPage() {
    const [rentals, setRentals] = useState<IRental[]>([]);
    const [stations, setStations] = useState<IStation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRental, setSelectedRental] = useState<IRental | null>(null);
    const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
    const showToast = useToastStore((s) => s.show);

    useEffect(() => {
        // Получаем активные аренды
        authFetch(API_ROUTES.ADMIN.ALL_RENTALS)
            .then(res => res.json())
            .then(setRentals);

        // Получаем список станций
        authFetch(API_ROUTES.STATIONS.ROOT)
            .then(res => res.json())
            .then(setStations)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Загрузка...</div>;

    const finishRental = async () => {
        if (!selectedRental || !selectedStationId) return;

        const res = await authFetch(API_ROUTES.RENTALS.FINISH(selectedRental.id), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stationId: selectedStationId }),
        });

        if (res.ok) {
            showToast("success", "Аренда завершена");
            setRentals(rentals.filter(r => r.id !== selectedRental.id));
            setSelectedRental(null);
            setSelectedStationId(null);
        } else {
            const err = await res.json();
            showToast("error", err.message || "Ошибка при завершении аренды");
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Активные аренды</h1>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border p-2">Пользователь</th>
                            <th className="border p-2">Велосипед</th>
                            <th className="border p-2">Станция</th>
                            <th className="border p-2">Старт</th>
                            <th className="border p-2">Конец</th>
                            <th className="border p-2">Цена</th>
                            <th className="border p-2">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.map(r => (
                            <tr key={r.id}>
                                <td className="border p-2">{r.user.fio}</td>
                                <td className="border p-2">{r.bicycle.model.name}</td>
                                <td className="border p-2">{r.station.name}</td>
                                <td className="border p-2">{new Date(r.start_time).toLocaleString()}</td>
                                <td className="border p-2">{new Date(r.end_time).toLocaleString()}</td>
                                <td className="border p-2">{r.total_price} ₽</td>
                                <td className="border p-2">
                                    <select
                                        value={selectedRental?.id === r.id ? selectedStationId ?? '' : ''}
                                        onChange={(e) => {
                                            setSelectedRental(r);
                                            setSelectedStationId(Number(e.target.value));
                                        }}
                                        className="border p-1 mr-2"
                                    >
                                        <option value="">Выберите станцию</option>
                                        {stations.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={finishRental}
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                        disabled={selectedRental?.id !== r.id || !selectedStationId}
                                    >
                                        Завершить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
