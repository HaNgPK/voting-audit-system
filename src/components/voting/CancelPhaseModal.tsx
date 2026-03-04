"use client";

import React from "react";
import { Modal, Button } from "@/src/components/common";
import { AlertTriangle, XCircle, CheckCircle, ArrowLeft } from "lucide-react";

interface CancelPhaseModalProps {
  isOpen: boolean;
  mode: "FIXED_QUOTA" | "UNLIMITED";
  ballotCount: number;
  quota?: number;
  onClose: () => void; // Tiếp tục kiểm
  onForceCancel: () => void; // Hủy & bỏ dữ liệu
  onComplete?: () => void; // Kết thúc & lưu (chỉ UNLIMITED)
}

export const CancelPhaseModal: React.FC<CancelPhaseModalProps> = ({
  isOpen,
  mode,
  ballotCount,
  quota,
  onClose,
  onForceCancel,
  onComplete,
}) => {
  const isFixedQuota = mode === "FIXED_QUOTA";
  const hasData = ballotCount > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center px-2 pb-2">
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isFixedQuota ? "bg-red-100" : "bg-amber-100"
          }`}
        >
          <AlertTriangle
            className={`w-8 h-8 ${
              isFixedQuota ? "text-red-500" : "text-amber-500"
            }`}
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {isFixedQuota ? "Hủy phiên kiểm phiếu?" : "Bạn muốn làm gì?"}
        </h3>

        {/* Description */}
        <div className="text-sm text-gray-600 mb-6 space-y-1">
          {isFixedQuota ? (
            <>
              <p>
                Bạn đã kiểm được{" "}
                <span className="font-bold text-blue-600">{ballotCount}</span>
                {quota ? (
                  <>
                    {" "}
                    / <span className="font-bold">{quota}</span>
                  </>
                ) : null}{" "}
                phiếu.
              </p>
              <p className="text-red-600 font-medium">
                ⚠️ Dữ liệu sẽ bị mất và không thể khôi phục.
              </p>
            </>
          ) : hasData ? (
            <>
              <p>
                Phiên này đã đếm được{" "}
                <span className="font-bold text-blue-600">{ballotCount}</span>{" "}
                phiếu.
              </p>
              <p className="text-gray-500">
                Bạn có thể lưu lại kết quả hoặc hủy toàn bộ.
              </p>
            </>
          ) : (
            <p className="text-gray-500">
              Phiên chưa có dữ liệu nào. Bạn có muốn hủy không?
            </p>
          )}
        </div>

        {/* Buttons */}
        {isFixedQuota ? (
          // FIXED_QUOTA: 2 nút
          <div className="flex flex-col gap-2">
            <Button onClick={onClose} variant="primary" fullWidth>
              <ArrowLeft className="w-4 h-4" />
              Tiếp tục kiểm
            </Button>
            <Button onClick={onForceCancel} variant="danger" fullWidth>
              <XCircle className="w-4 h-4" />
              Hủy phiên này
            </Button>
          </div>
        ) : hasData ? (
          // UNLIMITED + có dữ liệu: 3 nút
          <div className="flex flex-col gap-2">
            <Button onClick={onClose} variant="primary" fullWidth>
              <ArrowLeft className="w-4 h-4" />
              Tiếp tục kiểm
            </Button>
            <Button onClick={onComplete} variant="success" fullWidth>
              <CheckCircle className="w-4 h-4" />
              Kết thúc & lưu ({ballotCount} phiếu)
            </Button>
            <Button onClick={onForceCancel} variant="danger" fullWidth>
              <XCircle className="w-4 h-4" />
              Hủy & bỏ dữ liệu
            </Button>
          </div>
        ) : (
          // UNLIMITED + chưa có dữ liệu: 2 nút
          <div className="flex gap-2">
            <Button onClick={onClose} variant="secondary" fullWidth>
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <Button onClick={onForceCancel} variant="danger" fullWidth>
              <XCircle className="w-4 h-4" />
              Hủy phiên
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
