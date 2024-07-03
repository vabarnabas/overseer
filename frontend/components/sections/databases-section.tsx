import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import ProviderIcon from "../provider-icon/provider-icon";

export default function DatabasesSection() {
  const { getToken } = useAuth();

  const { data, isValidating, error } = useSWR(
    "/databases/me",
    async (url) => {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnMount: true,
      refreshInterval: 0,
    }
  );

  console.log("dat", data);

  if (isValidating) {
    return (
      <div className="flex flex-grow justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error || !data || !data.length) {
    return (
      <div className="flex flex-grow justify-center items-center">
        {`We couldn't fetch your databases. Please try again later.`}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-y-1">
        {data.map((database: any) => (
          <Link
            href={`/databases/${database.id}`}
            key={database.id}
            className="flex items-center border px-3 py-2 gap-x-5 rounded-lg w-full hover:bg-slate-100"
          >
            <div className="text-3xl text-primary">
              <ProviderIcon provider={database.provider} type={database.type} />
            </div>
            <div className="text-start">
              <p className="font-medium text-lg">{database.name}</p>
              <p className="text-sm opacity-60 -mt-1">{`${database.type} / ${database.provider}`}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
