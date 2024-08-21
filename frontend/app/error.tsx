"use client";

import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import React from "react";

export default function CustomerError({ reset }: { reset: () => void }) {
  return (
    <div className="flex-grow flex-col justify-center w-full items-center flex">
      <div className="size-20 flex justify-center items-center rounded-full bg-primary text-primary-foreground">
        <Database className="size-10" />
      </div>
      <div className="text-center">
        <p className="text-3xl font-semibold mt-4">
          Oh no! Something went wrong.
        </p>
        <p className="max-w-96 text-muted-foreground mt-2">
          It seems something went wrong during the data loading. Please wait a
          bit or try again.
        </p>
      </div>
      <Button onClick={reset} className="mt-6">
        Try Again
      </Button>
    </div>
  );
}
