"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
    const { isAuth, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuth) router.push("/");
    }, [isAuth, router]);

    if (!user) return null;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Личный кабинет</h1>
            <p>Email: {user.email}</p>
        </div>
    );
}
