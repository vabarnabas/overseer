import React, { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { motion } from "framer-motion";
import clsx from "clsx";

interface Props {
  table: {
    tableName: string;
    columns: Record<"name" | "type", string>[];
  };
}

export default function DatabaseTableRow({ table }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
      className="flex flex-col border px-3 py-2 rounded-lg w-full text-start"
    >
      <div className="flex items-center justify-between w-full">
        <p className="font-semibold text-lg">{table.tableName}</p>
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
                className="w-full flex items-center justify-between"
              >
                <p className="">{column.name}</p>
                <p className="">{column.type}</p>
              </div>
            ))
          : null}
      </motion.div>
    </button>
  );
}
