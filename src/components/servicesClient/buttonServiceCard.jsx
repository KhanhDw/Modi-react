import { useTheme } from "@/contexts/ThemeContext";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";

export default function HoverButtonsServiceCard({
  onClickUp,
  onClickDown,
  valuePosition,
}) {
  const [hoverUp, setHoverUp] = useState(false);
  const [hoverDown, setHoverDown] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className="flex flex-row md:flex-col gap-3 h-full w-full items-center justify-center">
      {/* Up */}
      <div
        className={`${valuePosition ? "opacity-100" : "opacity-50"}
                    cursor-pointer relative p-1 inline-flex items-center justify-center font-bold
                    rounded-lg sm:rounded-sm overflow-hidden`}
        onMouseEnter={() => setHoverUp(true)}
        onMouseLeave={() => setHoverUp(false)}
        onClick={onClickUp}
      >
        <span
          className="w-full h-full absolute transition-all duration-500"
          style={{
            background: hoverUp
              ? "linear-gradient(135deg, #ff00c6, #ff5478, #ff8a05)"
              : "linear-gradient(135deg, #ff8a05, #ff5478, #ff00c6)",
          }}
        />
        <span
          className="relative px-4 py-3 sm:py-4 transition-all ease-out duration-500 rounded-lg sm:rounded-sm"
          style={{
            backgroundColor: hoverUp
              ? "transparent"
              : isDark
              ? "#111827"
              : "#ffffff",
          }}
        >
          <ChevronLeft
            className={`relative w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
            style={{
              transform: hoverUp ? "translateY(-3px)" : "translateY(0px)",
              filter: hoverUp
                ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                : "none",
            }}
          />
        </span>
      </div>

      {/* Down */}
      <div
        className={`${!valuePosition ? "opacity-100" : "opacity-50"}
                    cursor-pointer relative p-1 inline-flex items-center justify-center font-bold
                    rounded-lg sm:rounded-sm overflow-hidden`}
        onMouseEnter={() => setHoverDown(true)}
        onMouseLeave={() => setHoverDown(false)}
        onClick={onClickDown}
      >
        <span
          className="w-full h-full absolute transition-all duration-500"
          style={{
            background: hoverDown
              ? "linear-gradient(135deg, #ff00c6, #ff5478, #ff8a05)"
              : "linear-gradient(135deg, #ff8a05, #ff5478, #ff00c6)",
          }}
        />
        <span
          className="relative px-4 py-3 sm:py-4 transition-all ease-out duration-500 rounded-lg sm:rounded-sm"
          style={{
            backgroundColor: hoverDown
              ? "transparent"
              : isDark
              ? "#111827"
              : "#ffffff",
          }}
        >
          <ChevronRight
            className={`relative w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
            style={{
              transform: hoverDown ? "translateY(3px)" : "translateY(0px)",
              filter: hoverDown
                ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                : "none",
            }}
          />
        </span>
      </div>
    </div>
  );
}
