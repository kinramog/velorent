"use client";

import { IUser } from "@/store/interfaces/auth-user.interface";
import Image from "next/image";

interface Props {
    user: IUser;
}

export default function UserProfileCard({ user }: Props) {
    const avatar = user.img_path
        ? user.img_path
        : "/avatar-placeholder.png";

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100">
                    <Image
                        src={avatar}
                        alt="Аватар"
                        fill
                        className="object-cover"
                    />
                </div>

                <h2 className="text-xl font-semibold">
                    {user.fio || "Без имени"}
                </h2>
            </div>

            <div className="mt-6 space-y-3 text-sm">
                <div>
                    <span className="text-gray-500">Email</span>
                    <div>{user.email}</div>
                </div>

                <div>
                    <span className="text-gray-500">Телефон</span>
                    <div>{user.phone || "—"}</div>
                </div>
            </div>
        </div>
    );
}
