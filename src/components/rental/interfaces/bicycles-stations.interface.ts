export interface IBicycleStations {
    id: number,
    quantity: number,
    station: {
        id: number,
        name: string,
        address: string,
        img_path: string,
    },
    bicycle: {
        id: number,
        name: string,
        description: string,
        frame_size: number,
        cyclist_min_height: number,
        cyclist_max_height: number,
        price_per_hour: string,
        quantity: number,
        img_path: string,
        created_at: string,
        updated_at: string
    }
}