import { create } from "zustand";
import { AuthState } from "./interfaces/auth-state.interface";

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuth: false,

    init: () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
            set({
                token,
                user: JSON.parse(user),
                isAuth: true,
            });
        }
    },

    login: (token, user) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        set({
            token,
            user,
            isAuth: true,
        });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        set({
            token: null,
            user: null,
            isAuth: false,
        });
    },
}));
