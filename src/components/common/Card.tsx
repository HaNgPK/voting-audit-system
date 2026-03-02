import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  shadow = true,
}) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-lg p-4 md:p-6",
        shadow && "shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
};
