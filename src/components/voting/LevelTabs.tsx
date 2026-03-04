"use client";

import React from "react";
import clsx from "clsx";

interface LevelTabsProps {
  activeLevel: "QUOCHOI" | "THANHPHO" | "XA";
  onChange: (level: "QUOCHOI" | "THANHPHO" | "XA") => void;
}

const LEVEL_INFO = {
  QUOCHOI: { icon: "🏛️", label: "Quốc hội" },
  THANHPHO: { icon: "🏢", label: "Thành phố" },
  XA: { icon: "🏘️", label: "Xã" },
};

export const LevelTabs: React.FC<LevelTabsProps> = ({
  activeLevel,
  onChange,
}) => {
  const levels: Array<"QUOCHOI" | "THANHPHO" | "XA"> = [
    "QUOCHOI",
    "THANHPHO",
    "XA",
  ];

  return (
    <div className="flex gap-1 sm:gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto">
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={clsx(
            "flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap text-xs sm:text-sm",
            activeLevel === level
              ? "bg-white text-gray-900 shadow-md"
              : "text-gray-600 hover:text-gray-900",
          )}
        >
          <span>{LEVEL_INFO[level].icon}</span>
          <span className="hidden sm:inline">{LEVEL_INFO[level].label}</span>
        </button>
      ))}
    </div>
  );
};
