import React from "react";
import clsx from "clsx";

interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  actions?: (rowIndex: number) => React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, rows, actions }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left font-semibold text-gray-700"
              >
                {header}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Hành động
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-3 text-gray-900">
                  {cell}
                </td>
              ))}
              {actions && <td className="px-4 py-3">{actions(rowIdx)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
