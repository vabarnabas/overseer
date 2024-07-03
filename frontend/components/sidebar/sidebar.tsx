"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { FaDatabase } from "react-icons/fa6";
import SidebarSchema from "../sections/sidebar-schema-sections";
import Link from "next/link";

export default function Sidebar() {
  const pathName = usePathname();

  return (
    <div className="w-72 fixed bottom-0 top-16 pt-5 left-0 flex flex-col items-center px-2 border-r">
      <Link
        href={"/"}
        className="py-2 px-2 w-full flex items-center gap-x-3 hover:bg-slate-100 rounded-md"
      >
        <FaDatabase />
        Databases
      </Link>
      {pathName.match(
        /^\/databases\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
      ) ? (
        <SidebarSchema />
      ) : null}
    </div>
  );
}
