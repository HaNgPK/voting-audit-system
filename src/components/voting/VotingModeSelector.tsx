"use client";

import React from "react";
import { Button } from "@/src/components/common";
import clsx from "clsx";

interface VotingModeSelectorProps {
  mode: "FIXED_QUOTA" | "UNLIMITED" | null;
  quota?: number;
  onModeSelect: (mode: "FIXED_QUOTA" | "UNLIMITED") => void;
  onQuotaChange?: (quota: number) => void;
  onStartVoting: () => void;
  isLoading?: boolean;
}

export const VotingModeSelector: React.FC<VotingModeSelectorProps> = ({
  mode,
  quota,
  onModeSelect,
  onQuotaChange,
  onStartVoting,
  isLoading = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fixed Quota Mode */}
        <button
          onClick={() => onModeSelect("FIXED_QUOTA")}
          className={clsx(
            "p-6 rounded-lg border-2 transition-all text-left",
            mode === "FIXED_QUOTA"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50",
          )}
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">📊</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Được giao số lượng cụ thể
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Được giao một số lượng phiếu xác định. Chỉ hoàn thành được khi
                kiểm đủ số lượng.
              </p>

              {mode === "FIXED_QUOTA" && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng phiếu được giao:
                  </label>
                  <input
                    type="number"
                    value={quota || ""}
                    onChange={(e) => {
                      e.stopPropagation();
                      onQuotaChange?.(parseInt(e.target.value) || 0);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Nhập số lượng phiếu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    min="1"
                  />
                </div>
              )}
            </div>

            {mode === "FIXED_QUOTA" && (
              <div className="text-blue-500 text-2xl flex-shrink-0">✓</div>
            )}
          </div>
        </button>

        {/* Unlimited Mode */}
        <button
          onClick={() => onModeSelect("UNLIMITED")}
          className={clsx(
            "p-6 rounded-lg border-2 transition-all text-left",
            mode === "UNLIMITED"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-green-300 bg-white hover:bg-gray-50",
          )}
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">♾️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Không được giao số lượng
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Tự do đếm phiếu. Có thể kết thúc phiên bất kỳ lúc nào.
              </p>
              {mode === "UNLIMITED" && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-xs text-green-700 font-medium">
                    ✓ Sẵn sàng bắt đầu kiểm phiếu
                  </p>
                </div>
              )}
            </div>

            {mode === "UNLIMITED" && (
              <div className="text-green-500 text-2xl flex-shrink-0">✓</div>
            )}
          </div>
        </button>
      </div>

      {/* Info Box */}
      {mode && (
        <div
          className={clsx(
            "p-4 rounded-lg border-l-4",
            mode === "FIXED_QUOTA"
              ? "bg-blue-50 border-blue-500"
              : "bg-green-50 border-green-500",
          )}
        >
          <p className="text-sm font-medium text-gray-900">
            {mode === "FIXED_QUOTA"
              ? `📌 Bạn sẽ phải kiểm đủ ${quota || "?"} phiếu trước khi hoàn thành`
              : "📌 Bạn có thể tự do kiểm phiếu và kết thúc phiên bất kỳ lúc nào"}
          </p>
        </div>
      )}

      {/* Start Button */}
      <Button
        onClick={onStartVoting}
        variant="success"
        size="lg"
        fullWidth
        disabled={!mode || (mode === "FIXED_QUOTA" && !quota) || isLoading}
        isLoading={isLoading}
      >
        🚀 Bắt đầu kiểm phiếu
      </Button>
    </div>
  );
};
