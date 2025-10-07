import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
    description: child.description || {
      en: slugify(child.title?.en || ""),
      vi: "",
    },
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
            .filter(
              (ch) =>
                ch.section_id === service.id || ch.section_type === service.type
            )
            .map((ch) => normalizeChild(ch));

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
    loadAllData,
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
  const activeChildren = useMemo(
    () => (activeService ? childrenMap[activeService.id] || [] : []),
    [activeService, childrenMap]
  );

  const hasActiveSubmenu = activeChildren.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="w-fit relative"
      onMouseLeave={handleMouseLeaveContainer}
    >
      <div className="rounded-xl bg-gray-800/80 backdrop-blur-lg border border-gray-700/60 shadow-2xl overflow-hidden">
        <div className="flex">
          {/* Cột 1: Menu cấp 1 */}
          <div
            className={`
          flex-shrink-0 w-64 p-2
          ${
            memoizedServices.length > 10 ? "h-[480px] overflow-y-auto" : "h-fit"
          }
        `}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              {memoizedServices.map((service) => {
                const isActive = hoveredItem === service.id;
                const hasSubItems =
                  Array.isArray(childrenMap[service.id]) &&
                  childrenMap[service.id].length > 0;

                return (
                  <Link
                    key={service.id}
                    to={`/services/${service.type}`}
                    className={`
                      group cursor-pointer transition-all duration-200
                      px-3 py-2.5 rounded-lg relative flex items-center justify-between
                      ${
                        isActive && hasSubItems
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }
                    `}
                    onMouseEnter={() => handleMouseEnterItem(service.id)}
                  >
                    <p
                      className={`
    flex-1 text-sm transition-all duration-100
    min-w-0 break-words break-all whitespace-normal
    ${isActive && hasSubItems ? "font-semibold" : "font-medium"}
  `}
                    >
                      {service.title}
                    </p>

                    {hasSubItems && (
                      <ChevronRight
                        className={`
                          ml-2 w-4 h-4 text-gray-500 transition-transform duration-200
                          ${
                            isActive
                              ? "translate-x-1"
                              : "group-hover:translate-x-1"
                          }
                        `}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Cột 2: Menu cấp 2 */}
          <AnimatePresence>
            {hasActiveSubmenu && (
              <motion.div
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 288 }} // w-72
                exit={{ opacity: 0, x: -20, width: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="border-l border-gray-700 overflow-hidden"
                onWheel={(e) => e.stopPropagation()}
              >
                {/* Nội dung cột 2 luôn full w-72, không bị co chữ */}
                <div className="p-4 min-h-full bg-gray-900/30 w-72">
                  <div className="mb-4">
                    <h3
                      className={`
    flex-1 text-sm text-white font-medium
    ${hasActiveSubmenu ? "whitespace-normal break-words" : "truncate"}
  `}
                    >
                      {activeService?.title}
                    </h3>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                  </div>

                  <ul className="space-y-1">
                    {activeChildren.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          to={`/services/${sub.section_type}/${sub.description?.en}`}
                          className="group flex items-center px-3 py-2.5
                       text-gray-300 hover:text-white
                       transition-all duration-200
                       cursor-pointer rounded-lg text-sm font-medium
                       hover:bg-gray-700/50"
                        >
                          <span
                            className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3
                             transition-all duration-200
                             group-hover:bg-emerald-400 group-hover:scale-125"
                          ></span>
                          <span className="truncate">{sub.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});

export default ModalServices;
