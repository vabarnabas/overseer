import Link from "next/link";
import React from "react";
import ProviderIcon from "../provider-icon/provider-icon";
import { auth } from "@clerk/nextjs/server";
import DeleteDatabaseButton from "../buttons/delete-database-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Database } from "@/schemas/database.schema";

export default async function DatabasesSection() {
  const { getToken } = auth();

  const databaseResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/databases/me`,
    {
      headers: { Authorization: `Bearer ${await getToken()}` },
      cache: "no-store",
      next: { tags: ["/database"] },
    }
  );

  if (!databaseResponse.ok) {
    throw new Error("Failed to fetch databases");
  }

  const databases: Database[] = await databaseResponse.json();

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-y-1">
        {databases.map((database: any) => (
          <Link
            href={`/databases/${database.id}`}
            key={database.id}
            className="flex items-center justify-between border px-3 py-2 gap-x-5 rounded-lg w-full hover:bg-slate-100"
          >
            <div className="flex items-center justify-center gap-x-5">
              <div className="text-3xl text-primary">
                <ProviderIcon
                  provider={database.provider}
                  type={database.type}
                />
              </div>
              <div className="text-start">
                <p className="font-medium text-lg">{database.name}</p>
                <p className="text-sm opacity-60 -mt-1">{`${database.type} / ${database.provider}`}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DeleteDatabaseButton id={database.id} />
              </DropdownMenuContent>
            </DropdownMenu>
          </Link>
        ))}
      </div>
    </div>
  );
}
