"use client";
import DatabaseTableRow from "@/components/database-table-row/database-table-row";
import ProviderIcon from "@/components/provider-icon/provider-icon";
import { useAuth } from "@clerk/nextjs";
import { AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import React from "react";
import { BiChevronDown } from "react-icons/bi";
import useSWRImmutable from "swr/immutable";

export default function SpecificDatabase() {
  const { id } = useParams();
  const { getToken } = useAuth();

  const { data, isValidating, error } = useSWRImmutable(
    `/databases/${id}`,
    async (url) => {
      const token = await getToken();

      const databaseResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const database = await databaseResponse.json();

      const tablesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}/tables`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const tables = await tablesResponse.json();

      return { database, tables };
    }
  );

  if (isValidating) {
    return (
      <div className="flex flex-grow justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-grow justify-center items-center">
        {`We couldn't fetch your databases. Please try again later.`}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center w-full">
        <div className="text-4xl text-primary">
          <ProviderIcon provider={data.database.provider} />
        </div>
        <div className="ml-3 text-start">
          <p className="font-semibold text-2xl">{data.database.name}</p>
          <p className="text-sm opacity-60 -mt-1">{data.database.type}</p>
        </div>
      </div>
      <p className="text-2xl font-semibold mt-6 mb-4">Schema</p>
      <AnimatePresence>
        <div className="flex flex-col gap-y-1">
          {data.tables.map((table: any) => (
            <DatabaseTableRow key={table.tableName} table={table} />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
