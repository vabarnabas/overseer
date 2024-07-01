import React from "react";
import { FaDatabase } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-48 fixed bottom-0 top-[5.5rem] left-0 flex flex-col items-center px-2">
      <button className="py-2 px-4 w-full flex items-center gap-x-3 text-lg hover:bg-slate-100 rounded-lg">
        <FaDatabase />
        Databases
      </button>
    </div>
  );
}
