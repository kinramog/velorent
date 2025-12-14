"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import UserProfileCard from "@/src/components/profile-user/UserInfo";
import RentalHistory from "@/src/components/profile-user/UserRentalHistory";

export default function ProfilePage() {
    const { user, isAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuth) router.push("/");
    }, [isAuth, router]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-velosecondary p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                <UserProfileCard user={user} />
                <div className="lg:col-span-3">
                    <RentalHistory />
                </div>
            </div>
        </div>
    );
}
