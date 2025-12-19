"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 👇 1. PASTE YOUR RENDER URL HERE (No slash at the end)
    // Example: "https://my-blog-api.onrender.com"
    const API_URL = "https://blog-backend-l.onrender.com"; 

    try {
      // Connect to Python Backend using the hardcoded URL
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Redirect to login on success
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.detail || "Registration failed. Try again.");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Server connection failed. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      
      {/* LEFT SIDE: Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24">
        <div className="mb-12">
            <div className="flex items-center gap-2 text-slate-900 mb-6">
                <div className="p-2 bg-cyan-600 rounded-lg text-white">
                    <UserPlus size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight">SynapseBlog</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create an account</h1>
            <p className="mt-2 text-sm text-slate-500">
                Start writing your own stories today.
            </p>
        </div>

        {error && (
            <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                className="w-full rounded-lg border border-slate-200 bg-white pl-10 p-2.5 text-sm outline-none ring-offset-2 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 transition-all" 
                placeholder="name@company.com" 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 p-2.5 text-sm outline-none ring-offset-2 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 transition-all" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full rounded-lg bg-cyan-600 py-3 text-sm font-bold text-white transition-all hover:bg-cyan-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-200"
          >
            {isLoading ? (
                <> <Loader2 size={16} className="animate-spin" /> Creating Account... </>
            ) : (
                <> Join Platform <ArrowRight size={16} /> </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <Link href="/login" className="font-semibold text-cyan-600 hover:underline">Log in</Link>
        </p>
      </div>

      {/* RIGHT SIDE: Visual */}
      <div className="hidden w-1/2 bg-slate-900 lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/90 to-purple-900/50 z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2340&auto=format&fit=crop" 
            alt="Workspace" 
            className="h-full w-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
            <h2 className="text-3xl font-bold mb-4">"Your voice matters."</h2>
            <p className="text-cyan-100 text-sm">Join the network of creators building the future.</p>
        </div>
      </div>
    </div>
  );
}