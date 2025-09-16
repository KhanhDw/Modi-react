import { useState } from "react"
import { Link } from "react-router-dom"
import { useMenuData } from "./use-menu-data"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react"

function DropdownMenu({ items, level }) {
  const [openSubmenu, setOpenSubmenu] = useState(null)

  return (
    <div
      className={`absolute ${level === 0 ? "top-full left-0" : "top-0 left-full"} 
                    bg-card border border-border rounded-md shadow-lg min-w-[200px] z-50`}
    >
      {items.map((item) => (
        <div key={item.id} className="relative group">
          <div className="flex items-center justify-between px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors">
            {item.href ? (
              <Link to={item.href} className="flex-1 text-sm font-medium">
                {item.title}
              </Link>
            ) : (
              <span className="flex-1 text-sm font-medium">{item.title}</span>
            )}
            {item.children && item.children.length > 0 && <ChevronRight className="h-4 w-4 ml-2" />}
          </div>

          {item.children && item.children.length > 0 && (
            <div className="hidden group-hover:block">
              <DropdownMenu items={item.children} level={level + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function SMCNavigation3Level() {
  const { menuData } = useMenuData()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null)

  const renderMobileMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openMobileSubmenu === item.id

    return (
      <div key={item.id} className={`${level > 0 ? "ml-4" : ""}`}>
        <div className="flex items-center justify-between py-2">
          {item.href ? (
            <Link
              href={item.href}
              className="flex-1 text-foreground hover:text-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.title}
            </Link>
          ) : (
            <span className="flex-1 text-foreground">{item.title}</span>
          )}

          {hasChildren && (
            <Button variant="ghost" size="sm" onClick={() => setOpenMobileSubmenu(isOpen ? null : item.id)}>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="ml-4 border-l border-border pl-4">
            {item.children.map((child) => renderMobileMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary">
              SMC
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {menuData.items.map((item) => (
                <div key={item.id} className="relative group">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-foreground hover:text-accent px-3 py-2 text-sm font-medium transition-colors"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <button className="text-foreground hover:text-accent px-3 py-2 text-sm font-medium transition-colors flex items-center">
                      {item.title}
                      {item.children && item.children.length > 0 && <ChevronDown className="ml-1 h-4 w-4" />}
                    </button>
                  )}

                  {item.children && item.children.length > 0 && (
                    <div className="hidden group-hover:block">
                      <DropdownMenu items={item.children} level={0} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">{menuData.items.map((item) => renderMobileMenuItem(item))}</div>
          </div>
        )}
      </div>
    </nav>
  )
}