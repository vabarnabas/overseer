"use client";

import ProviderIcon from "@/components/provider-icon/provider-icon";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import useSWR from "swr";

export default function Home() {
  const { getToken } = useAuth();

  const { data, isValidating, error } = useSWR(
    "/databases/me",
    async (url) => {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnMount: true,
      refreshInterval: 0,
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
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center justify-between mb-4">
        <p className="text-2xl font-semibold">My Databases</p>
        <Link
          href={"/databases/new"}
          className=" bg-black px-4 py-1 rounded-md text-white hover:bg-black/80"
        >
          Add Database
        </Link>
      </div>
      <div className="flex flex-col gap-y-2">
        {data.map((database: any) => (
          <button
            key={database.id}
            className="flex items-center border px-3 py-2 rounded-lg w-full"
          >
            <ProviderIcon provider={database.provider} />
            <div className="ml-3 text-start">
              <p className="font-semibold text-lg">{database.name}</p>
              <p className="text-sm -mt-1.5">{database.type}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
