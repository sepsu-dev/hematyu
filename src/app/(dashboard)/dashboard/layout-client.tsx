"use client";

import { useEffect, useState } from "react";
import { DashboardSidebar } from "./_components/sidebar";
import { DashboardHeader } from "./_components/header";
import { useAuthStore, type AuthUser } from "@/lib/stores/auth-store";

export function DashboardLayoutClient({
    children,
    user,
}: {
    children: React.ReactNode;
    user: AuthUser;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const setUser = useAuthStore((s) => s.setUser);
    const hydrate = useAuthStore((s) => s.hydrate);

    useEffect(() => {
        setUser(user);
        hydrate();
    }, [user, setUser, hydrate]);

    return (
        <div className="min-h-screen bg-[#FAF6F0] text-stone-900 font-sans flex relative overflow-hidden selection:bg-yellow-200">
            {/* Soft Grid Background */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#11182706_1px,transparent_1px),linear-gradient(to_bottom,#11182706_1px,transparent_1px)] bg-[size:32px_32px] opacity-100 pointer-events-none"></div>

            {/* Decorative background glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-[20%] w-[500px] h-[500px] bg-[#E35B30]/5 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Sidebar */}
            <DashboardSidebar isCollapsed={isCollapsed} />

            {/* Main area */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? "pl-16" : "pl-60"
                    }`}
            >
                <DashboardHeader
                    onToggleSidebar={() => setIsCollapsed((prev) => !prev)}
                />

                <main className="flex-1 p-8 bg-transparent relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
}