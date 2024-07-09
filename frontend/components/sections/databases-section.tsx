import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import ProviderIcon from "../provider-icon/provider-icon";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import useDatabaseActions from "@/hooks/useDatabaseActions";
import { toast } from "sonner";

export default function DatabasesSection() {
  const { getToken } = useAuth();

  const { deleteDatabase } = useDatabaseActions();

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
            <Menu>
              <MenuButton
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="text-lg h-8 w-8 rounded-md hover:text-primary flex justify-center items-center transition-all duration-200 ease-in-out"
              >
                <BsThreeDotsVertical />
              </MenuButton>
              <MenuItems
                transition
                anchor="bottom end"
                className="w-52 z-10 origin-top-right rounded-xl border p-1 text-sm/6 text-rich-black bg-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
              >
                <MenuItem>
                  <Link
                    href={`/databases/editor/${database.id}`}
                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-slate-100"
                  >
                    Edit
                  </Link>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.promise(deleteDatabase.trigger(database.id), {
                        loading: "Deleting Database...",
                        success: "Database Deleted",
                        error: "Failed to Delete",
                      });
                    }}
                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-slate-100"
                  >
                    Delete
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </Link>
        ))}
      </div>
    </div>
  );
}
