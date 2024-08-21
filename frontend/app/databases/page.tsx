import DatabasesSection from "@/components/sections/databases-section";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full flex flex-col flex-grow p-4">
      <div className="w-full flex items-center justify-between mb-4">
        <p className="text-2xl font-semibold">My Databases</p>
        <Link
          href={"/databases/editor"}
          className={buttonVariants({ variant: "default" })}
        >
          Add Database
        </Link>
      </div>
      <DatabasesSection />
    </div>
  );
}
