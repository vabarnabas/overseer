import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <div>
      <Link
        href="/databases"
        className={buttonVariants({ variant: "default" })}
      >
        Databases
      </Link>
    </div>
  );
}
