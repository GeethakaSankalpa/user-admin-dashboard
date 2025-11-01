// components/admin/UserTable.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  username: string;
  accessLevel: "admin" | "editor" | "viewer" | "member";
  status: "active" | "deactivated";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserTableProps {
  onDataChange?: () => void;
}

const UserTable: React.FC<UserTableProps> = ({ onDataChange }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    username: "",
    accessLevel: "member" as "admin" | "member",
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEditClick = (user: IUser) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      username: user.username,
      accessLevel: user.accessLevel === "admin" ? "admin" : "member",
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update user");
      }

      alert("User updated successfully!");
      setEditModalOpen(false);
      await fetchUsers();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error updating user");
    }
  };

  const handleDeleteClick = (user: IUser) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      alert("User deactivated successfully!");
      setDeleteModalOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Error deleting user");
    }
  };

  const getAccessLevelStyle = (level: string) => {
    switch (level) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "editor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "member":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "viewer":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusStyle = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Username
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Access Level
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Created At
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{user.email}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="text-sm text-gray-700 font-mono bg-gray-50 px-2 py-1 rounded inline-block">
                      {user.username}
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getAccessLevelStyle(
                        user.accessLevel
                      )}`}
                    >
                      {user.accessLevel}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "-"}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {user.status === "deactivated" ? (
                        <>
                          <button
                            type="button"
                            disabled
                            aria-disabled="true"
                            className="p-2 text-gray-400 bg-gray-50 rounded-lg transition-colors duration-150 cursor-not-allowed"
                            title="Cannot edit deactivated user"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            type="button"
                            disabled
                            aria-disabled="true"
                            className="p-2 text-gray-400 bg-gray-50 rounded-lg transition-colors duration-150 cursor-not-allowed"
                            title="Cannot delete deactivated user"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEditClick(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150 cursor-pointer"
                            title="Edit user"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform transition-all animate-slideUp">
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Pencil size={28} />
                  Edit User
                </h3>
                <p className="text-blue-100 text-sm mt-1">Update user information</p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 cursor-pointer hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
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
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
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
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 font-mono text-gray-900 placeholder-gray-400 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Access Level
                </label>
                <select
                  value={editForm.accessLevel}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
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
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold cursor-pointer transform hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform transition-all animate-slideUp">
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-pink-600 px-8 py-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Trash2 size={28} />
                  Confirm Deletion
                </h3>
                <p className="text-red-100 text-sm mt-1">This action will deactivate the user</p>
              </div>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 cursor-pointer hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Are you sure you want to deactivate{" "}
                  <span className="font-bold text-red-600">{selectedUser.name}</span>
                  {" "}({selectedUser.email})? 
                </p>
                <p className="text-gray-600 text-sm mt-3">
                  Their status will be changed to <span className="font-semibold">deactivated</span> and they will lose access to the system.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-semibold cursor-pointer transform hover:scale-105"
                >
                  Deactivate User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserTable;