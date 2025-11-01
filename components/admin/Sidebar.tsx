// components/admin/Sidebar.tsx
"use client";

import React, { useEffect } from "react";
import { FiHome, FiUsers, FiSettings, FiMenu } from "react-icons/fi";
import FocusLock from "react-focus-lock";

interface SidebarProps {
  open?: boolean;
  setOpen?: (v: boolean) => void;
  toggleRef?: React.RefObject<HTMLButtonElement | null>;
}

const Sidebar: React.FC<SidebarProps> = ({ open = false, setOpen, toggleRef }) => {
  const links = [
    { name: "Dashboard", icon: <FiHome /> },
    { name: "Users", icon: <FiUsers /> },
    { name: "Settings", icon: <FiSettings /> },
  ];

  // Determine classes for responsive behavior.
  // - On small screens: when open -> fixed overlay drawer (w-64), otherwise hidden.
  // - On md+ screens: show as sidebar; width depends on open state (md:w-60 when open, md:w-16 when closed).
  const containerClass = `${
    open
      ? "fixed inset-y-0 left-0 w-64 z-50 md:relative md:w-60"
      : "hidden md:relative md:w-16"
  } bg-white shadow-md transition-all duration-300 flex flex-col h-screen shrink-0`;

  // Close on Escape and return focus to toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        if (setOpen) setOpen(false);
        setTimeout(() => toggleRef?.current?.focus(), 0);
      }
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen, toggleRef]);

  return (
    <aside className={containerClass}>
      <FocusLock disabled={!open} returnFocus>
        <div
          className="flex flex-col h-full"
          role={open ? "dialog" : undefined}
          aria-modal={open ? true : undefined}
          aria-label={open ? "Main menu" : undefined}
        >
          <div className="flex items-center justify-between p-4">
            {open && <span className="font-bold text-lg">Admin</span>}
            <button
              onClick={() => {
                if (setOpen) setOpen(!open);
                if (!open) setTimeout(() => toggleRef?.current?.focus(), 0);
              }}
              aria-label="Toggle sidebar"
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <FiMenu size={24} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col mt-4">
            {links.map((link) => (
              <a
                key={link.name}
                href="#"
                className="flex items-center p-4 text-gray-700 hover:bg-purple-100 transition-colors"
              >
                <span className="mr-4">{link.icon}</span>
                {open && link.name}
              </a>
            ))}
          </nav>
        </div>
      </FocusLock>
    </aside>
  );
};

export default Sidebar;
