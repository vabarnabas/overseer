import { memo, useEffect } from "react";

interface Props {
  rows: Record<string, string>[];
  fields?: Record<"name", string>[];
}

export default function ObjectTable({ rows, fields }: Props) {
  const keys = fields?.map((field) => field.name) || Object.keys(rows[0] || {});

  return (
    <table className="overflow-auto text-sm w-full">
      <thead>
        <tr className="">
          <th className="py-2 border-x px-8 bg-slate-50 sticky top-0">#</th>
          {keys.map((key, index) => (
            <th
              className="py-2 border-x px-8 bg-slate-50 sticky top-0 min-w-[120px] max-w-[200px] whitespace-nowrap"
              key={index}
            >
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((item, rowIndex) => (
          <tr key={rowIndex}>
            <td className="border py-1 px-3 text-center">{rowIndex + 1}</td>
            {keys.map((key, colIndex) => (
              <td
                className="border py-0.5 px-3 text-center whitespace-nowrap select-all"
                key={colIndex}
              >
                {item[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
