import React from "react";
import { FaDatabase } from "react-icons/fa6";

export default function Sidebar() {
  return (
    <div className="w-48 fixed bottom-0 top-16 pt-5 left-0 flex flex-col items-center px-2 border-r">
      <button className="py-2 px-4 w-full flex items-center gap-x-3 text-lg hover:bg-slate-100 rounded-lg">
        <FaDatabase />
        Databases
      </button>
    </div>
  );
}
