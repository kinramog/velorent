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
        name: string,
        description: string,
        frame_size: number,
        cyclist_min_height: number,
        cyclist_max_height: number,
        price_per_hour: number,
        quantity: number,
        img_path: string,
        created_at: Date,
        updated_at: Date
    },
    status: {
        id: number,
        name: string
    }
}