import { IUser } from "./auth-user.interface";

export interface AuthState {
    user: IUser | null;
    token: string | null;
    isAuth: boolean;

    init: () => void;
    login: (token: string, user: IUser) => void;
    logout: () => void;
}