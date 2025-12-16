export interface CreateRentalDto {
    bicycle_id: number;
    station_id: number;
    start_time: string; // ISO
    end_time: string;   // ISO
}
