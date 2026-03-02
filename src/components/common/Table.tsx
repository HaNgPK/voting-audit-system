import React from "react";
import clsx from "clsx";

interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  actions?: (rowIndex: number) => React.ReactNode;
  responsive?: boolean;
}

export const Table: React.FC<TableProps> = ({
  headers,
  rows,
  actions,
  responsive = true,
}) => {
  return (
    <div
      className={clsx(
        "rounded-lg border border-gray-200 overflow-hidden bg-white",
        responsive && "overflow-x-auto",
      )}
    >
      <table
        className={clsx(
          "w-full border-collapse bg-white",
          responsive && "min-w-full sm:min-w-max",
        )}
      >
        <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-300">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
            {actions && (
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                Hành động
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length + (actions ? 1 : 0)}
                className="px-3 sm:px-4 py-4 text-center text-gray-500 text-sm"
              >
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-gray-200 hover:bg-blue-50 transition"
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800"
                  >
                    {cell}
                  </td>
                ))}
                {actions && (
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                    <div className="flex gap-1 sm:gap-2 flex-wrap">
                      {actions(rowIdx)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
