"use client";
import {
  CreateDatabase,
  createDatabaseSchema,
} from "@/schemas/create-database.schema";
import { useAuth, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BiLogoPostgresql } from "react-icons/bi";
import { FaDatabase, FaFly } from "react-icons/fa6";
import { SiRailway } from "react-icons/si";
import useSWRMutation from "swr/mutation";

export default function NewDatabasePage() {
  const { getToken } = useAuth();
  const { user } = useUser();

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

  console.log(errors, getValues());

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
    }
  );

  const onSubmit = handleSubmit((formValues) => trigger(formValues));

  watch();

  return (
    <div>
      <FormProvider {...form}>
        <div className="w-full flex items-center justify-between mb-4">
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
            <input
              {...register("connectionString")}
              placeholder="e.g. postgresql://username:password@host:port"
              type="text"
              className="w-full border rounded-lg px-4 py-1.5"
            />
          </div>
          <div className="">
            <p className="text-sm font-medium mb-1">Database Provider</p>
            <div className="grid grid-cols-2 border rounded-lg overflow-hidden">
              {providers.map((provider) => (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("provider", provider.value);
                  }}
                  key={provider.name}
                  className={clsx(
                    "flex flex-col items-center justify-center gap-y-2 p-4 hover:bg-slate-50",
                    getValues("provider") === provider.value && "bg-slate-100"
                  )}
                >
                  {provider.icon}
                  <p className="">{provider.name}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="">
            <p className="text-sm font-medium mb-1">Database Type</p>
            <div className="grid grid-cols-2 border rounded-lg overflow-hidden">
              {systems.map((system) => (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("type", system.value);
                  }}
                  key={system.name}
                  className={clsx(
                    "flex flex-col items-center justify-center gap-y-2 p-4 hover:bg-slate-50",
                    getValues("type") === system.value && "bg-slate-100"
                  )}
                >
                  {system.icon}
                  <p className="">{system.name}</p>
                </button>
              ))}
            </div>
          </div>
          <button className="w-full bg-black px-4 py-1.5 rounded-md text-white hover:bg-black/80 flex justify-center">
            Add Database
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
