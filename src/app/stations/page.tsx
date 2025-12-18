"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { API_ROUTES, BASE_URL } from "@/src/lib/routes";
import { authFetch } from "@/src/lib/authFetch";
import { IBicycleStations } from "@/src/interfaces/bicycles-stations.interface";

export default function StationsPage() {
    const [stations, setStations] = useState<IBicycleStations[]>([]);
    const [loading, setLoading] = useState(true);
    const isDev = process.env.NODE_ENV === "development";

    useEffect(() => {
        const loadStations = async () => {
            try {
                const res = await authFetch(API_ROUTES.STATIONS.ROOT);
                const data = await res.json();
                setStations(data);
            } catch (err) {
                console.error("Ошибка загрузки станций:", err);
            } finally {
                setLoading(false);
            }
        };

        loadStations();
    }, []);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Загрузка станций...</div>;
    }

    return (
        <div className="mx-auto max-w-[1480px] px-4">

            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold mb-4">Станции проката</h1>

                {stations.length === 0 && (
                    <div className="text-gray-500 text-center">Станций пока нет</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stations.map(station => (
                        <div key={station.id} className="bg-veloprimary rounded-xl shadow overflow-hidden hover:shadow-xl transition">
                            <div className="relative h-64 w-full">
                                <Image
                                    src={station.img_path ? BASE_URL + station.img_path : "/station-placeholder.jpg"}
                                    alt={station.name}
                                    fill
                                    className="object-cover"
                                    unoptimized={isDev}
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-white">{station.name}</h2>
                                <p className="text-white">{station.address}</p>
                                {station.description && <p className="mt-2 text-white">{station.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
