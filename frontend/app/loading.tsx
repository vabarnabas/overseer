import { Database } from "lucide-react";
import React from "react";

export default function CustomerError({ reset }: { reset: () => void }) {
  return (
    <div className="flex-grow flex-col justify-center w-full items-center flex">
      <div className="size-20 flex justify-center items-center rounded-full bg-primary text-primary-foreground animate-spin">
        <Database className="size-10" />
      </div>
    </div>
  );
}
