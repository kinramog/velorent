"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
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
                    <Link href="/profile" className="hover:text-veloprimary">Личный кабинет</Link>
                    <Link
                        href="/login"
                        className="px-4 py-2 bg-veloprimary text-white rounded-md hover:bg-velodeep"
                    >
                        Войти
                    </Link>
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
                    <Link href="/profile">Личный кабинет</Link>
                    <Link href="/login" className="text-veloprimary font-semibold">
                        Войти
                    </Link>
                </div>
            )}
        </header>
    );
}

