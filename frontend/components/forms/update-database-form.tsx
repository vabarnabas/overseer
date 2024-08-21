"use client";
import { CreateDatabase } from "@/schemas/create-database.schema";
import React from "react";
import {
  FieldValues,
  useForm,
  UseFormRegisterReturn,
  UseFormReturn,
} from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { testDatabaseConnection } from "@/lib/actions/database-actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useDatabaseProviders from "@/hooks/useDatabaseProviders";
import {
  UpdateDatabase,
  updateDatabaseSchema,
} from "@/schemas/update-database.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function UpdateDatabaseForm({
  defaultValues,
}: {
  defaultValues: UpdateDatabase;
}) {
  const { providers, systems } = useDatabaseProviders();

  const form = useForm<UpdateDatabase>({
    defaultValues,
    resolver: zodResolver(updateDatabaseSchema),
  });

  const values = form.watch();

  return (
    <Form {...form}>
      <div className="w-full flex items-center justify-between mb-4 ">
        <p className="text-2xl font-semibold">New Database</p>
      </div>
      <form className="flex flex-col gap-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. My Database" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="connectionString"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connection String</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    placeholder="e.g. postgresql://username:password@host:port"
                    {...field}
                  />
                  <Button
                    variant="link"
                    className="absolute right-1 "
                    onClick={(e) => {
                      e.preventDefault();
                      toast.promise(testDatabaseConnection(form.getValues()), {
                        loading: "Testing Connection...",
                        success: "Connection Successful",
                        error: "Failed to Connect",
                      });
                    }}
                    disabled={
                      !values.connectionString ||
                      values.connectionString.length < 10
                    }
                  >
                    Test Connection
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Database Provider</FormLabel>
          <div className="grid grid-cols-2 border rounded-lg overflow-hidden p-1 gap-1">
            {providers.map((provider) => (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  form.setValue("provider", provider.value);
                }}
                key={provider.name}
                className={cn(
                  "flex flex-col items-center justify-center gap-y-2 p-4 hover:bg-slate-50 rounded-lg",
                  values.provider === provider.value && "bg-slate-100"
                )}
              >
                <span
                  className={cn(
                    "text-5xl",
                    values.provider === provider.value && "text-primary"
                  )}
                >
                  {provider.icon}
                </span>
                <p className="">{provider.name}</p>
              </button>
            ))}
          </div>
        </FormItem>
        <FormItem>
          <FormLabel>Database Type</FormLabel>
          <div className="grid grid-cols-2 border rounded-lg overflow-hidden p-1 gap-1">
            {systems.map((system) => (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  form.setValue("type", system.value);
                }}
                key={system.name}
                className={cn(
                  "flex flex-col items-center justify-center gap-y-2 p-4 hover:bg-slate-50 rounded-lg",
                  values.type === system.value && "bg-slate-100"
                )}
              >
                <span
                  className={cn(
                    "text-6xl",
                    form.getValues("type") === system.value && "text-primary"
                  )}
                >
                  {system.icon}
                </span>
                <p className="">{system.name}</p>
              </button>
            ))}
          </div>
        </FormItem>
        <button className="w-full bg-primary px-4 py-1.5 rounded-md text-white hover:bg-primary-darker flex justify-center">
          Add Database
        </button>
      </form>
    </Form>
  );
}
