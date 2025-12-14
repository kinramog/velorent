"use client";

import { useToastStore } from "@/store/toastStore";


export default function Toast() {
    const { messages, type } = useToastStore();

    if (!type) return null;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-100">
            {messages.map((msg) => (
                <div
                    key={msg}
                    className={`px-4 py-2 rounded shadow-lg text-white 
                        ${type === "error" ? "bg-red-500" : "bg-green-500"}`}>
                    {msg}
                </div>
            ))}
        </div>
    );
}
