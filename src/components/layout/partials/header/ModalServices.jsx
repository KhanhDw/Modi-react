import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const ModalServices = forwardRef((props, ref) => {

  const [services, setServices] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [childrenMap, setChildrenMap] = useState({});
  const hoverTimeout = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_MAIN_BE_URL;

  // normalize child -> trả về object chuẩn dùng cho UI
  const normalizeChild = (child) => ({
    id: child.id,
    title: (child.title && (child.title.vi || child.title.en)) || "",
    href: "#",
    section_id: child.section_id,
    section_type: child.section_type,
    description: child.description || { en: slugify(child.title?.en || ""), vi: "" }
  });

  const loadAllData = async () => {
    try {
      // 1) fetch danh mục cha
      const res = await fetch(`${API_BASE_URL}/api/sections?slug=header`);
      if (!res.ok) throw new Error("Không thể tải danh mục cha");
      const sectionsRes = await res.json();

      // sectionsRes có thể là { success, data: [...] } hoặc trả trực tiếp mảng tùy backend
      const sectionsArray = Array.isArray(sectionsRes)
        ? sectionsRes
        : Array.isArray(sectionsRes.data)
          ? sectionsRes.data
          : [];

      // lọc và chuẩn hóa danh sách cha
      const merged = sectionsArray
        .filter((section) => section.type !== "logo")
        .map((section) => ({
          id: section.id,
          type: section.type,
          title: section.title?.vi || section.title?.en || "No Title",
          href: "#",
        }));

      setServices(merged);

      // 2) fetch toàn bộ children song song (theo type), nhưng lưu theo service.id
      const childrenResults = await Promise.all(
        merged.map(async (service) => {
          if (!service.type) return [service.id, []];

          // gọi endpoint
          const r = await fetch(
            `${API_BASE_URL}/api/section-items/type/${encodeURIComponent(
              service.type
            )}?slug=header`
          );

          if (!r.ok) return [service.id, []];

          const json = await r.json();
          // có thể backend trả mảng trực tiếp hoặc { data: [...] }
          const itemsArray = Array.isArray(json)
            ? json
            : Array.isArray(json.data)
              ? json.data
              : [];

          // CHÚ Ý: item mẫu có field section_id = id của section cha
          // defensive: lọc theo section_id === service.id (để đảm bảo đúng cha)
          const linked = itemsArray
            .filter(ch => ch.section_id === service.id || ch.section_type === service.type)
            .map(ch => normalizeChild(ch));

          return [service.id, linked];
        })
      );

      setChildrenMap(Object.fromEntries(childrenResults));
    } catch (err) {
      console.error("Lỗi loadAllData:", err);
    }
  };


  // expose hàm fetch ra ngoài
  useImperativeHandle(ref, () => ({
    loadAllData
  }));

  // vẫn giữ useEffect cũ nếu muốn hover cũng fetch như bình thường
  useEffect(() => {
    if (!services.length) loadAllData();
  }, []);

  const memoizedServices = useMemo(() => services, [services]);

  // Hover logic (không thay đổi UI)
  const handleMouseEnterItem = (serviceId) => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setHoveredItem(serviceId);
    }, 250);
  };

  const handleMouseLeaveContainer = () => {
    clearTimeout(hoverTimeout.current);
    setHoveredItem(null);
  };

  const activeService = memoizedServices.find((s) => s.id === hoveredItem);
  const activeChildren = useMemo(() =>
    activeService ? childrenMap[activeService.id] || [] : [],
    [activeService, childrenMap]
  );

  const hasActiveSubmenu = activeChildren.length > 0;


  return (
    <div
      className="w-fit backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 relative rounded-sm"
      onMouseLeave={handleMouseLeaveContainer}
    >
      <div
        className="rounded-sm bg-gray-700/60 border border-gray-200/50 dark:border-gray-700/50 
                dark:bg-gray-800/70 dark:from-gray-800 dark:to-gray-900 
               shadow-2xl overflow-hidden transition-all duration-300"
      >
        <div className="flex bg-gray-700/60">
          {/* Cột 1: Menu cấp 1 */}
          <div
            className={`
          flex-shrink-0 w-60 transition-all duration-300 bg-gray-700/60
          ${memoizedServices.length > 9 ? "h-120 overflow-y-auto scrollbar-hide" : "h-fit"}
        `}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="space-y-1 bg-gray-700/60">
              {memoizedServices.map((service) => {
                const isActive = hoveredItem === service.id;
                const hasSubItems =
                  Array.isArray(childrenMap[service.id]) && childrenMap[service.id].length > 0;

                return (
                  <div
                    key={service.id}
                    className={`
                  group cursor-pointer transition-all duration-100 transform
                  px-4 py-3 rounded-lg relative
                  ${isActive && hasSubItems
                        ? "text-white"
                        : "hover:bg-slate-900 text-gray-300 dark:text-gray-200 hover:text-white"}
                `}
                    onMouseEnter={() => handleMouseEnterItem(service.id)}
                  >
                    {/* Background highlight */}
                    <div
                      className={`
                    absolute inset-0 rounded-lg transition-opacity duration-100
                    ${isActive && hasSubItems ? "bg-gray-900" : ""}
                  `}
                    />

                    {/* Nội dung item */}
                    <div className="flex items-center justify-between relative z-10">
                      <Link
                        to={{
                          pathname: "/services",
                          search: `?q=${service.type}`
                        }}
                        className={`
                      flex-1 text-sm transition-all duration-100
                      ${isActive && hasSubItems ? "font-semibold" : "font-medium group-hover:font-semibold"}
                    `}
                      >
                        {service.title}
                      </Link>
                      {hasSubItems && (
                        <ChevronDown
                          className={`
                        ml-2 w-4 h-4 transition-transform duration-100
                        ${isActive ? "rotate-90" : "group-hover:rotate-90"}
                      `}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cột 2: Menu cấp 2 */}
          <div
            className={`
          transition-all duration-140 ease-in-out transform
          ${hasActiveSubmenu
                ? activeChildren.length > 10
                  ? "w-72 opacity-100 h-100 overflow-y-auto scale-100"
                  : "w-72 opacity-100 h-auto scale-100"
                : "w-0 opacity-0 scale-95"}
        `}
          >
            <div
              className="
                p-4 min-h-full 
              bg-emerald-50/10 
                dark:from-gray-900/80 dark:to-emerald-900/30 
                backdrop-blur-xl border border-gray-200/40 dark:border-gray-700/50 
                shadow-xl shadow-emerald-500/10 
                h-auto  overflow-y-auto transition-opacity duration-300
              "
              onWheel={(e) => e.stopPropagation()}
            >
              {hasActiveSubmenu ? (
                <>
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-200 dark:text-gray-100 mb-2">
                      {activeService?.title}
                    </h3>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                  </div>

                  <ul className="space-y-2">
                    {activeChildren.map((sub) => (
                      <li key={sub.id} className="group">
                        <Link
                          to={{
                            pathname: "/services",
                            search: `?q=${sub.section_type}&i=${sub.id}&sub=${sub.description?.en}`
                          }}
                          className="
                        flex items-center px-3 py-2.5 
                        text-gray-200 dark:text-gray-300 
                        hover:bg-slate-800 hover:text-white 
                        transition-all duration-300 
                        cursor-pointer rounded-lg text-sm font-medium 
                        hover:font-semibold hover:translate-x-1
                      "
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default ModalServices;
