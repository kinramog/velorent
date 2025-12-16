"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/src/lib/authFetch";
import { useAuthStore } from "@/store/authStore";
import { API_ROUTES } from "@/src/lib/routes";
import { IRental } from "./interfaces/rental.interface";
import { useToastStore } from "@/store/toastStore";
import { RentalStatusEnum } from "@/src/constants/rental-status.enum";

export default function RentalHistory() {
    const { user } = useAuthStore();
    const showToast = useToastStore((s) => s.show);
    const [rentals, setRentals] = useState<IRental[]>([]);
    const [loading, setLoading] = useState(true);
    const statusColor = {
        1: "text-green-600", // Забронировано
        2: "text-blue-500", // В аренде
        3: "text-gray-500", // Завершено
        4: "text-red-500", // Отменено
    };


    useEffect(() => {
        if (!user) return;

        authFetch(API_ROUTES.RENTALS.HISTORY(user.id))
            .then(res => res.json())
            .then(data => {
                console.log("История аренд \n", data);
                setRentals(data);
            })
            .finally(() => setLoading(false));
    }, [user]);


    const cancelRental = async (rentalId: number) => {
        try {
            const res = await authFetch(API_ROUTES.RENTALS.CANCEL(rentalId), {
                method: "PATCH",
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(`Не удалось отменить аренду: ${data.message}`);
            }

            setRentals((prev) =>
                prev.map((r) =>
                    r.id === rentalId ?
                        {
                            ...r,
                            status: {
                                ...r.status,
                                id: RentalStatusEnum.CANCELLED,
                                name: "Отменено",
                            }
                        }
                        :
                        r
                )
            );

            showToast("success", "Аренда отменена");
        } catch (e: any) {
            showToast("error", e.message || "Ошибка отмены аренды");
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-6">
                Загрузка истории аренд...
            </div>
        );
    }

    if (!rentals.length) {
        return (
            <div className="bg-white rounded-xl shadow p-6">
                У вас пока нет аренд
            </div>
        );
    }

    const activeRental = rentals.filter(
        (r) => r.status.id === RentalStatusEnum.BOOKED
    );

    const history = rentals.filter(
        (r) => r.status.id !== RentalStatusEnum.BOOKED
    );

    return (
        <div className="bg-white rounded-xl shadow divide-y">

            {/* Активное бронирование */}
            {activeRental && activeRental.map(activeRent => (
                <div key={activeRent.id} className="bg-velobone border border-green-200 rounded-xl shadow p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="text-lg font-semibold">
                                {activeRent.bicycle.model.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {activeRent.station.name}
                            </div>
                            <div className="text-sm text-gray-400">
                                {new Date(activeRent.start_time).toLocaleString([], {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                            <div className="text-sm text-gray-400">
                                {new Date(activeRent.end_time).toLocaleString([], {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>

                        <div className="text-right space-y-2">
                            <div className="font-bold text-lg">
                                {activeRent.total_price} ₽
                            </div>

                            <div className="text-green-600 font-medium">
                                Забронировано
                            </div>

                            <button
                                onClick={() => cancelRental(activeRent.id)}
                                className="mt-2 rounded-lg border border-red-300 px-4 py-1 text-sm text-red-600 hover:bg-red-100 transition cursor-pointer"
                            >
                                Отменить аренду
                            </button>
                        </div>
                    </div>
                </div>
            ))
        }

            {/* История */}
            <div className="bg-white rounded-xl shadow divide-y">
                {history.map((rental) => (
                    <div
                        key={rental.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                        <div>
                            <div className="text-sm text-gray-500">
                                {rental.station.name}
                            </div>
                            <div className="text-sm text-gray-400">
                                {new Date(rental.start_time).toLocaleString()}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="font-semibold">
                                {rental.total_price} ₽
                            </div>
                            <div
                                className={`text-sm ${statusColor[rental.status.id as keyof typeof statusColor]}`}
                            >
                                {rental.status.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
