"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Shield, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_superadmin: boolean;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 👇 1. FIX: Use your actual Render URL to guarantee connection
  const API_URL = "https://blog-backend-l.onrender.com";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      // 👇 2. FIX: specific check for token
      const token = (session as any)?.accessToken;
      
      if (!token) {
        throw new Error("Access Token is missing. Please Log Out and Log In again to refresh your session.");
      }

      const res = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        // 👇 3. FIX: Read the actual error from backend
        const status = res.status; // 401 or 403
        if (status === 403) {
            throw new Error("Access Denied: You are not a Super Admin.");
        } else if (status === 401) {
            throw new Error("Session Expired: Please Log Out and Log In again.");
        } else {
            throw new Error(`Server Error (${status}): Failed to load users.`);
        }
      }
    } catch (err: any) {
      console.error("Fetch Users Error:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Only run when session is ready
  useEffect(() => {
    if (status === "authenticated") {
        fetchUsers();
    } else if (status === "unauthenticated") {
        setLoading(false);
        setError("Please sign in to view this page.");
    }
  }, [status, session]);

  const toggleStatus = async (id: number) => {
    try {
      const token = (session as any)?.accessToken;
      if (!token) return;

      const res = await fetch(`${API_URL}/users/${id}/toggle-status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        fetchUsers(); // Refresh list on success
      } else {
        alert("Failed to update user status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500">
        <RefreshCw className="animate-spin mr-2" /> Loading users...
    </div>
  );

  if (error) return (
    <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-3">
            <AlertTriangle size={24} />
            <div>
                <p className="font-bold">Error Loading Users</p>
                <p className="text-sm">{error}</p>
            </div>
        </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Author Management</h1>
            <p className="text-slate-500">Control who has access to the admin panel.</p>
        </div>
        <button onClick={fetchUsers} className="text-sm text-cyan-600 hover:underline flex items-center gap-1">
            <RefreshCw size={14} /> Refresh List
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 font-semibold text-slate-600">Email</th>
              <th className="p-5 font-semibold text-slate-600">Role</th>
              <th className="p-5 font-semibold text-slate-600">Status</th>
              <th className="p-5 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">No users found.</td>
                </tr>
            ) : (
                users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-5 font-medium text-slate-900">{user.email}</td>
                    <td className="p-5">
                    {user.is_superadmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-bold">
                            <Shield size={12} /> Admin
                        </span>
                    ) : (
                        <span className="text-slate-500 text-sm">Author</span>
                    )}
                    </td>
                    <td className="p-5">
                        {user.is_active ? (
                            <span className="text-emerald-600 text-sm font-medium flex items-center gap-1"><CheckCircle size={14}/> Active</span>
                        ) : (
                            <span className="text-red-500 text-sm font-medium flex items-center gap-1"><XCircle size={14}/> Banned</span>
                        )}
                    </td>
                    <td className="p-5 text-right">
                    {!user.is_superadmin && (
                        <button 
                            onClick={() => toggleStatus(user.id)}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                                user.is_active 
                                ? "bg-red-100 text-red-600 hover:bg-red-200" 
                                : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                            }`}
                        >
                            {user.is_active ? "Deactivate" : "Activate"}
                        </button>
                    )}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}