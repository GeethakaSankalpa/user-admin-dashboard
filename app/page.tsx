// app/page.tsx (Login page)
"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in - FIXED VERSION
  useEffect(() => {
    if (status === "authenticated" && session) {
      if (session.user.accessLevel === "admin") {
        router.push("/admin");
      } else {
        router.push("/member");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password: password,
      });

      if (result?.error) {
        setError("Invalid email or password. Please check your credentials.");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Wait for session to update, then let useEffect handle redirect
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.reload();
      }
    } catch (error) {
      console.error("Login exception:", error);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if authenticated (useEffect will handle redirect)
  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-semibold text-lg">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 px-8 py-10 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
            <LogIn size={40} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-blue-100">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 text-gray-900 placeholder-gray-400 bg-white"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 text-gray-900 placeholder-gray-400 bg-white"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold cursor-pointer transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 pb-8 text-center">
          <p className="text-gray-600 text-sm">
            Test Accounts: 
            <br />
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              Admin: admintest@gmail.com / aGdSmiKn1103
            </span>
            <br />
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
              Member: membertest@gmail.com / mGeSmKbAeNr1204
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}