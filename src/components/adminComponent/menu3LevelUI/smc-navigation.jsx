import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Giới thiệu",
    href: "/about",
    subItems: [
      { title: "Về SMC", href: "/about/company" },
      { title: "Lịch sử phát triển", href: "/about/history" },
      { title: "Tầm nhìn sứ mệnh", href: "/about/vision" },
      { title: "Ban lãnh đạo", href: "/about/leadership" },
    ],
  },
  {
    title: "Dịch vụ",
    href: "/services",
    subItems: [
      { title: "Tư vấn chiến lược", href: "/services/consulting" },
      { title: "Phát triển phần mềm", href: "/services/development" },
      { title: "Hỗ trợ kỹ thuật", href: "/services/support" },
      { title: "Đào tạo", href: "/services/training" },
    ],
  },
  {
    title: "Dự án",
    href: "/projects",
    subItems: [
      { title: "Dự án hoàn thành", href: "/projects/completed" },
      { title: "Dự án đang thực hiện", href: "/projects/ongoing" },
      { title: "Nghiên cứu & Phát triển", href: "/projects/research" },
    ],
  },
  {
    title: "Tin tức",
    href: "/news",
    subItems: [
      { title: "Tin công ty", href: "/news/company" },
      { title: "Tin ngành", href: "/news/industry" },
      { title: "Sự kiện", href: "/news/events" },
    ],
  },
  {
    title: "Liên hệ",
    href: "/contact",
  },
]

export default function SMCNavigation() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMouseEnter = (title) => {
    setActiveDropdown(title)
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-xl">SMC</span>
              </div>
              <span className="ml-3 text-xl font-bold text-foreground">SMC Company</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                      "text-foreground hover:text-accent hover:bg-card",
                      activeDropdown === item.title && item.subItems && "text-accent bg-card",
                    )}
                  >
                    {item.title}
                    {item.subItems && (
                      <ChevronDown
                        className={cn(
                          "ml-1 h-4 w-4 transition-transform duration-200",
                          activeDropdown === item.title && "rotate-180",
                        )}
                      />
                    )}
                  </a>

                  {item.subItems && activeDropdown === item.title && (
                    <div className="absolute left-0 mt-1 w-56 bg-popover border border-border rounded-md shadow-lg z-50">
                      <div className="py-1">
                        {item.subItems.map((subItem) => (
                          <a
                            key={subItem.title}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150"
                          >
                            {subItem.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-accent hover:bg-card focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
            >
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
            {menuItems.map((item) => (
              <div key={item.title}>
                <a
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-card-foreground hover:text-accent hover:bg-accent/10 transition-colors duration-200"
                >
                  {item.title}
                </a>
                {item.subItems && (
                  <div className="ml-4 space-y-1">
                    {item.subItems.map((subItem) => (
                      <a
                        key={subItem.title}
                        href={subItem.href}
                        className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors duration-200"
                      >
                        {subItem.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}