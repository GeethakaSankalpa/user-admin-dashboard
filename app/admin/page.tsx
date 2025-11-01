// app/admin/page.tsx
// main admin page

"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/admin/Navbar";
import Sidebar from "../../components/admin/Sidebar";
import UserTable from "../../components/admin/UserTable";
import { Users, UserCheck, UserPlus, X } from "lucide-react";

// user details interface for dashboard
interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  accessLevel: "admin" | "member";
  status: "active" | "deactivated";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// dashboard statistics interface
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
}

export default function AdminPage() {
  // auth and router
  const { data: session, status } = useSession();
  const router = useRouter();

  // sidebar state and stats
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    newSignups: 0,
  });


  const [loading, setLoading] = useState(true); // loading state for stats
  
  // add user modal state and form
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    accessLevel: "member" as "admin" | "member",
  });

  // Protect route: only admin can access
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.accessLevel !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch stats
  useEffect(() => {
    if (session?.user.accessLevel === "admin") fetchAndCalculateStats();
  }, [session]);

  // calculate dashboard stats
  const fetchAndCalculateStats = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const users: User[] = await res.json();

      const totalUsers = users.length;
      const activeUsers = users.filter((user) => user.status === "active").length;

      // newsignups are only users created in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newSignups = users.filter(
        (user) => new Date(user.createdAt) >= thirtyDaysAgo
      ).length;

      setStats({ totalUsers, activeUsers, newSignups });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Handle Add User form submission
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add user");
      }

      alert("User added successfully!");
      setAddModalOpen(false);
      setAddForm({
        name: "",
        email: "",
        username: "",
        password: "",
        accessLevel: "member",
      });
      await fetchAndCalculateStats();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error adding user");
    }
  };

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not admin (will redirect)
  if (!session || session.user?.accessLevel !== "admin") {
    return null;
  }

  // dashboard stat cards configuration
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "New Signups",
      value: stats.newSignups,
      icon: UserPlus,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} toggleRef={toggleButtonRef} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} toggleRef={toggleButtonRef} />
        <main className="p-6 overflow-auto">
          {/* Header with Add Button */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-600 mt-1">Monitor and manage your users</p>
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105"
            >
              <UserPlus size={20} />
              <span className="font-semibold">Add New User</span>
            </button>
          </div>

          {/* Stats Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                    <p className="text-4xl font-bold text-gray-900">
                      {loading ? (
                        <span className="inline-block w-12 h-8 bg-gray-200 rounded animate-pulse"></span>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div
                    className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center shadow-md`}
                  >
                    <stat.icon size={32} className={stat.textColor} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* User Table */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
              <p className="text-gray-600 mt-1">View, edit, and manage all users</p>
            </div>
            <UserTable onDataChange={fetchAndCalculateStats} />
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform transition-all animate-slideUp">
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <UserPlus size={28} />
                  Add New User
                </h3>
                <p className="text-blue-100 text-sm mt-1">Create a new user account</p>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 cursor-pointer hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 text-gray-900 placeholder-gray-400 bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 text-gray-900 placeholder-gray-400 bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={addForm.username}
                  onChange={(e) =>
                    setAddForm({ ...addForm, username: e.target.value })
                  }
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 font-mono text-gray-900 placeholder-gray-400 bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={addForm.password}
                  onChange={(e) =>
                    setAddForm({ ...addForm, password: e.target.value })
                  }
                  placeholder="Enter secure password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 text-gray-900 placeholder-gray-400 bg-white"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Access Level
                </label>
                <select
                  value={addForm.accessLevel}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      accessLevel: e.target.value as "admin" | "member",
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 cursor-pointer bg-white text-gray-900"
                >
                  <option value="member">👤 Member</option>
                  <option value="admin">⭐ Admin</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold cursor-pointer transform hover:scale-105"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}