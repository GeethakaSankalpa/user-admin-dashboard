// app/member/page.tsx
"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, LogOut, Shield, Mail, Calendar } from "lucide-react";

export default function MemberPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protect route: only members can access
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/"); // redirect to login if not authenticated
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Member Portal</h1>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <LogOut size={18} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 px-8 py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Welcome, {session.user?.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              You're logged in as a member. Enjoy your personalized experience!
            </p>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Your Account Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <User size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Full Name</p>
                    <p className="text-xl font-bold text-gray-900">{session.user?.name}</p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border-2 border-purple-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Email</p>
                    <p className="text-xl font-bold text-gray-900">{session.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Access Level Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                    <Shield size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Access Level</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">
                      {session.user?.accessLevel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border-2 border-indigo-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-600 mb-1">Account Status</p>
                    <p className="text-xl font-bold text-gray-900">Active ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    
      </main>
    </div>
  );
}