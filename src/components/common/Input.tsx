import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  inputSize = "md",
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
        )}
        <input
          id={inputId}
          className={clsx(
            "w-full border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
            sizeStyles[inputSize],
            icon && "pl-10",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-transparent",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
