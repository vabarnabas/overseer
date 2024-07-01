import React from "react";
import { FaDatabase } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-48 fixed bottom-0 top-[5.5rem] left-0 flex flex-col items-center px-4">
      <p className="py-4 w-full flex items-center gap-x-2 text-lg">
        <FaDatabase />
        Databases
      </p>
    </div>
  );
}
