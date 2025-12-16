"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { API_ROUTES, BASE_URL } from "@/src/lib/routes";
import RentModal from "@/src/components/rental/RentalModal";
import { useToastStore } from "@/store/toastStore";
import { IBicycleStations } from "@/src/components/rental/interfaces/bicycles-stations.interface";
import { IBicycleModel } from "@/src/interfaces/bicycle.interface";

export default function BicyclePage() {
    const isDev = process.env.NODE_ENV === "development";
    const { id } = useParams();
    const [bicycleModel, setBicycleModel] = useState<IBicycleModel | null>(null);
    const [stations, setStations] = useState<IBicycleStations[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [rentOpen, setRentOpen] = useState(false);
    const showToast = useToastStore((s) => s.show);

    useEffect(() => {
        fetch(API_ROUTES.BICYCLE_MODELS.BY_ID(id))
            .then(res => res.json())
            .then(data => {
                console.log("Данные по велосипеду:\n", data)
                setBicycleModel(data)
            })
            .finally(() => setLoading(false));

        fetch(API_ROUTES.STATIONS.BICYCLE_STATIONS(id))
            .then(res => res.json())
            .then(data => {
                console.log("Данные по станциям, на которых есть велосипед:\n", data, API_ROUTES.STATIONS.BICYCLE_STATIONS(id))
                setStations(data)
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="p-6">Загрузка...</div>;
    }

    if (!bicycleModel) {
        return <div className="p-6">Велосипед не найден</div>;
    }

    return (
        <div className="min-h-screen bg-velosecondary p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Фото */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <Image
                            src={bicycleModel.img_path
                                ? BASE_URL + bicycleModel.img_path
                                : "/bicycleModel-placeholder.png"}
                            alt={bicycleModel.name}
                            fill
                            unoptimized={isDev}

                            className="object-cover"
                        />
                    </div>

                    {/* Информация */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                {bicycleModel.name}
                            </h1>

                            <p className="text-gray-600 mb-1">
                                Тип: {bicycleModel.type?.name}
                            </p>

                            <p className="text-gray-600 mb-1">
                                Размер рамы: {bicycleModel.frame_size}
                            </p>

                            <p className="text-gray-600 mb-4">
                                Рост велосипедиста: {bicycleModel.cyclist_min_height}–{bicycleModel.cyclist_max_height} см
                            </p>

                            <div className="text-2xl font-semibold text-veloprimary">
                                {bicycleModel.price_per_hour} ₽ / час
                            </div>
                        </div>

                        <button
                            onClick={() => setRentOpen(true)}

                            className="mt-4 w-full rounded-xl bg-veloprimary px-4 py-3 text-white font-semibold hover:opacity-90 cursor-pointer"
                        >
                            Арендовать
                        </button>

                    </div>
                </div>

                {/* Дополнительный блок */}
                <div className="mt-10 border-t pt-6 text-gray-700">
                    <h2 className="text-xl font-semibold mb-3">
                        О велосипеде
                    </h2>
                    <p>
                        {bicycleModel.description}
                    </p>
                </div>

                {rentOpen && (
                    <RentModal
                        model_id={bicycleModel.id}
                        pricePerHour={bicycleModel.price_per_hour}
                        stations={stations}
                        onClose={() => setRentOpen(false)}
                        onSuccess={() => {
                            showToast("success", "Велосипед забронирован!")
                        }}
                    />
                )}

            </div>
        </div>
    );
}
