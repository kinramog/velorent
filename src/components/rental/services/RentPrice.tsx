"use client";

interface Props {
    startTime: string | null;
    endTime: string | null;
    pricePerHour: number;
}

export default function RentPrice({
    startTime,
    endTime,
    pricePerHour,
}: Props) {
    if (!startTime || !endTime) return null;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) return null;

    const hours =
        (end.getTime() - start.getTime()) / 1000 / 3600;

    const total = Math.ceil(hours * pricePerHour);

    return (
        <div className="text-lg font-semibold">
            Стоимость: {total} ₽
        </div>
    );
}
