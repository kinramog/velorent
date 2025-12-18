export interface IBicycleModel {
    id: number,
    name: string,
    description: string,
    price_per_hour: number,
    frame_size: number,
    cyclist_min_height: number,
    cyclist_max_height: number,
    img_path: string,
    created_at: string,
    updated_at: string,
    type: {
        id: number,
        name: string
    },
    bicycles: [],
    bicycles_count?: number; 
}