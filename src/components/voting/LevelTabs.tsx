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
    <div className="flex p-1.5 bg-gray-200/60 border border-gray-200 rounded-xl w-full">
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={clsx(
            "flex-1 py-2.5 px-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm",
            activeLevel === level
              ? "bg-white text-blue-700 shadow-sm border border-gray-200/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50",
          )}
        >
          <span className="text-base">{LEVEL_INFO[level].icon}</span>
          {LEVEL_INFO[level].label}
        </button>
      ))}
    </div>
  );
};
