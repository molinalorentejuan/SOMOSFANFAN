export type User = {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
};

export type Restaurant = {
    id: number;
    ownerId?: number; // creador
    name: string;
    cuisine: string;
    address: string;
    phone: string;
    image: string;
    openingHours: string;
    description?: string;
    lat: number;
    lng: number;
};

export type Comment = {
    id: number;
    restaurantId: number;
    userId: number;
    username: string;
    text: string;
    rating?: number; // 1..5
    createdAt: string;
};

export const db: {
    users: User[];
    restaurants: Restaurant[];
    comments: Comment[];
    counters: { user: number; restaurant: number; comment: number };
} = {
    users: [],
    restaurants: [],
    comments: [],
    counters: { user: 0, restaurant: 0, comment: 0 },
};

export function nextId(kind: 'user' | 'restaurant' | 'comment') {
    db.counters[kind] += 1;
    return db.counters[kind];
}

const initialRestaurants: Omit<Restaurant, 'id'>[] = [
    {
        name: "Casa Paco",
        address: "Calle Mayor 92, Madrid",
        description: "Restaurante de Vallecas.",
        image: "/MEDIA/restauranteDeLujilloLogin.png",
        cuisine: "Española",
        phone: "+34 910 000 001",
        openingHours: "Lun-Dom 12:00–23:00",
        lat: 40.4168,
        lng: -3.7038
    },
    {
        name: "Sushi Sakura",
        address: "Avenida de América 22, Madrid",
        description: "Japonés",
        image: "/MEDIA/restauranteDeLujilloRegistro.png",
        cuisine: "Japonesa",
        phone: "+34 910 000 002",
        openingHours: "Mar-Dom 13:00–23:30",
        lat: 40.4397,
        lng: -3.6782
    }
];

export function resetDb() {
    db.counters = { user: 0, restaurant: 0, comment: 0 };
    db.users.length = 0;
    db.comments.length = 0;
    db.restaurants.length = 0;
    for (const r of initialRestaurants) {
        db.restaurants.push({ id: nextId('restaurant'), ...r });
    }
}

if (db.restaurants.length === 0) resetDb();