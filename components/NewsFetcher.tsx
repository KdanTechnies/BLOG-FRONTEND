"use client";

import { useState } from "react";
import { Globe, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewsFetcher() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 👇 PASTE YOUR ACTUAL RENDER URL HERE
  const API_URL = "https://blog-backend-l.onrender.com"; 

  const handleFetch = async (category: string) => {
    if (!confirm(`Are you sure you want to scrape and post the latest news about "${category}"?`)) return;
    
    setLoading(true);
    try {
      const token = (session as any)?.accessToken;
      
      const res = await fetch(`${API_URL}/fetch-news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ category }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message === "News already exists!") {
             alert(`⚠️ Duplicate: "${data.title}" is already posted.`);
        } else {
             alert(`✅ Success! Posted: "${data.title}"`);
             window.location.reload(); // Reload page to show new post
        }
      } else {
        const err = await res.text();
        alert("Failed: " + err);
      }
    } catch (error) {
      console.error(error);
      alert("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleFetch("Nigeria Politics")}
        disabled={loading}
        className="flex items-center gap-2 bg-green-700 text-white px-3 py-2.5 rounded-lg hover:bg-green-800 transition-all text-xs font-bold shadow-md"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
        Fetch Nigeria
      </button>

      <button
        onClick={() => handleFetch("CNN News")}
        disabled={loading}
        className="flex items-center gap-2 bg-red-600 text-white px-3 py-2.5 rounded-lg hover:bg-red-700 transition-all text-xs font-bold shadow-md"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        Fetch CNN
      </button>
    </div>
  );
}