"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function Header() {
    const [open, setOpen] = useState(false);
    const { isAuth, logout } = useAuthStore();
    const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

    return (
        <>
            <header className="w-full bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Desktop navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/bicycle" className="hover:text-veloprimary">Каталог</Link>
                        <Link href="/stations" className="hover:text-veloprimary">Пункты проката</Link>
                        <Link href="/prices" className="hover:text-veloprimary">Цены</Link>
                    </nav>
                    {/* Лого */}
                    <Link href="/" className="text-2xl font-bold text-veloprimary">
                        VeloRent
                    </Link>
                    {/* Desktop auth */}
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
                                    onClick={logout}>Выйти</button>
                            </>
                        )}
                    </div>
                    {/* Burger */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden text-2xl"
                    >
                        ☰
                    </button>
                </div>
                {/* Mobile menu */}
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
                                    onClick={logout}>Выйти</button>
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

