"use client";

import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { API_ROUTES } from "../lib/routes";
import { useToastStore } from "@/store/toastStore";

export default function AuthModal({
    mode,
    onClose,
}: {
    mode: "login" | "signup";
    onClose: () => void;
}) {
    const login = useAuthStore((s) => s.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const showToast = useToastStore((s) => s.show);

    const submit = async () => {
        try {
            const res = await fetch(API_ROUTES.AUTH.BASE + "/" + mode, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            console.log(data);

            if (data.error) {
                if (typeof (data.message) == 'string') {
                    const msg = [data.message];
                    showToast("error", msg || "Произошла ошибка");
                } else {
                    showToast("error", data.message || "Произошла ошибка");
                }
                return;
            }

            if (mode === "login") {
                login(data.access_token, data.user);
                onClose();
                return;
            }
            showToast("success", "Регистрация прошла успешно. Теперь вы можете войти.");
            onClose();
        } catch (error) {
            showToast("error", "Сервер недоступен");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[360px]">
                <h2 className="text-xl font-bold mb-4">
                    {mode === "login" ? "Вход" : "Регистрация"}
                </h2>

                <input
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full mb-4 p-2 border rounded"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <button className="hover:cursor-pointer hover:underline " onClick={onClose}>Отмена</button>
                    <button
                        onClick={submit}
                        className="bg-veloprimary text-white px-4 py-2 rounded hover:cursor-pointer hover:bg-velodeep transition"
                    >
                        {mode === "login" ? "Войти" : "Зарегистрироваться"}
                    </button>
                </div>
            </div>
        </div>
    );
}
