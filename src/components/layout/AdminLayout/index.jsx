import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "./partials/AdminHeader";
import { cn } from "@/lib/utils";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Ban đầu là mở rộng
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  useEffect(() => {
    const savedHeaderSticky = localStorage.getItem("headerSticky");
    if (savedHeaderSticky) {
      setIsHeaderSticky(savedHeaderSticky === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("headerSticky", isHeaderSticky.toString());
  }, [isHeaderSticky]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Container */}
      <div
        className={cn(
          "flex-1 overflow-x-hidden flex flex-col transition-all duration-300 ease-in-out bg-amber-400 lg:py-2 pt-2",
          sidebarCollapsed ? "lg:pl-20 lg:py-2 lg:pr-2" : "lg:pl-68 lg:pr-2" // Dùng padding-left thay vì margin-left
        )}
      >
        {/* Header */}
          <AdminHeader
            isSidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isHeaderSticky={isHeaderSticky}
            setIsHeaderSticky={setIsHeaderSticky}
            sidebarCollapsed={sidebarCollapsed} // Truyền nếu cần
          />

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden bg-white rounded-lg shadow-sm p-4 mt-2",
            isHeaderSticky && "mt-22"
          )}
        >
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;