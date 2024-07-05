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
      <div className="w-72 flex flex-grow flex-shrink-0 justify-center items-center border-r">
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-72 flex flex-grow flex-shrink-0 text-center justify-center items-center border-r">
        {`We couldn't fetch your databases. Please try again later.`}
      </div>
    );
  }

  return (
    <div className="w-72 flex-shrink-0 pt-5 pb-4 flex flex-col items-start px-2 border-r overflow-y-auto scrollbar-hide">
      <AnimatePresence>
        <div className="flex flex-col gap-y-1 w-full">
          {data.tables.map((table: any) => (
            <DatabaseTableRow small key={table.tableName} table={table} />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
