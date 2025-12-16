import { IBicycleModel } from "@/src/interfaces/bicycle.interface"

export interface IRental {
    id: number,
    start_time: Date,
    end_time: Date,
    start_time_actual: Date,
    end_time_actual: Date,
    total_price: number,
    station: {
        id: number,
        name: string,
        address: string,
        img_path: string
    },
    bicycle: {
        id: number,
        created_at: Date,
        updated_at: Date,
        model: IBicycleModel
    },
    status: {
        id: number,
        name: string
    },
    user: {
        id: number,
        fio: string,
        phone: string,
        email: string,
    },
}