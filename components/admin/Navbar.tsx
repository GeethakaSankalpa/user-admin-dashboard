// components/admin/Navbar.tsx
"use client";

import React from "react";
import { FiMenu } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
  toggleRef?: React.RefObject<HTMLButtonElement | null>;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, toggleRef }) => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <nav className="h-16 bg-white shadow-md flex items-center justify-between px-6 sticky top-0 z-40 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button
          ref={toggleRef}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => onToggleSidebar && onToggleSidebar()}
          aria-label="Open sidebar"
        >
          <FiMenu size={24} className="text-gray-700" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">User Management System</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
            <User size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{session?.user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{session?.user?.accessLevel}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <LogOut size={18} />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;