"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { NotificationsDropdown } from "./notifications-dropdown";
import { ProfileDropdown } from "./profile-dropdown";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const [isProfileOpen, setIsProfileOpen]           = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  function handleToggleNotifications() {
    setIsNotificationsOpen((prev) => !prev);
    setIsProfileOpen(false);
  }

  function handleToggleProfile() {
    setIsProfileOpen((prev) => !prev);
    setIsNotificationsOpen(false);
  }

  return (
    <header className="h-16 border-b border-stone-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left – sidebar toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-transparent hover:border-stone-200"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Right – notifications & profile */}
      <div className="flex items-center gap-4">
        <NotificationsDropdown
          isOpen={isNotificationsOpen}
          onToggle={handleToggleNotifications}
        />
        <ProfileDropdown
          isOpen={isProfileOpen}
          onToggle={handleToggleProfile}
        />
      </div>
    </header>
  );
}
