export type Restaurant = {
    id: number;
    ownerId?: number;
    name: string;
    cuisine: string;
    address: string;
    phone: string;
    image: string;
    openingHours: string;
    description?: string;
    lat: number;
    lng: number;
    avgRating?: number | null;
    commentCount?: number;
};

export type Comment = {
    id: number;
    restaurantId: number;
    nameRestaurant: string;
    userId: number;
    username: string;
    text: string;
    rating?: number; // 1..5
    createdAt: string;
};