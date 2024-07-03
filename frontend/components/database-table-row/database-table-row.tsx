import React, { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { motion } from "framer-motion";
import clsx from "clsx";

interface Props {
  small?: boolean;
  table: {
    tableName: string;
    columns: Record<"name" | "type", string>[];
  };
}

export default function DatabaseTableRow({ table, small }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
      className={clsx(
        "flex flex-col border px-3 py-2 rounded-lg w-full text-start"
      )}
    >
      <div className="flex items-center justify-between w-full">
        <p className={clsx("font-semibold", small ? "" : "text-lg")}>
          {table.tableName}
        </p>
        {isOpen ? (
          <BiChevronDown className="text-2xl" />
        ) : (
          <BiChevronUp className="text-2xl" />
        )}
      </div>
      <motion.div
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
        layout
        className={clsx(
          "w-full flex flex-col gap-y-1",
          isOpen ? "h-auto mt-3" : "h-0"
        )}
      >
        {isOpen
          ? table.columns.map((column) => (
              <div
                key={`${table.tableName}_${column}`}
                className={clsx(
                  "w-full flex items-center justify-between",
                  small && "text-sm"
                )}
              >
                <p className="">{column.name}</p>
                <p className="text-end">{column.type}</p>
              </div>
            ))
          : null}
      </motion.div>
    </button>
  );
}
