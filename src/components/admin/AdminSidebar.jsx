import { useLocation, Link } from "react-router-dom"
import { LayoutDashboard, Handshake, Newspaper, Users, Mail, Puzzle, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const menuItems = [
  { name: "Tổng quan", path: "/managers/dashboard", icon: LayoutDashboard },
  { name: "Dịch vụ", path: "/managers/services", icon: Handshake },
  { name: "Tin tức", path: "/managers/news", icon: Newspaper },
  { name: "Tuyển dụng", path: "/managers/recruitment", icon: Users },
  { name: "Liên hệ", path: "/managers/contact", icon: Mail },
  { name: "Component", path: "/managers/components", icon: Puzzle },
]

// Reusable Sidebar Content Component
const SidebarContent = ({ isCollapsed, toggleCollapse, onClose, isMobile = false }) => {
  const pathname = useLocation()
  const isActive = (path) => pathname === path

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <h1
          className={cn(
            "font-bold text-gray-900 dark:text-gray-50 transition-all duration-300 ease-in-out",
            isCollapsed && !isMobile ? "text-2xl" : "text-xl",
          )}
        >
          {isCollapsed && !isMobile ? "M" : "Modi"}
        </h1>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 transition-transform duration-200 hover:scale-110"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Menu */}
      <nav
        className={cn(
          "flex-1 py-4 space-y-2 overflow-y-auto transition-all duration-300 ease-in-out",
          isCollapsed && !isMobile ? "px-2" : "px-4",
        )}
      >
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={cn(
              "flex items-center py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group",
              isCollapsed && !isMobile ? "justify-center px-2" : "px-3",
              isActive(item.path)
                ? "bg-primary text-primary-foreground shadow-sm scale-[0.98]"
                : "text-gray-700 hover:bg-gray-100 hover:scale-[0.99] dark:text-gray-300 dark:hover:bg-gray-700",
            )}
            title={isCollapsed && !isMobile ? item.name : undefined}
            aria-label={item.name}
          >
            <item.icon
              className={cn(
                "h-5 w-5 transition-all duration-200 ease-in-out group-hover:scale-110",
                isCollapsed && !isMobile ? "" : "mr-3",
              )}
            />
            <span
              className={cn(
                "transition-all duration-300 ease-in-out",
                isCollapsed && !isMobile ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
                !isMobile && "whitespace-nowrap",
              )}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

const AdminSidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-2 lg:top-2 lg:bottom-2",
          "lg:rounded-2xl lg:border lg:border-gray-200 dark:lg:border-gray-700",
          "overflow-hidden bg-white dark:bg-gray-800 shadow-lg z-50",
          "transition-all duration-300 ease-in-out transform",
          isCollapsed ? "lg:w-16" : "lg:w-64",
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0 transition-transform duration-300 ease-in-out">
          <SheetHeader className="h-16 flex items-center justify-between flex-row px-4 border-b border-gray-200 dark:border-gray-800">
            <SheetTitle className="text-xl font-bold text-gray-900 dark:text-gray-50">Modi</SheetTitle>
            <SheetDescription className="sr-only">
              Menu điều hướng admin để quản lý dashboard, dịch vụ, tin tức, tuyển dụng, liên hệ và components.
            </SheetDescription>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-transform duration-200 hover:scale-110"
              onClick={onClose}
              aria-label="Đóng menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <SidebarContent isCollapsed={false} toggleCollapse={toggleCollapse} onClose={onClose} isMobile />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default AdminSidebar
