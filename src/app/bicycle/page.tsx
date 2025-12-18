"use client";

import { useEffect, useMemo, useState } from "react";
import { API_ROUTES } from "../../lib/routes"
import { IBicycleType } from "@/src/interfaces/bicycle-type.interface";
import BicycleCard from "@/src/components/bicycle/BicycleCard";
import { IBicycleFilters } from "@/src/interfaces/bicycle-filters.interface";
import { IBicycleModel } from "@/src/interfaces/bicycle.interface";

// Каталог велосипедов
export default function BicycleCatalog() {
    const [bicycles, setBicycles] = useState<IBicycleModel[]>([]);
    const [bicycleTypes, setBicycleTypes] = useState<IBicycleType[]>([]);
    const [filters, setFilters] = useState<IBicycleFilters>({ type_id: null, frame_size: null, height: null });
    const [sort, setSort] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const frameSizes = useMemo(() => {
        return Array.from(new Set(bicycles.map(b => b.frame_size))).sort();
    }, [bicycles]);

    const heightRanges = useMemo(() => {
        const ranges = bicycles.map(bike => ({
            min: bike.cyclist_min_height,
            max: bike.cyclist_max_height,
        }));

        const unique = new Map<string, { min: number; max: number }>();

        ranges.forEach(r => {
            unique.set(`${r.min}-${r.max}`, r);
        });

        return Array.from(unique.values()).sort((a, b) => a.min - b.min);
    }, [bicycles]);

    const getBicycles = () => {
        fetch(API_ROUTES.BICYCLE_MODELS.ALL)
            .then((res) => res.json())
            .then((data) => {
                console.log("Модели велосипедов \n", data);
                setBicycles(data);
            });
    }

    const getBicycleTypes = () => {
        fetch(API_ROUTES.BICYCLE_TYPES.ALL)
            .then((res) => res.json())
            .then((data) => {
                console.log("Типы велосипедов \n", data);
                setBicycleTypes(data);
            });
    }
    useEffect(() => {
        getBicycles();
        getBicycleTypes();
    }, []);

    const applyFilters = (items: IBicycleModel[]): IBicycleModel[] => {
        return items
            .filter((bike) => (filters.type_id ? bike.type.id === filters.type_id : true))
            .filter((bike) => (filters.frame_size ? bike.frame_size === filters.frame_size : true))
            .filter(bike =>
                filters.height
                    ? filters.height >= bike.cyclist_min_height &&
                    filters.height <= bike.cyclist_max_height
                    : true
            )
            .sort((a, b) => {
                if (sort === "price_asc") return a.price_per_hour - b.price_per_hour;
                if (sort === "price_desc") return b.price_per_hour - a.price_per_hour;
                return 0;
            });
    };


    return (
        <div className="min-h-screen bg-velosecondary p-6">
            <div className="mx-auto max-w-[1480px] px-4">
                <h1 className="text-3xl font-bold mb-6">Каталог велосипедов</h1>

                {/* Кнопка открытия фильтров для мобильной версии */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="w-full rounded-lg bg-velobone p-3 shadow-sm font-medium"
                    >
                        Фильтры {filtersOpen ? "▲" : "▼"}
                    </button>
                </div>

                {/* Панель фильтров */}
                <div
                    className={`rounded-xl bg-velobone p-4 shadow-sm mb-8 ${filtersOpen ? "block" : "hidden"} md:inline-flex md:items-center md:gap-4 md:static`}>
                    {/* <div className="inline-flex items-center gap-4 rounded-xl bg-velobone p-4 shadow-sm mb-8"> */}
                    {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"> */}
                    <div className="mb-3 md:mb-0 md:border-r md:pr-3">
                        <select className="w-48 md:w-auto p-2 rounded-lg"
                            onChange={(e) => setFilters({ ...filters, type_id: Number(e.target.value) })}
                            value={filters.type_id ?? ''}>
                            <option value="">Тип</option>
                            {bicycleTypes.map((type) =>
                                <option key={type.id} value={type.id}>{type.name}</option>
                            )}
                        </select>
                    </div>
                    <div className="mb-3 md:mb-0 md:border-r md:pr-3">
                        <select className="w-48 md:w-auto p-2 rounded-lg" onChange={(e) => setFilters({ ...filters, frame_size: Number(e.target.value) })}
                            value={filters.frame_size ?? ''}>
                            <option value="">Размер рамы</option>
                            {frameSizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3 md:mb-0 md:border-r md:pr-3">
                        <select className="w-48 md:w-auto p-2 rounded-lg" onChange={(e) => setFilters({ ...filters, height: +(e.target.value) })}
                            value={filters.height ?? ''}>
                            <option value="">Рост</option>
                            {heightRanges.map(r => (
                                <option key={`${r.min}-${r.max}`} value={r.min}>
                                    {r.min}–{r.max} см
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3 md:mb-0 md:pr-3">
                        <select className="w-48 md:w-auto p-2 rounded-lg" onChange={(e) => setSort(e.target.value)}
                            value={sort}>
                            <option value="">Сортировка</option>
                            <option value="price_asc">Цена ↑</option>
                            <option value="price_desc">Цена ↓</option>
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            setFilters({
                                type_id: null,
                                frame_size: null,
                                height: null,
                            });
                            setSort("");
                        }}
                        className="mt-3 md:mt-0 text-sm text-blue-600 hover:underline"
                    >
                        Сбросить
                    </button>
                </div>
                {/* Список велосипедов */}
                <div className="mx-auto max-w-[1480px] px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                        {applyFilters(bicycles).map(bike => (
                            <BicycleCard key={bike.id} bike={bike} />
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
}