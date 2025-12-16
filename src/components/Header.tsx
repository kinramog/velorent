"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { API_ROUTES } from "../lib/routes";
import { authFetch } from "../lib/authFetch";
import { useToastStore } from "@/store/toastStore";

export default function Header() {
    const [open, setOpen] = useState(false);
    const { isAuth, logout } = useAuthStore();
    const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
    const showToast = useToastStore((s) => s.show);

    const logoutFromServer = async () => {
        try {
            const res = await authFetch(API_ROUTES.AUTH.LOGOUT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (data.error) {
                if (typeof (data.error) == 'string') {
                    const msg = [data.message];
                    showToast("error", msg || "Произошла ошибка");
                } else {
                    showToast("error", data.message || "Произошла ошибка");
                }
                return;
            }
            showToast("success", "Вы вышли из аккаунта.");
            logout();

        } catch (error) {
            showToast("error", "Сервер недоступен");
        }
    }
    return (
        <>
            <header className="w-full bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Навигация */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/bicycle" className="hover:text-veloprimary">Каталог</Link>
                        <Link href="/stations" className="hover:text-veloprimary">Пункты проката</Link>
                    </nav>
                    {/* Лого */}
                    <Link href="/" className="text-2xl font-bold text-veloprimary">
                        VeloRent
                    </Link>
                    {/* Авторизация */}
                    <div className="hidden md:flex items-center gap-4">
                        {!isAuth ? (
                            <>
                                <button className="px-4 py-2 hover:text-velodeep hover:underline hover:cursor-pointer"
                                    onClick={() => setAuthMode("signup")}>Регистрация</button>
                                <button className="px-4 py-2 bg-veloprimary text-white rounded-md hover:bg-velodeep hover:cursor-pointer"
                                    onClick={() => setAuthMode("login")}>Войти</button>
                            </>
                        ) : (
                            <>
                                <Link href="/profile">Личный кабинет</Link>
                                <button className="px-4 py-2 hover:text-velodeep"
                                    onClick={logoutFromServer}>Выйти</button>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden text-2xl"
                    >
                        ☰
                    </button>
                </div>
                {/* Мобильное меню */}
                {open && (
                    <div className="md:hidden border-t bg-white px-6 py-4 flex flex-col gap-4">
                        <Link href="/bicycle">Каталог</Link>
                        <Link href="/stations">Пункты проката</Link>
                        <Link href="/prices">Цены</Link>
                        <hr />
                        {!isAuth ? (
                            <>
                                <button className="text-veloprimary font-semibold"
                                    onClick={() => setAuthMode("signup")}>Регистрация</button>
                                <button className="text-veloprimary font-semibold"
                                    onClick={() => setAuthMode("login")}>Войти</button>
                            </>
                        ) : (
                            <>
                                <Link className="px-4 py-2 bg-veloprimary text-white rounded-md hover:bg-velodeep"
                                    href="/profile">Личный кабинет</Link>
                                <button className="px-4 py-2 bg-veloprimary text-white rounded-md hover:bg-velodeep"
                                    onClick={logoutFromServer}>Выйти</button>
                            </>
                        )}
                    </div>
                )}
            </header>
            {
                authMode && (
                    <AuthModal
                        mode={authMode}
                        onClose={() => setAuthMode(null)}
                    />
                )
            }
        </>
    );
}

