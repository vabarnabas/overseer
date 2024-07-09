"use client";
import useDatabaseActions from "@/hooks/useDatabaseActions";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BiLogoPostgresql } from "react-icons/bi";
import { FaAws, FaDatabase, FaFly } from "react-icons/fa6";
import { SiMicrosoftsqlserver, SiMysql, SiRailway } from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { toast } from "sonner";
import { RiSupabaseFill } from "react-icons/ri";
import useDatabaseProviders from "@/hooks/useDatabaseProviders";
import { useParams } from "next/navigation";
import useSWRImmutable from "swr/immutable";
import { useAuth } from "@clerk/nextjs";
import { isErrored } from "stream";
import { errorHandler } from "@/lib/error-handler";
import { Database } from "@/schemas/database.schema";
import {
  UpdateDatabase,
  updateDatabaseSchema,
} from "@/schemas/update-database.schema";
import { decrypt } from "@/lib/encryption";

export default function NewDatabasePage() {
  const { id } = useParams();
  const { getToken } = useAuth();

  const { updateDatabase, testDatabaseConnection } = useDatabaseActions();
  const { providers, systems } = useDatabaseProviders();

  const { data, isValidating, error } = useSWRImmutable(
    `/databases/${id}`,
    async (url) => {
      return errorHandler(async () => {
        const token = await getToken();

        const databaseResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${url}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!databaseResponse.ok) {
          throw new Error("Failed to fetch database");
        }

        const database = await await databaseResponse.json();

        database.connectionString = decrypt(database.connectionString);

        return database as Database;
      });
    }
  );

  const form = useForm<UpdateDatabase>({
    defaultValues: {
      provider: providers[0].value,
      type: systems[0].value,
    },
    resolver: zodResolver(updateDatabaseSchema),
  });
  const { register, watch, getValues, setValue, handleSubmit, reset } = form;

  const onSubmit = handleSubmit((formValues) =>
    toast.promise(updateDatabase.trigger({ id: id as string, formValues }), {
      loading: "Updating Database...",
      success: "Database Updated",
      error: "Failed to Update Database",
    })
  );

  useEffect(() => {
    if (!isValidating && !error && data) {
      reset({
        name: data.name,
        connectionString: data.connectionString,
        provider: data.provider,
        type: data.type,
        state: data.state,
        userId: data.userId,
      });
    }
  }, [data, error, isValidating, reset]);

  watch();

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
                  toast.promise(testDatabaseConnection.trigger(getValues()), {
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
                      "text-5xl",
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
                      "text-5xl",
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
