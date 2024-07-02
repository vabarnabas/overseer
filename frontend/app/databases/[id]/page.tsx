"use client";
import ProviderIcon from "@/components/provider-icon/provider-icon";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React from "react";
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
        <ProviderIcon provider={data.database.provider} />
        <div className="ml-3 text-start">
          <p className="font-semibold text-xl">{data.database.name}</p>
          <p className="text-sm opacity-60 -mt-1">{data.database.type}</p>
        </div>
      </div>
      <p className="text-2xl font-semibold mt-6 mb-4">Tables</p>
      <div className="flex flex-col">
        {data.tables.map((table: any) => (
          <div
            key={table.tableName}
            className="flex items-center border px-3 py-2 rounded-lg w-full"
          >
            <div className="ml-3 text-start">
              <p className="font-semibold text-lg">{table.tableName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
