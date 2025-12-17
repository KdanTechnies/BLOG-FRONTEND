"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, Command } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
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

    const result = await signIn("credentials", {
      username: email,
      password: password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/admin");
    } else {
      setError("Invalid credentials. Please check your email and password.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      
      {/* LEFT SIDE: Form Section */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24">
        
        {/* Header / Logo Area */}
        <div className="mb-12">
            <div className="flex items-center gap-2 text-slate-900 mb-6">
                <div className="p-2 bg-slate-900 rounded-lg text-white">
                    <Command size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight">SynapseBlog</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">
                Please enter your details to access the workspace.
            </p>
        </div>

        {/* Error Message */}
        {error && (
            <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                className="w-full rounded-lg border border-slate-200 bg-white pl-10 p-2.5 text-sm outline-none ring-offset-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" 
                placeholder="name@company.com" 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 p-2.5 text-sm outline-none ring-offset-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" 
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

          {/* Submit Button */}
          <button 
            disabled={isLoading}
            className="w-full rounded-lg bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
                <>
                    <Loader2 size={16} className="animate-spin" /> Signing in...
                </>
            ) : (
                "Sign In"
            )}
          </button>

          {/* Social Login Placeholder (Visual Only) */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or continue with</span></div>
          </div>
          
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
            By clicking continue, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
        </p>
      </div>

      {/* RIGHT SIDE: Visual / Image */}
      <div className="hidden w-1/2 bg-slate-900 lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent z-10"></div>
        {/* Abstract/Architecture Image */}
        <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop" 
            alt="Office background" 
            className="h-full w-full object-cover opacity-60 grayscale mix-blend-overlay"
        />
        
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
            <h2 className="text-3xl font-bold mb-4">"The best way to predict the future is to create it."</h2>
            <p className="text-slate-400 text-sm">Join thousands of developers building the future of content.</p>
        </div>
      </div>

    </div>
  );
}