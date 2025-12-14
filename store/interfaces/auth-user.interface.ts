export interface IUser {
    id: number;
    email: string,
    fio?: string,
    img_path?: string,
    phone?: string,
    role?: { id: number, name: string },
    tokenVersion?: string
}