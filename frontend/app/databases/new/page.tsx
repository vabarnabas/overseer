"use client";
import NeonLogo from "@/components/logo/neon-logo";
import {
  CreateDatabase,
  createDatabaseSchema,
} from "@/schemas/create-database.schema";
import { useAuth, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BiLogoPostgresql } from "react-icons/bi";
import { FaAws, FaDatabase, FaFly } from "react-icons/fa6";
import { SiMicrosoftsqlserver, SiMysql, SiRailway } from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";

export default function NewDatabasePage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const providers = [
    {
      name: "Railway.app",
      value: "railway",
      icon: <SiRailway className="text-6xl" />,
    },
    {
      name: "Fly.io",
      value: "fly",
      icon: <FaFly className="text-6xl" />,
    },
    {
      name: "Azure",
      value: "azure",
      icon: <VscAzure className="text-6xl" />,
    },
    {
      name: "AWS",
      value: "aws",
      icon: <FaAws className="text-6xl" />,
    },
    {
      name: "Neon",
      value: "neon",
      icon: <NeonLogo className="text-6xl" />,
    },
    {
      name: "Other",
      value: "other",
      icon: <FaDatabase className="text-6xl" />,
    },
  ];

  const systems = [
    {
      name: "PostgreSQL",
      value: "postgres",
      icon: <BiLogoPostgresql className="text-6xl" />,
    },
    {
      name: "MySQL",
      value: "mysql",
      icon: <SiMysql className="text-6xl" />,
    },
    {
      name: "MsSQL",
      value: "mssql",
      icon: <SiMicrosoftsqlserver className="text-6xl" />,
    },
  ];

  const form = useForm<CreateDatabase>({
    defaultValues: {
      provider: providers[0].value,
      type: systems[0].value,
    },
    resolver: zodResolver(createDatabaseSchema),
  });
  const {
    register,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const { trigger } = useSWRMutation(
    "/databases",
    async (url, { arg: formValues }: { arg: CreateDatabase }) => {
      const token = await getToken();

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: "POST",
        body: JSON.stringify({ ...formValues, userId: user!.id }),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/");
    }
  );

  const { trigger: triggerTest } = useSWRMutation(
    "/databases/test",
    async (
      url,
      { arg }: { arg: Pick<CreateDatabase, "type" | "connectionString"> }
    ) => {
      const token = await getToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: "POST",
        body: JSON.stringify(arg),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to Test Connection");
      }
    }
  );

  const onSubmit = handleSubmit((formValues) => trigger(formValues));

  watch();

  return (
    <div className="overflow-y-auto scrollbar-hide p-4">
      <FormProvider {...form}>
        <div className="w-full flex items-center justify-between mb-4 ">
          <p className="text-2xl font-semibold">New Database</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
          <div className="">
            <p className="text-sm font-medium mb-1">Database Name</p>
            <input
              {...register("name")}
              placeholder="e.g. My Database"
              type="text"
              className="w-full border rounded-lg px-4 py-1.5"
            />
          </div>
          <div className="">
            <p className="text-sm font-medium mb-1">Connection String</p>
            <div className="relative flex items-center">
              <input
                {...register("connectionString")}
                placeholder="e.g. postgresql://username:password@host:port"
                type="text"
                className="w-full border rounded-lg pl-4 pr-36 py-1.5"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toast.promise(triggerTest(getValues()), {
                    loading: "Testing Connection...",
                    success: "Connection Successful",
                    error: "Failed to Connect",
                  });
                }}
                disabled={
                  !getValues("connectionString") ||
                  getValues("connectionString").length < 10
                }
                className="absolute right-4 text-sm text-primary hover:text-primary-darker font-medium z-10 disabled:text-rich-black/30"
              >
                Test Connection
              </button>
            </div>
          </div>
          <div className="">
            <p className="text-sm font-medium mb-1">Database Provider</p>
            <div className="grid grid-cols-2 border rounded-lg overflow-hidden p-1 gap-1">
              {providers.map((provider) => (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("provider", provider.value);
                  }}
                  key={provider.name}
                  className={clsx(
                    "flex flex-col items-center justify-center gap-y-2 p-4 hover:bg-slate-50 rounded-lg",
                    getValues("provider") === provider.value && "bg-slate-100"
                  )}
                >
                  <span
                    className={clsx(
                      getValues("provider") === provider.value && "text-primary"
                    )}
                  >
                    {provider.icon}
                  </span>
                  <p className="">{provider.name}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="">
            <p className="text-sm font-medium mb-1">Database Type</p>
            <div className="grid grid-cols-2 border rounded-lg overflow-hidden p-1 gap-1">
              {systems.map((system) => (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("type", system.value);
                  }}
                  key={system.name}
                  className={clsx(
                    "flex flex-col items-center justify-center gap-y-2 p-4 hover:bg-slate-50 rounded-lg",
                    getValues("type") === system.value && "bg-slate-100"
                  )}
                >
                  <span
                    className={clsx(
                      getValues("type") === system.value && "text-primary"
                    )}
                  >
                    {system.icon}
                  </span>
                  <p className="">{system.name}</p>
                </button>
              ))}
            </div>
          </div>
          <button className="w-full bg-primary px-4 py-1.5 rounded-md text-white hover:bg-primary-darker flex justify-center">
            Add Database
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
