"use client";

import ProviderIcon from "@/components/provider-icon/provider-icon";
import DatabasesSection from "@/components/sections/databases-section";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import useSWR from "swr";

export default function Home() {
  return (
    <div className="w-full flex flex-col flex-grow">
      <div className="w-full flex items-center justify-between mb-4">
        <p className="text-2xl font-semibold">My Databases</p>
        <Link
          href={"/databases/new"}
          className=" bg-primary hover:bg-primary-darker px-4 py-1.5 text-sm rounded-md text-white hover:bg-black/80"
        >
          Add Database
        </Link>
      </div>
      <DatabasesSection />
    </div>
  );
}
