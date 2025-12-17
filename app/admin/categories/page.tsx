"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { Plus, Tag } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const { register, handleSubmit, reset } = useForm();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
    if (res.ok) {
        const data = await res.json();
        setCategories(data);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const onSubmit = async (data: any) => {
    const token = (session as any)?.accessToken;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ name: data.name }),
    });
    reset();
    fetchCategories(); // Refresh list
  };

  return (
    <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Categories</h1>
        <p className="text-slate-500 mb-8">Organize your posts with tags and categories.</p>

        <div className="grid md:grid-cols-3 gap-8">
            
            {/* Left: Create Form */}
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-4">
                    <h3 className="font-bold text-slate-800 mb-4">Add New</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
                            <input {...register("name")} className="w-full border border-slate-200 p-2 rounded mt-1 outline-none focus:border-blue-500" placeholder="e.g. Technology" required />
                        </div>
                        <button className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 transition flex justify-center items-center gap-2">
                            <Plus size={16} /> Add Category
                        </button>
                    </form>
                </div>
            </div>

            {/* Right: List */}
            <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Category Name</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-slate-50">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded">
                                            <Tag size={16} />
                                        </div>
                                        <span className="font-medium text-slate-700">{cat.name}</span>
                                    </td>
                                    <td className="p-4 text-right text-slate-400 font-mono text-sm">#{cat.id}</td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr><td colSpan={2} className="p-8 text-center text-slate-400">No categories found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
}