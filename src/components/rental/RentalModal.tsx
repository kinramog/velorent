"use client";

import { useState } from "react";
import { CreateRentalDto } from "./interfaces/rental.interface";
import { authFetch } from "@/src/lib/authFetch";
import { API_ROUTES } from "@/src/lib/routes";
import RentPrice from "./services/RentPrice";
import { IBicycleStations } from "./interfaces/bicycles-stations.interface";
import { useToastStore } from "@/store/toastStore";

interface Props {
    bicycleId: number;
    pricePerHour: number;
    stations: IBicycleStations[] | null;
    onClose: () => void;
    onSuccess: () => void;
}

const createRental = async (data: CreateRentalDto) => {
    const res = await authFetch(API_ROUTES.RENTALS.CREATE, {
        method: "POST",
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        throw result;
    }

    return result;
};

export default function RentModal({
    bicycleId,
    pricePerHour,
    stations,
    onClose,
    onSuccess,
}: Props) {
    const showToast = useToastStore((s) => s.show);

    const [stationId, setStationId] = useState<number | null>(null);

    const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
    const [startHour, setStartHour] = useState<number | null>(null);

    const [endDate, setEndDate] = useState("");
    const [endHour, setEndHour] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);

    const HOURS = Array.from({ length: 24 }, (_, i) => i);

    function buildDate(date: string, hour: number) {
        const d = new Date(date);
        d.setHours(hour, 0, 0, 0);
        return d.toISOString();
    }

    const calculatedStart =
        startDate && startHour !== null
            ? buildDate(startDate, startHour)
            : null;

    const calculatedEnd =
        endDate && endHour !== null
            ? buildDate(endDate, endHour)
            : null;

    const handleSubmit = async () => {
        if (
            !stationId ||
            !startDate || startHour === null ||
            !endDate || endHour === null
        ) {
            showToast("error", "Выберите станцию, дату и час");
            return;
        }

        const start = new Date(startDate);
        start.setHours(startHour, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(endHour, 0, 0, 0);

        if (end <= start) {
            showToast("error", "Время окончания должно быть позже начала");
            return;
        }

        try {
            setLoading(true);

            await createRental({
                bicycle_id: bicycleId,
                station_id: stationId,
                start_time: start.toISOString(),
                end_time: end.toISOString(),
            });

            showToast("success", "Аренда успешно создана");
            onSuccess();
            onClose();
        } catch (e: any) {
            showToast(
                "error",
                Array.isArray(e.message)
                    ? e.message.join("\n")
                    : e.message || "Ошибка аренды"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4">
                <h2 className="text-xl font-semibold">Аренда велосипеда</h2>

                <select
                    value={stationId ?? ""}
                    onChange={(e) => setStationId(Number(e.target.value))}
                    className="w-full rounded-lg border px-3 py-2"
                >
                    <option value="">Станция проката</option>
                    {stations?.map((s) => (
                        <option key={s.station.id} value={s.station.id}>
                            {s.station.name}
                        </option>
                    ))}
                </select>

                {/* Начало аренды */}
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 10)}
                        className="rounded-lg border px-3 py-2"
                    />

                    <select
                        value={startHour ?? ""}
                        onChange={(e) => setStartHour(Number(e.target.value))}
                        className="rounded-lg border px-3 py-2"
                    >
                        <option value="">Час</option>
                        {HOURS.map((h) => (
                            <option key={h} value={h}>
                                {String(h).padStart(2, "0")}:00
                            </option>
                        ))}
                    </select>
                </div>

                {/* Конец аренды */}
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().slice(0, 10)}
                        className="rounded-lg border px-3 py-2"
                    />

                    <select
                        value={endHour ?? ""}
                        onChange={(e) => setEndHour(Number(e.target.value))}
                        className="rounded-lg border px-3 py-2"
                    >
                        <option value="">Час</option>
                        {HOURS.map((h) => (
                            <option key={h} value={h}>
                                {String(h).padStart(2, "0")}:00
                            </option>
                        ))}
                    </select>
                </div>

                <RentPrice
                    startTime={calculatedStart}
                    endTime={calculatedEnd}
                    pricePerHour={pricePerHour}
                />

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border py-2"
                    >
                        Отмена
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 rounded-xl bg-veloprimary py-2 text-white disabled:opacity-50 transition hover:opacity-90"
                    >
                        Арендовать
                    </button>
                </div>
            </div>
        </div>
    );
}
