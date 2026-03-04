"use client";

import React from "react";
import { Check } from "lucide-react";
import clsx from "clsx";

interface CandidateListItemProps {
  index: number;
  name: string;
  votes: number;
  onChange: (votes: number) => void;
  isSelected?: boolean;
  onToggle?: (selected: boolean) => void;
  disabled?: boolean;
}

export const CandidateListItem: React.FC<CandidateListItemProps> = ({
  index,
  name,
  votes,
  onChange,
  isSelected = false,
  onToggle,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onToggle?.(!isSelected);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onChange(parseInt(e.target.value) || 0);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        "w-full text-left flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md",
        isSelected
          ? "border-blue-500 bg-blue-50 hover:bg-blue-100"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {/* Checkbox */}
      <div
        className={clsx(
          "flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
          isSelected
            ? "bg-blue-500 border-blue-500"
            : "border-gray-300 bg-white",
        )}
      >
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </div>

      {/* Candidate Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-base">
          {index}. {name}
        </p>
      </div>

      {/* Vote Input */}
      <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <input
          type="number"
          min="0"
          value={votes}
          onChange={handleInputChange}
          disabled={disabled}
          className="w-20 h-10 px-3 py-2 border border-gray-300 rounded-lg text-center font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="0"
        />
      </div>

      {/* Checkmark indicator */}
      {isSelected && (
        <div className="flex-shrink-0 text-blue-500">
          <Check className="w-5 h-5" />
        </div>
      )}
    </button>
  );
};
