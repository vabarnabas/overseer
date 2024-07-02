import React from "react";
import { FaDatabase } from "react-icons/fa6";

export default function Sidebar() {
  return (
    <div className="w-56 fixed bottom-0 top-16 pt-5 left-0 flex flex-col items-center px-2 border-r">
      <button className="py-2 px-4 w-full flex items-center gap-x-3 hover:bg-slate-100 rounded-md">
        <FaDatabase />
        Databases
      </button>
    </div>
  );
}
