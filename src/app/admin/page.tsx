"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/src/lib/authFetch";
import { API_ROUTES } from "@/src/lib/routes";
import { Bike, Users, MapPin, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStats {
    totalBicycles: number;
    activeRentals: number;
    totalUsers: number;
    stations: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authFetch(API_ROUTES.ADMIN.DASHBOARD)
            .then(res => res.json())
            .then(setStats)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-6">Загрузка...</div>;
    }

    if (!stats) {
        return <div className="p-6">Нет данных</div>;
    }

    const cards = [
        {
            title: "Велосипеды",
            value: stats.totalBicycles,
            icon: Bike,
        },
        {
            title: "Активные аренды",
            value: stats.activeRentals,
            icon: Activity,
        },
        {
            title: "Пользователи",
            value: stats.totalUsers,
            icon: Users,
        },
        {
            title: "Станции",
            value: stats.stations,
            icon: MapPin,
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Панель администратора</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => {
                    const Icon = card.icon;

                    return (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-veloprimary/10 text-veloprimary">
                                    <Icon className="w-6 h-6" />
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500">
                                        {card.title}
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {card.value}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
