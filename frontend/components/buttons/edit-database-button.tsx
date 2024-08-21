"use client";
import React from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { redirect, useRouter } from "next/navigation";

export default function EditDatabaseButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/databases/editor/${id}`);
      }}
    >
      Edit
    </DropdownMenuItem>
  );
}
