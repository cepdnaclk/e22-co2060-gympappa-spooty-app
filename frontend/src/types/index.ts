// Backend/API data
export interface EquipmentAPI {
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

// Frontend/Component-friendly type
export interface Equipment {
    id: number;
    sportId: number;
    name: string;
    totalQuantity: number;
    remainingQuantity: number;
}
