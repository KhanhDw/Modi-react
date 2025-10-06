import React from "react";
import "@/styles/bannerText.css";

function BannerText({ data, activeLang }) {
  if (!data || !data.text) return null;

  // Đảm bảo text là string
  const displayText = data.text?.[activeLang] || data.text || "";

  return (
    <div className="w-full overflow-hidden bg-transparent py-4">
      <div className="marquee-content whitespace-nowrap">
        {/* Lặp lại text để tạo hiệu ứng liên tục */}
        <span className="xs:text-2xl md:text-5xl 3xl:text-6xl font-bold text-gray-400 dark:text-gray-400">
          {displayText} • {displayText} • {displayText} • {displayText} •
        </span>
      </div>
    </div>
  );
}

export default BannerText;
