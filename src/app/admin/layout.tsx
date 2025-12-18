"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import AdminSidebar from "../../components/admin/AdminSidebar";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const { user, isAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuth || user?.role?.name !== "admin") {
      router.replace("/");
    }
  }, [isAuth, user, router]);

  if (!isAuth || user?.role?.name !== "admin") {
    return <div>Доступ запрещён</div>;
  }

  return (
    <div className="flex min-h-screen ">

      <AdminSidebar />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
