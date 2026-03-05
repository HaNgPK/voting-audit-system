import React, { CSSProperties } from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  style?: CSSProperties; // ✅ Đã thêm dòng này để nhận thuộc tính style
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  shadow = true,
  style, // ✅ Thêm vào props
}) => {
  return (
    <div
      style={style} // ✅ Truyền style vào thẻ div
      className={clsx(
        "bg-white rounded-2xl border border-gray-100",
        shadow ? "shadow-sm" : "",
        className,
      )}
    >
      {children}
    </div>
  );
};
