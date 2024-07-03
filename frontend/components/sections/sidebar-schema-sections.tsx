import { useAuth } from "@clerk/nextjs";
import { AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import React from "react";
import useSWRImmutable from "swr/immutable";
import DatabaseTableRow from "../database-table-row/database-table-row";

export default function SidebarSchema() {
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
    <div className="w-full px-2 overflow-y-auto pb-4 scrollbar-hide">
      <p className="text-xl font-semibold mt-2 mb-2">Schema</p>
      <AnimatePresence>
        <div className="flex flex-col gap-y-1">
          {data.tables.map((table: any) => (
            <DatabaseTableRow small key={table.tableName} table={table} />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
