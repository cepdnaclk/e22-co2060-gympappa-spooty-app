export interface Equipment {
    id: number;
    sport_id: number;
    name: string;
    total_quantity: number;
    remaining_quantity: number;
}

export interface Sport {
    id: number;
    name: string;
}