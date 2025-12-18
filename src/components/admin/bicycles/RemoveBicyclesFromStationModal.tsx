"use client";
import { useState } from "react";
import { authFetch } from "@/src/lib/authFetch";
import { API_ROUTES } from "@/src/lib/routes";
import { IBicycleStations } from "@/src/interfaces/bicycles-stations.interface";

interface Props {
    model_id: number;
    stations: IBicycleStations[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function RemoveBicyclesFromStationModal({ model_id, stations, onClose, onSuccess }: Props) {
    const [stationId, setStationId] = useState<number | "">("");
    const [count, setCount] = useState<number>(1);

    const handleRemove = async () => {
        if (!stationId) return;

        const res = await authFetch(API_ROUTES.BICYCLES.BULK_REMOVE, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ modelId: model_id, stationId, count }),
        });

        if (res.ok) {
            onSuccess();
            onClose();
        } else {
            const err = await res.json();
            alert(err.message || "Ошибка при удалении");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Удаление велосипедов</h2>

                <div className="space-y-3">
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={stationId}
                        onChange={e => setStationId(Number(e.target.value))}
                    >
                        <option value="">Выберите станцию</option>
                        {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    <input
                        type="number"
                        min={1}
                        className="w-full border rounded px-3 py-2"
                        value={count}
                        onChange={e => setCount(Number(e.target.value))}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded border">Отмена</button>
                    <button onClick={handleRemove} className="px-4 py-2 rounded bg-red-500 text-white">Удалить</button>
                </div>
            </div>
        </div>
    );
}
