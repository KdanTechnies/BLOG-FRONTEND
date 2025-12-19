"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Plus, FileText } from "lucide-react";
import { getSession } from "next-auth/react";
// 1. IMPORT THE NEW COMPONENT
import NewsFetcher from "@/components/NewsFetcher";

interface Post {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  author: { email: string; };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. HARDCODE URL TO PREVENT ERRORS
  const API_URL = "https://blog-backend-l.onrender.com"; 

  // Fetch Posts
  const fetchPosts = async () => {
    const session = await getSession();
    const token = (session as any)?.accessToken; 

    try {
      const res = await fetch(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // Delete Handler
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const session = await getSession();
    const token = (session as any)?.accessToken;

    await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Refresh list
    setPosts(posts.filter((p) => p.id !== id));
  };

  if (loading) return <div className="p-8">Loading posts...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Posts</h1>
            <p className="text-slate-500">Manage your blog content</p>
        </div>
        
        {/* 3. ADDED BUTTON GROUP HERE */}
        <div className="flex flex-wrap gap-3">
            {/* The Auto Fetch Buttons */}
            <NewsFetcher />
            
            {/* The Manual Create Button */}
            <Link href="/admin/posts/new" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all text-xs font-bold">
            <Plus size={16} /> Create New
            </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 font-semibold text-slate-600">Title</th>
              <th className="p-5 font-semibold text-slate-600">Author</th>
              <th className="p-5 font-semibold text-slate-600">Status</th>
              <th className="p-5 font-semibold text-slate-600">Date</th>
              <th className="p-5 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-5">
                  <div className="font-medium text-slate-900 line-clamp-1 max-w-xs">{post.title}</div>
                  <div className="text-xs text-slate-400">/{post.slug}</div>
                </td>
                
                <td className="p-5 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700">
                        {post.author?.email || "Unknown"}
                    </span>
                </td>

                <td className="p-5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    post.published 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                    : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-5 text-sm text-slate-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="p-5 text-right flex justify-end gap-2">
                  <Link href={`/admin/posts/${post.id}`} className="p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
            <div className="p-12 text-center text-slate-400">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>No posts found. Click the buttons above to create one!</p>
            </div>
        )}
      </div>
    </div>
  );
}