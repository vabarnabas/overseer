"use client";
import { deleteDatabase } from "@/lib/actions/database-actions";
import { Button } from "@headlessui/react";
import React from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function DeleteDatabaseButton({ id }: { id: string }) {
  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.stopPropagation();
        toast.promise(deleteDatabase(id), {
          loading: "Deleting Database...",
          success: "Database Deleted",
          error: "Failed to Delete",
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
