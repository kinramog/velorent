"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/src/lib/authFetch";
import { useAuthStore } from "@/store/authStore";
import { API_ROUTES } from "@/src/lib/routes";

interface Rental {
    id: number;
    bicycle: {
        id: number;
        model: string;
    };
    station: {
        id: number;
        name: string;
    };
    start_time: string;
    end_time: string | null;
    price: number;
    status: string;
}

export default function RentalHistory() {
    const { user } = useAuthStore();
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        authFetch(API_ROUTES.RENTALS.HISTORY(user.id))
            .then(res => res.json())
            .then(setRentals)
            .finally(() => setLoading(false));
    }, [user]);

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

    return (
        <div className="bg-white rounded-xl shadow divide-y">
            {rentals.map(rental => (
                <div
                    key={rental.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div>
                        <div className="font-medium">
                            {rental.bicycle.model}
                        </div>
                        <div className="text-sm text-gray-500">
                            {rental.station.name}
                        </div>
                        <div className="text-sm text-gray-400">
                            {new Date(rental.start_time).toLocaleString()}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="font-semibold">
                            {rental.price} ₽
                        </div>
                        <div className="text-sm text-gray-500">
                            {rental.status}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
