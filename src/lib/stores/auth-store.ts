"use client";

import { create } from "zustand";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    phone: string | null;
}

interface AuthState {
    user: AuthUser | null;
    isHydrated: boolean;
    setUser: (user: AuthUser | null) => void;
    hydrate: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    isHydrated: false,
    setUser: (user) => set({ user }),
    hydrate: () => set({ isHydrated: true }),
}));