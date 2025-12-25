"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
    {
        title: "Администрирование проката",
        items: [
            { label: "Аренды", href: "/admin/rentals" },
        ],
    },
    {
        title: "Настройки",
        items: [
            { label: "Велосипеды", href: "/admin/settings/bicycles" },
            { label: "Станции проката", href: "/admin/settings/stations" },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-veloprimary flex flex-col min-w-64">
            <div className="p-6 text-xl font-bold">
                Панель администратора
            </div>

            <nav className="flex-1 px-4 space-y-6">
                {menu.map(section => (
                    <div key={section.title}>
                        <div className="text-xs uppercase text-white mb-2">
                            {section.title}
                        </div>

                        <ul className="space-y-1">
                            {section.items.map(item => {
                                const active = pathname.startsWith(item.href);

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`
                                                block rounded-lg px-3 py-2
                                                ${active
                                                    ? "bg-veloprimary "
                                                    : "hover:bg-gray-100 hover:text-veloprimary"}
                                                transition text-white
                                            `}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t">
                <Link
                    href="/"
                    className="block text-center text-gray-600 hover:text-black"
                >
                    ← На сайт
                </Link>
            </div>
        </aside>
    );
}
