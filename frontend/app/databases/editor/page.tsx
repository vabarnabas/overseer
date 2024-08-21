"use client";
import {
  CreateDatabase,
  createDatabaseSchema,
} from "@/schemas/create-database.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import useDatabaseProviders from "@/hooks/useDatabaseProviders";
import { cn } from "@/lib/utils";
import {
  createDatabase,
  testDatabaseConnection,
} from "@/lib/actions/database-actions";

export default function NewDatabasePage() {
  const { providers, systems } = useDatabaseProviders();

  const form = useForm<CreateDatabase>({
    defaultValues: {
      provider: providers[0].value,
      type: systems[0].value,
    },
    resolver: zodResolver(createDatabaseSchema),
  });
  const { register, watch, getValues, setValue, handleSubmit } = form;

  const onSubmit = handleSubmit((formValues) =>
    toast.promise(createDatabase(formValues), {
      loading: "Creating Database...",
      success: "Database Created",
      error: "Failed to Create Database",
    })
  );

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
                  toast.promise(testDatabaseConnection(getValues()), {
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
                  className={cn(
                    "flex flex-col items-center justify-center gap-y-2 p-4 hover:bg-slate-50 rounded-lg",
                    getValues("provider") === provider.value && "bg-slate-100"
                  )}
                >
                  <span
                    className={cn(
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
                  className={cn(
                    "flex flex-col items-center justify-center gap-y-2 p-4 hover:bg-slate-50 rounded-lg",
                    getValues("type") === system.value && "bg-slate-100"
                  )}
                >
                  <span
                    className={cn(
                      "text-6xl",
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
