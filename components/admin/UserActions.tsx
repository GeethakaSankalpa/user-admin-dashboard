"use client";

import React, { useState } from "react";
import { X, Edit2, Trash2 } from "lucide-react";

interface UserActionsProps {
  userId: string;
  onUpdate?: () => void;
  currentData?: {
    name: string;
    email: string;
    username: string;
    accessLevel: "admin" | "editor" | "viewer";
    status: "active" | "deactivated";
  };
}

const UserActions: React.FC<UserActionsProps> = ({ userId, onUpdate, currentData }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: currentData?.name || "",
    email: currentData?.email || "",
    username: currentData?.username || "",
    accessLevel: currentData?.accessLevel || "editor",
    status: currentData?.status || "active",
  });

  // DELETE HANDLER
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");

      alert("User deleted successfully!");
      setDeleteModalOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error(error);
      alert("Error deleting user");
    }
  };

  // EDIT HANDLER
  const handleEdit = async () => {
    try {
      const updateData: any = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key as keyof typeof formData]) {
          updateData[key] = formData[key as keyof typeof formData];
        }
      });
      if (!Object.keys(updateData).length) return;

      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      alert("User updated successfully!");
      setEditModalOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error(error);
      alert("Error updating user");
    }
  };

  const isDeactivated = currentData?.status === "deactivated";

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => !isDeactivated && setEditModalOpen(true)}
        disabled={isDeactivated}
        className={`relative flex items-center px-2 py-1 rounded text-white transition-all
          ${isDeactivated ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        <Edit2 size={16} className="mr-1" />
        Edit
        {isDeactivated && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Cannot edit deactivated user
          </span>
        )}
      </button>

      <button
        onClick={() => setDeleteModalOpen(true)}
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center"
      >
        <Trash2 size={16} className="mr-1" />
        Delete
      </button>

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform transition-all animate-slideUp">
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <X size={28} />
                Edit User
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 cursor-pointer hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>
            {/* Form omitted for brevity, same as your current code */}
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-sm shadow-lg text-gray-900 dark:text-white">
            <p className="mb-4 text-lg">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActions;
