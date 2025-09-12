import { useState } from "react"

// Mock initial data - in real app this would come from API/database
const initialMenuData = {
  items: [
    {
      id: "1",
      title: "Trang chủ",
      href: "/",
      order: 1,
    },
    {
      id: "2",
      title: "Giới thiệu",
      order: 2,
      children: [
        {
          id: "2-1",
          title: "Về chúng tôi",
          href: "/about",
          order: 1,
          children: [
            { id: "2-1-1", title: "Lịch sử hình thành", href: "/about/history", order: 1 },
            { id: "2-1-2", title: "Tầm nhìn sứ mệnh", href: "/about/vision", order: 2 },
            { id: "2-1-3", title: "Giá trị cốt lõi", href: "/about/values", order: 3 },
          ],
        },
        {
          id: "2-2",
          title: "Đội ngũ",
          href: "/team",
          order: 2,
          children: [
            { id: "2-2-1", title: "Ban lãnh đạo", href: "/team/leadership", order: 1 },
            { id: "2-2-2", title: "Nhân viên", href: "/team/staff", order: 2 },
          ],
        },
        {
          id: "2-3",
          title: "Chứng nhận",
          href: "/certifications",
          order: 3,
        },
      ],
    },
    {
      id: "3",
      title: "Dịch vụ",
      order: 3,
      children: [
        {
          id: "3-1",
          title: "Phát triển phần mềm",
          href: "/services/software",
          order: 1,
          children: [
            { id: "3-1-1", title: "Web Application", href: "/services/software/web", order: 1 },
            { id: "3-1-2", title: "Mobile App", href: "/services/software/mobile", order: 2 },
            { id: "3-1-3", title: "Desktop App", href: "/services/software/desktop", order: 3 },
          ],
        },
        {
          id: "3-2",
          title: "Tư vấn IT",
          href: "/services/consulting",
          order: 2,
          children: [
            { id: "3-2-1", title: "Chiến lược số hóa", href: "/services/consulting/digital", order: 1 },
            { id: "3-2-2", title: "Tối ưu hệ thống", href: "/services/consulting/optimization", order: 2 },
          ],
        },
      ],
    },
    {
      id: "4",
      title: "Liên hệ",
      href: "/contact",
      order: 4,
    },
  ],
}

export function useMenuData() {
  const [menuData, setMenuData] = useState(initialMenuData)
  const [isLoading, setIsLoading] = useState(false)

  const updateMenuItem = (itemId, updates) => {
    setIsLoading(true)

    const updateItemRecursive = (items) => {
      return items.map((item) => {
        if (item.id === itemId) {
          return { ...item, ...updates }
        }
        if (item.children) {
          return { ...item, children: updateItemRecursive(item.children) }
        }
        return item
      })
    }

    setMenuData((prev) => ({
      ...prev,
      items: updateItemRecursive(prev.items),
    }))

    setTimeout(() => setIsLoading(false), 500) // Simulate API call
  }

  const addMenuItem = (parentId, newItem) => {
    setIsLoading(true)

    const id = Date.now().toString()
    const itemWithId = { ...newItem, id }

    if (!parentId) {
      // Add to root level
      setMenuData((prev) => ({
        ...prev,
        items: [...prev.items, itemWithId].sort((a, b) => a.order - b.order),
      }))
    } else {
      // Add to specific parent
      const addToParent = (items) => {
        return items.map((item) => {
          if (item.id === parentId) {
            const children = item.children || []
            return {
              ...item,
              children: [...children, itemWithId].sort((a, b) => a.order - b.order),
            }
          }
          if (item.children) {
            return { ...item, children: addToParent(item.children) }
          }
          return item
        })
      }

      setMenuData((prev) => ({
        ...prev,
        items: addToParent(prev.items),
      }))
    }

    setTimeout(() => setIsLoading(false), 500)
  }

  const deleteMenuItem = (itemId) => {
    setIsLoading(true)

    const removeItemRecursive = (items) => {
      return items
        .filter((item) => item.id !== itemId)
        .map((item) => ({
          ...item,
          children: item.children ? removeItemRecursive(item.children) : undefined,
        }))
    }

    setMenuData((prev) => ({
      ...prev,
      items: removeItemRecursive(prev.items),
    }))

    setTimeout(() => setIsLoading(false), 500)
  }

  return {
    menuData,
    isLoading,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
  }
}