import Image from "next/image";
import Link from "next/link";
import { IBicycle } from "@/src/interfaces/bicycle.interface";
import { API_ROUTES, BASE_URL } from "@/src/lib/routes";

type Props = {
    bike: IBicycle;
};

export default function BicycleCard({ bike }: Props) {
    const isDev = process.env.NODE_ENV === "development";
 
    return (
        <div
            className="group flex flex-col h-full w-full rounded-2xl bg-veloprimary p-6 shadow transition hover:shadow-lg max-w-[420px] lg:max-w-[380px] 2xl:max-w-[380px]"
        >
            {/* Изображение */}
            {/* <div className="relative mb-5 aspect-4/3 overflow-hidden rounded-xl bg-gray-200"> */}
            <div className="relative mb-5 aspect-square overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/5">
                <Image
                    src={BASE_URL + bike.img_path}
                    alt={bike.name}
                    fill
                    unoptimized={isDev}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Контент */}
            <div className="flex flex-col gap-1 text-white">
                <h3 className="text-lg font-semibold leading-tight">
                    {bike.name}
                </h3>

                <p className="text-sm opacity-90">
                    Тип: {bike.type?.name}
                </p>

                <p className="text-sm opacity-90">
                    Рама: {bike.frame_size}
                </p>

                <div className="mt-2 text-lg font-bold">
                    {bike.price_per_hour} ₽ / час
                </div>

                {/* Кнопка */}
                <Link
                    href={`/bicycle/${bike.id}`}
                    className="mt-3 inline-flex items-center justify-center
                               rounded-lg bg-white px-4 py-3 text-sm font-semibold
                               text-veloprimary transition hover:bg-gray-100"
                >
                    Подробнее
                </Link>
            </div>
        </div>
    );
}
