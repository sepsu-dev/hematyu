"use client";

import { create } from "zustand";
import type { SidebarMenuNode } from "@/components/app-sidebar";

interface MenuState {
    menus: SidebarMenuNode[];
    setMenus: (menus: SidebarMenuNode[]) => void;
}

export const useMenuStore = create<MenuState>()((set) => ({
    menus: [],
    setMenus: (menus) => set({ menus }),
}));