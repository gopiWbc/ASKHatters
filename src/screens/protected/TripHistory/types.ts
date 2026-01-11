export type TripStatus = 'COMPLETED' | 'CANCELLED';

export interface Trip {
    id: string;
    orderNumber: string;
    origin: string;
    destination: string;
    date: string;
    packageName: string;
    price: number;
    status: TripStatus;
    rating?: number;
}
