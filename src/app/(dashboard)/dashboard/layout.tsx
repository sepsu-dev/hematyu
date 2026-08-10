"use client";

import { useState } from "react";
import { DashboardSidebar } from "./_components/sidebar";
import { DashboardHeader } from "./_components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-900 font-sans flex relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-[20%] w-[500px] h-[500px] bg-[#E35B30]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Sidebar */}
      <DashboardSidebar isCollapsed={isCollapsed} />

      {/* Main area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? "pl-16" : "pl-60"
        }`}
      >
        <DashboardHeader
          onToggleSidebar={() => setIsCollapsed((prev) => !prev)}
        />

        <main className="flex-1 p-8 bg-[#FAF6F0]">
          {children}
        </main>
      </div>
    </div>
  );
}
