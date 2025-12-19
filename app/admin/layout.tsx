import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // Changed "h-screen" to "min-h-screen" to allow scrolling on mobile
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      
      {/* Client Sidebar (Handles the Toggle Logic) */}
      <AdminSidebar />

      {/* Main Content */}
      {/* 
         - flex-1: Takes remaining space 
         - w-full: Ensures full width on mobile
         - p-4 md:p-8: Smaller padding on mobile, larger on desktop
      */}
      <main className="flex-1 w-full p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>
      
    </div>
  );
}