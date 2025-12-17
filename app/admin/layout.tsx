import Link from "next/link";
// Added 'Users' to the imports
import { LayoutDashboard, FileText, LogOut, Tags, Users } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6">
            <div className="text-2xl font-bold tracking-tight text-blue-400">Synapse Blog</div>
            <div className="text-xs text-slate-500 uppercase mt-1">Board Workspace</div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/posts" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all">
            <FileText size={20} /> Posts
          </Link>
          
          {/* --- NEW LINK: AUTHORS --- */}
          <Link href="/admin/users" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all">
            <Users size={20} /> Authors
          </Link>

          <Link href="/admin/categories" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all">
            <Tags size={20} /> Categories
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
            <Link href="/api/auth/signout" className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-all">
                <LogOut size={20} /> Logout
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}