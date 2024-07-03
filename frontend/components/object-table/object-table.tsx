import { memo, useEffect } from "react";

interface Props {
  rows: Record<string, string>[];
  fields?: Record<"name", string>[];
}

export default function ObjectTable({ rows, fields }: Props) {
  console.log(rows);

  const keys = fields?.map((field) => field.name) || Object.keys(rows);

  if (!rows || (Array.isArray(rows) && rows.length === 0)) {
    return null;
  }

  console.log("keys", keys);

  return (
    <table className="text-sm w-full">
      <thead className="border-b sticky top-0">
        <tr className="">
          <th className="py-2 border-x px-8 bg-slate-50 h-max">#</th>
          {keys.map((key, index) => (
            <th
              className="py-2 border-x px-8 bg-slate-50 w-auto whitespace-nowrap h-max"
              key={index}
            >
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(rows) ? (
          rows.map((item, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border py-1 px-3 text-center">{rowIndex}</td>
              {keys.map((key, colIndex) => (
                <td
                  className="border py-0.5 px-3 text-center w-auto whitespace-nowrap"
                  key={colIndex}
                >
                  {item[key]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <>
            <td className="border py-1 px-3 text-center">{0}</td>
            {keys.map((key, colIndex) => (
              <td
                className="border py-0.5 px-3 text-center w-auto whitespace-nowrap"
                key={colIndex}
              >
                {rows[key]}
              </td>
            ))}
          </>
        )}
      </tbody>
    </table>
  );
}
