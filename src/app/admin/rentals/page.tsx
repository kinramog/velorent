"use client";

import { useEffect, useState } from "react";
import { API_ROUTES } from "@/src/lib/routes";
import { authFetch } from "@/src/lib/authFetch";
import { useToastStore } from "@/store/toastStore";
import { IRental } from "@/src/interfaces/rental.interface";
import { RentalStatusEnum } from "@/src/constants/rental-status.enum";
import { IBicycleStations } from "@/src/interfaces/bicycles-stations.interface";


export default function AdminRentalsPage() {
    const [rentals, setRentals] = useState<IRental[]>([]);
    const [stations, setStations] = useState<IBicycleStations[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<RentalStatusEnum>(RentalStatusEnum.ACTIVE);
    const [selectedStation, setSelectedStation] = useState<Record<number, number | null>>({});
    const [actualEndTime, setActualEndTime] = useState<Record<number, string | null>>({});
    const [actualEndTimeOverrides, setActualEndTimeOverrides] = useState<Record<number, string>>({});

    const showToast = useToastStore((s) => s.show);

    const getActualEndTimeValue = (r: IRental) => {
        return (
            actualEndTimeOverrides[r.id] ??
            toLocalDatetimeInput(r.end_time_actual ?? r.end_time)
        );
    };

    const toLocalDatetimeInput = (date: Date | string) => {
        const d = new Date(date);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    useEffect(() => {
        Promise.all([
            authFetch(API_ROUTES.ADMIN.ALL_RENTALS).then(res => res.json()).then(setRentals),
            authFetch(API_ROUTES.STATIONS.ROOT).then(res => res.json()).then(setStations),
        ]).finally(() => setLoading(false));
    }, []);

    const filteredRentals = rentals.filter(r => r.status.id === statusFilter);

    const finishRental = async (rental: IRental) => {
        if (!selectedStation[rental.id]) {
            showToast("error", "Выберите станцию возврата");
            return;
        }

        const res = await authFetch(API_ROUTES.RENTALS.FINISH(rental.id), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                stationId: selectedStation[rental.id],
                end_time_actual: actualEndTime[rental.id],
            }),
        });

        if (res.ok) {
            const updatedRental: IRental = await res.json();
            showToast("success", "Аренда завершена");

            setRentals(prev => prev.map(r => r.id === updatedRental.id ? updatedRental : r));
            setSelectedStation(prev => ({ ...prev, [rental.id]: null }));
        } else {
            const err = await res.json();
            showToast("error", err.message || "Ошибка при завершении аренды");
        }
    };

    const startRental = async (rentalId: number) => {
        try {
            const res = await authFetch(API_ROUTES.RENTALS.START(rentalId), {
                method: "PATCH",
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(`Не удалось запустить аренду: ${data.message}`);
            }

            setRentals((prev) =>
                prev.map((r) =>
                    r.id === rentalId ?
                        {
                            ...r,
                            status: {
                                ...r.status,
                                id: RentalStatusEnum.ACTIVE,
                                name: "В аренде",
                            }
                        } : r
                )
            );

            showToast("success", "Аренда активирована");
        } catch (e: any) {
            showToast("error", e.message || "Ошибка старта аренды");
        }
    };
    if (loading) return <div className="p-6">Загрузка...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Администрирование аренды</h1>

            {/* Фильтр */}
            <div className="flex gap-2 mb-6">
                {[
                    { id: RentalStatusEnum.BOOKED, label: "Забронированые" },
                    { id: RentalStatusEnum.ACTIVE, label: "Активные" },
                    { id: RentalStatusEnum.COMPLETED, label: "Завершённые" },
                    { id: RentalStatusEnum.CANCELLED, label: "Отменённые" },
                ].map(s => (
                    <button
                        key={s.id}
                        onClick={() => setStatusFilter(s.id)}
                        className={`rounded-xl px-4 py-2 border ${statusFilter === s.id ? "bg-veloprimary text-white" : "bg-white"} cursor-pointer transition hover:bg-velosecondary`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Таблица */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Пользователь</th>
                            <th className="p-3 text-left">Велосипед</th>
                            <th className="p-3 text-left">Станция</th>
                            <th className="p-3 text-center">Начало</th>
                            <th className="p-3 text-center">План</th>
                            <th className="p-3 text-center">Факт</th>
                            <th className="p-3 text-center">Цена</th>
                            <th className="p-3">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRentals.map(r => {
                            const isActive = r.status.id === RentalStatusEnum.ACTIVE;
                            const isBooked = r.status.id === RentalStatusEnum.BOOKED;

                            return (
                                <tr key={r.id} className="border-t">
                                    <td className="p-3">{r.user.fio}</td>
                                    <td className="p-3">{r.bicycle.model.name}</td>
                                    <td className="p-3">{r.station.name}</td>
                                    <td className="p-3 text-center">{new Date(r.start_time).toLocaleString()}</td>
                                    <td className="p-3 text-center">{new Date(r.end_time).toLocaleString()}</td>
                                    <td className="p-3 text-center">
                                        {isActive ? (
                                            <div>
                                                <input className="cursor-pointer border border-gray-300 p-2 rounded"
                                                    type="datetime-local"
                                                    value={getActualEndTimeValue(r)}
                                                    min={toLocalDatetimeInput(r.start_time)}
                                                    onChange={(e) =>
                                                        setActualEndTimeOverrides(prev => ({
                                                            ...prev,
                                                            [r.id]: e.target.value,
                                                        }))
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            new Date(r.end_time_actual).toLocaleString()
                                        )}
                                    </td>
                                    <td className="p-3 text-center">{r.total_price} ₽</td>
                                    <td className="p-3">
                                        {isActive && (
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    className="border rounded px-2 py-1 cursor-pointer"
                                                    value={selectedStation[r.id] ?? ""}
                                                    onChange={(e) =>
                                                        setSelectedStation(prev => ({
                                                            ...prev,
                                                            [r.id]: Number(e.target.value),
                                                        }))
                                                    }
                                                >
                                                    <option value="">Станция возврата</option>
                                                    {stations.map(s => (
                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                    ))}
                                                </select>

                                                <button
                                                    onClick={() => finishRental(r)}
                                                    className="rounded bg-green-500 text-white py-1 hover:bg-green-600 cursor-pointer"
                                                    disabled={!selectedStation[r.id]}
                                                >
                                                    Завершить
                                                </button>
                                            </div>
                                        )}
                                        {isBooked && (<button
                                            onClick={() => startRental(r.id)}
                                            className="mt-2 rounded-lg border border-brown-300 px-4 py-1 text-sm ы-red-600 hover:bg-veloprimary hover:text-white transition cursor-pointer"
                                        >
                                            Старт аренды
                                        </button>)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {!filteredRentals.length && (
                    <div className="p-6 text-center text-gray-500">Аренд не найдено</div>
                )}
            </div>
        </div>
    );
}
