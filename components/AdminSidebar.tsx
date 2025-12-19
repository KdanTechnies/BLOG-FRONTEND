"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Tags, 
  LogOut, 
  Menu, 
  X, 
  Command 
} from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Define your menu links here
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: FileText },
    { name: "Authors", href: "/admin/users", icon: Users },
    { name: "Categories", href: "/admin/categories", icon: Tags },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* --- MOBILE TOP BAR (Visible only on phone) --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-blue-400">Synapse Blog</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-slate-800 rounded">
          <Menu size={24} />
        </button>
      </div>

      {/* --- BACKDROP (Dark background overlay on mobile) --- */}
      {isOpen && (
        <div 
          onClick={closeMenu}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* --- SIDEBAR (Slides in on mobile, Fixed on Desktop) --- */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:flex
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-start">
            <div>
                <div className="text-2xl font-bold tracking-tight text-blue-400">Synapse Blog</div>
                <div className="text-xs text-slate-500 uppercase mt-1">Board Workspace</div>
            </div>
            {/* Close Button (Mobile Only) */}
            <button onClick={closeMenu} className="md:hidden text-slate-400 hover:text-white">
              <X size={24} />
            </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                onClick={closeMenu} // Auto-close on mobile click
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-slate-400"} /> 
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800">
            <Link 
                href="/api/auth/signout" 
                className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-all"
            >
                <LogOut size={20} /> Logout
            </Link>
        </div>
      </aside>
    </>
  );
}