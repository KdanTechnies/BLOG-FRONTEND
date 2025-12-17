"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Shield, ShieldAlert, CheckCircle, XCircle } from "lucide-react";

interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_superadmin: boolean;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    const token = (session as any)?.accessToken;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    } else {
      setError("You are not authorized to view users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) fetchUsers();
  }, [session]);

  const toggleStatus = async (id: number) => {
    const token = (session as any)?.accessToken;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/toggle-status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers(); // Refresh list
  };

  if (loading) return <div className="p-8">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500 font-bold">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Author Management</h1>
      <p className="text-slate-500 mb-8">Control who has access to the admin panel.</p>

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
            {users.map((user) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}