import Link from "next/link";
// I added BookOpen to the list below:
import { ArrowRight, ShieldCheck, LayoutDashboard, Terminal, BookOpen, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-white">
      
      {/* 1. Background Video (Abstract Data Flow) */}
      <div className="absolute top-0 left-0 h-full w-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover scale-105"
        >
          <source 
            src="https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_25fps.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 backdrop-blur-[1px]"></div>
      </div>

      {/* 2. Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-8">
        
        {/* Tech Badge */}
        <div className="mb-8 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs uppercase tracking-widest text-emerald-400 backdrop-blur-md shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Online • v1.0.4
          </div>
        </div>

        {/* Hero Text */}
        <div className="text-center max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
            SYNAPSE  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">BLOG</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Read. Think. Grow
            <br className="hidden md:block" />
            Powered by <span className="text-white font-medium">Synapse</span> architecture.
          </p>
        </div>

       {/* 3. High-End Action Buttons */}
        <div className="mt-12 flex flex-col xl:flex-row gap-5 w-full justify-center items-center">
          
          {/* 1. Public Read Button */}
          <Link 
            href="/blog" 
            className="group relative flex items-center justify-center gap-3.5 px-8 py-4 w-full sm:w-auto rounded-none border-l-2 border-emerald-500 bg-gradient-to-r from-emerald-900/40 to-black hover:from-emerald-800/60 transition-all duration-300"
          >
            <div className="flex flex-col items-start">
              <span className="text-xs text-emerald-300 uppercase tracking-wider font-bold">Public Access</span>
              <span className="text-lg font-bold text-white flex items-center gap-2">
                Read Blog <BookOpen size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* 2. Register Button (NEW) */}
          <Link 
            href="/register" 
            className="group relative flex items-center justify-center gap-3.5 px-8 py-4 w-full sm:w-auto rounded-none border-l-2 border-cyan-500 bg-gradient-to-r from-cyan-900/40 to-black hover:from-cyan-800/60 transition-all duration-300"
          >
            <div className="flex flex-col items-start">
              <span className="text-xs text-cyan-300 uppercase tracking-wider font-bold">New Authors</span>
              <span className="text-lg font-bold text-white flex items-center gap-2">
                Create Account <UserPlus size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              </span>
            </div>
          </Link>

          {/* 3. Login Button */}
          <Link 
            href="/login" 
            className="group relative flex items-center justify-center gap-3 px-8 py-4 w-full sm:w-auto rounded-none border-l-2 border-purple-500 bg-gradient-to-r from-purple-900/40 to-black hover:from-purple-800/60 transition-all duration-300"
          >
            <div className="flex flex-col items-start">
              <span className="text-xs text-purple-300 uppercase tracking-wider font-bold">Admin Login</span>
              <span className="text-lg font-bold text-white flex items-center gap-2">
                Authenticate <ShieldCheck size={16} className="text-purple-400" />
              </span>
            </div>
          </Link>
        </div>

        {/* Decorative Terminal Line */}
        <div className="absolute bottom-12 flex items-center gap-2 text-xs font-mono text-gray-600 opacity-60">
           <Terminal size={14} />
           <span>Synapse connection in progress…</span>
           <span className="animate-pulse">_</span>
        </div>

      </main>
    </div>
  );
}