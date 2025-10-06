import React from 'react';

function BannerText({ data, activeLang }) {
  if (!data || !data.text) return null;

  return (
    <div className="w-full marquee">
      <div className="xs:text-2xl md:text-5xl 3xl:text-6xl font-bold text-gray-400 dark:text-gray-400 marquee-content">
        {data.text?.[activeLang]}
      </div>
    </div>
  );
}

export default BannerText;
