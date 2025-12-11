'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from './api';

/* ================= AUTH ================= */
interface AuthState {
    user: { username: string; email: string; role: string } | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            async login(email, password) {
                const { token, user } = await api<{ 
                    token: string; 
                    user: { username: string; email: string; role: string } 
                }>('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                });
                localStorage.setItem('token', token);
                set({ token, user });
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
