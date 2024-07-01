"use client";

import ProviderIcon from "@/components/provider-icon/provider-icon";
import { useAuth } from "@clerk/nextjs";
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
    <div className="">
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
  );
}
