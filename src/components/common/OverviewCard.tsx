"use client";

import React from "react";
import clsx from "clsx";

interface OverviewCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  color?: "blue" | "green" | "amber" | "red";
}

const colorStyles = {
  blue: "text-blue-600 bg-blue-50",
  green: "text-green-600 bg-green-50",
  amber: "text-amber-600 bg-amber-50",
  red: "text-red-600 bg-red-50",
};

export const OverviewCard: React.FC<OverviewCardProps> = ({
  icon,
  label,
  value,
  change,
  trend,
  color = "blue",
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div
        className={clsx(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
          colorStyles[color],
        )}
      >
        {icon}
      </div>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {change && (
        <p
          className={clsx(
            "text-sm mt-2",
            trend === "up" ? "text-green-600" : "text-red-600",
          )}
        >
          {trend === "up" ? "↑" : "↓"} {change}
        </p>
      )}
    </div>
  );
};
