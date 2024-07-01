"use client";
import clsx from "clsx";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaDatabase } from "react-icons/fa6";
import { SiRailway } from "react-icons/si";

export default function NewDatabasePage() {
  const providers = [
    { name: "Railway.app", icon: <SiRailway className="text-6xl" /> },
    { name: "Other", icon: <FaDatabase className="text-6xl" /> },
  ];

  const form = useForm({
    defaultValues: {
      name: "",
      provider: providers[0].name,
    },
  });
  const { register, watch, getValues, setValue } = form;

  watch();

  return (
    <div>
      <FormProvider {...form}>
        <div className="w-full flex items-center justify-between mb-4">
          <p className="text-2xl font-semibold">New Database</p>
        </div>
        <form action="" className="flex flex-col gap-y-3">
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
            <p className="text-sm font-medium mb-1">Database Provider</p>
            <div className="grid grid-cols-2 border rounded-lg overflow-hidden">
              {providers.map((provider) => (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("provider", provider.name);
                  }}
                  key={provider.name}
                  className={clsx(
                    "flex flex-col items-center justify-center gap-y-2 p-4 hover:bg-slate-50",
                    getValues("provider") === provider.name && "bg-slate-100"
                  )}
                >
                  {provider.icon}
                  <p className="">{provider.name}</p>
                </button>
              ))}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
