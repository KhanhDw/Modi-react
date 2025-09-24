import { useTheme } from "@/contexts/ThemeContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function HoverButtonsServiceCard({ onClickUp, onClickDown, valuePosition }) {
    const [hoverUp, setHoverUp] = useState(false);
    const [hoverDown, setHoverDown] = useState(false);
    const { isDark } = useTheme();

    return (
        <div className="flex flex-row sm:flex-col md:flex-col lg:flex-col gap-2 h-full items-center justify-center">
            {/* Up Button */}
            <div
                className={`${valuePosition ? "opacity-100" : "opacity-50"} relative p-0.5 inline-flex items-center justify-center font-bold xs:rounded-full sm:rounded-sm md:rounded-sm overflow-hidden cursor-pointer`}
                onMouseEnter={() => setHoverUp(true)}
                onMouseLeave={() => setHoverUp(false)}
                onClick={onClickUp} // Gọi hàm từ props
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
                    className="relative px-1 py-5 xs:rounded-full sm:rounded-sm md:rounded-sm sm:py-4 xs:py-3 transition-all ease-out rounded-sm duration-500"
                    style={{
                        backgroundColor: hoverUp ? "transparent" : isDark ? "#111827" : "#ffffff",
                    }}
                >
                    <ChevronUp
                        className={`relative w-6 h-6 lg:w-6 lg:h-6 xl:w-6 xl:h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 xs:w-4 xs:h-4 transition-all duration-300 ${isDark ? "text-white" : "text-gray-800"
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

            {/* Down Button */}
            <div
                className={`${!valuePosition ? "opacity-100" : "opacity-50"} relative p-0.5 inline-flex items-center justify-center font-bold xs:rounded-full sm:rounded-sm md:rounded-sm overflow-hidden rounded-sm cursor-pointer`}
                onMouseEnter={() => setHoverDown(true)}
                onMouseLeave={() => setHoverDown(false)}
                onClick={onClickDown} // Gọi hàm từ props
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
                    className="relative px-1 py-5 xs:rounded-full md:rounded-sm sm:rounded-sm sm:py-4 xs:py-3 transition-all ease-out rounded-sm duration-500"
                    style={{
                        backgroundColor: hoverDown ? "transparent" : isDark ? "#111827" : "#ffffff",
                    }}
                >
                    <ChevronDown
                        className={`relative w-6 h-6 xl:w-6 xl:h-6 lg:w-6 lg:h-6 sm:w-5 sm:h-5 xs:w-4 xs:h-4 md:w-6 md:h-6 transition-all duration-300 ${isDark ? "text-white" : "text-gray-800"
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
