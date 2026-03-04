"use client";

import React from "react";
import { Card } from "@/src/components/common";
import clsx from "clsx";

interface VoteSummaryCardProps {
  label: string;
  value: number;
  icon: string;
  color: "blue" | "green" | "amber" | "red";
}

const colorStyles = {
  blue: "from-blue-50 to-blue-100 border-blue-200",
  green: "from-green-50 to-green-100 border-green-200",
  amber: "from-amber-50 to-amber-100 border-amber-200",
  red: "from-red-50 to-red-100 border-red-200",
};

const textStyles = {
  blue: "text-blue-700",
  green: "text-green-700",
  amber: "text-amber-700",
  red: "text-red-700",
};

const numberStyles = {
  blue: "text-blue-600",
  green: "text-green-600",
  amber: "text-amber-600",
  red: "text-red-600",
};

export const VoteSummaryCard: React.FC<VoteSummaryCardProps> = ({
  label,
  value,
  icon,
  color,
}) => {
  return (
    <Card
      className={clsx(
        "p-3 sm:p-5 bg-gradient-to-br border rounded-lg",
        colorStyles[color],
      )}
    >
      <div className="flex flex-col gap-1 sm:gap-2">
        {/* Label - Luôn hiển thị */}
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">{icon}</span>
          <span
            className={clsx(
              "font-medium text-xs sm:text-sm",
              textStyles[color],
            )}
          >
            {label}
          </span>
        </div>

        {/* Value */}
        <span
          className={clsx(
            "text-2xl sm:text-4xl font-extrabold",
            numberStyles[color],
          )}
        >
          {value.toLocaleString("vi-VN")}
        </span>
      </div>
    </Card>
  );
};
