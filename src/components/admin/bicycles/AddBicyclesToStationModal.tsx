import { authFetch } from "@/src/lib/authFetch";
import { API_ROUTES } from "@/src/lib/routes";
import { useState } from "react";

interface Props {
    modelId: number | null;
    stations: { id: number; name: string }[];
    onClose: () => void;
    onSuccess: () => void;
}

export function AddBicyclesToStationModal({
    modelId,
    stations,
    onClose,
    onSuccess,
}: Props) {
    const [stationId, setStationId] = useState("");
    const [count, setCount] = useState("1");

    const handleSubmit = async () => {
        await authFetch(API_ROUTES.BICYCLES.BULK_CREATE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model_id: modelId,
                station_id: Number(stationId),
                count: Number(count),
            }),
        });

        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                <h2 className="text-lg font-bold mb-4">
                    Добавить велосипеды
                </h2>

                <select
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={stationId}
                    onChange={e => setStationId(e.target.value)}
                >
                    <option value="">Выберите станцию</option>
                    {stations.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    min={1}
                    className="w-full border rounded px-3 py-2 mb-4"
                    value={count}
                    onChange={e => setCount(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="border px-4 py-2 rounded cursor-pointer">
                        Отмена
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-veloprimary text-white px-4 py-2 rounded cursor-pointer"
                    >
                        Добавить
                    </button>
                </div>
            </div>
        </div>
    );
}
