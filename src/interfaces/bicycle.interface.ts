export interface IBicycle {
    id: number,
    name: string,
    description: string,
    price_per_hour: number,
    quantity: number,
    frame_size: number,
    cyclist_min_height: number,
    cyclist_max_height: number,
    type: {
        id: number,
        name: number
    },
    model: {
        id: number,
        name: number
    },
    img_path: string,
}