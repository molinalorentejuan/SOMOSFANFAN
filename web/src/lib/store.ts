'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from './api';
import type { Restaurant, Comment } from './types';

/* ================= AUTH ================= */
interface AuthState {
    user: { id: number; username: string; email?: string } | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, password: string, email: string) => Promise<void>;
    logout: () => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            async login(email, password) {
                const { token, user } = await api<{ token: string; user: { id: number; username: string; email?: string } }>('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                });
                localStorage.setItem('token', token);
                set({ token, user });
            },
            async register(username, password, email) {
                const { token, user } = await api<{ token: string; user: { id: number; username: string; email?: string } }>('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ username, password, email }),
                });
                localStorage.setItem('token', token);
                set({ token, user: { ...user, email: user?.email ?? email } });
            },
            logout() {
                localStorage.removeItem('token');
                set({ token: null, user: null });
            },
        }),
        {
            name: 'auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({ token: s.token, user: s.user }),
        }
    )
);

type Id = number;

interface UiState {
    selectedRestaurantId: Id | null;
    hoveredRestaurantId: Id | null;
    setSelectedRestaurantId: (id: Id | null) => void;
    setHoveredRestaurantId: (id: Id | null) => void;
}

interface DataState {
    restaurants: Restaurant[];
    loading: boolean;
    fetchRestaurants: () => Promise<void>;
    getRestaurant: (id: number) => Promise<Restaurant>;
    addRestaurant: (payload: Partial<Restaurant>) => Promise<Restaurant>;
    updateRestaurant: (id: number, payload: Partial<Restaurant>) => Promise<Restaurant>;
    deleteRestaurant: (id: number) => Promise<void>;
    getComments: (restaurantId: number) => Promise<Comment[]>;
    addComment: (restaurantId: number, text: string, rating?: number) => Promise<{ created: Comment; comments: Comment[] }>;
    updateComment: (commentId: number, text: string) => Promise<Comment>;
    deleteComment: (commentId: number) => Promise<void>;
    getUserComments: (userId: number) => Promise<Comment[]>;
    getUserRestaurants: (userId: number) => Promise<Restaurant[]>;
}

export const useData = create<DataState & UiState>()((set, get) => ({
    // --- UI state ---
    selectedRestaurantId: null,
    hoveredRestaurantId: null,
    setSelectedRestaurantId(id) { set({ selectedRestaurantId: id }); },
    setHoveredRestaurantId(id) { set({ hoveredRestaurantId: id }); },

    // --- datos ---
    restaurants: [],
    loading: false,

    async fetchRestaurants() {
        set({ loading: true });
        try {
            const list = await api<Restaurant[]>('/restaurants');
            set({ restaurants: list });
        } finally {
            set({ loading: false });
        }
    },

    async addRestaurant(payload) {
        const body: any = {
            name: payload.name ?? '',
            address: payload.address ?? '',
            image: payload.image ?? '',
            cuisine: payload.cuisine ?? '',
            phone: payload.phone ?? '',
            openingHours: payload.openingHours ?? '',
            description: payload.description ?? '',
        };
        if (typeof payload.lat === 'number') body.lat = payload.lat;
        if (typeof payload.lng === 'number') body.lng = payload.lng;

        const created = await api<Restaurant>('/restaurants', {
            method: 'POST',
            body: JSON.stringify(body),
        });

        set({ restaurants: [created, ...get().restaurants] });
        return created;
    },

    async getComments(restaurantId) {
        return api<Comment[]>(`/restaurants/${restaurantId}/comments?ts=${Date.now()}`);
    },

    async addComment(restaurantId, text, rating) {
        return api<{ created: Comment; comments: Comment[] }>(`/restaurants/${restaurantId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ text, rating }),
        });
    },

    async updateComment(commentId, text) {
        return api<Comment>(`/comments/${commentId}`, { method: 'PUT', body: JSON.stringify({ text }) });
    },

    async deleteComment(commentId) {
        await api(`/comments/${commentId}`, { method: 'DELETE' });
    },

    async deleteRestaurant(id) {
        await api(`/restaurants/${id}`, { method: 'DELETE' });
        await get().fetchRestaurants();
    },

    async updateRestaurant(id: number, payload: Partial<Restaurant>) {
        const updated = await api<Restaurant>(`/restaurants/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });

        set({
            restaurants: get().restaurants.map(r =>
                r.id === id ? updated : r
            )
        });
        return updated;
    },

    async getRestaurant(id: number) {
        return api<Restaurant>(`/restaurants/${id}`);
    },

    async getUserComments(userId) {
        return api<Comment[]>(`/users/${userId}/comments`);
    },

    async getUserRestaurants(userId) {
        return api<Restaurant[]>(`/users/${userId}/restaurants`);
    },

}));