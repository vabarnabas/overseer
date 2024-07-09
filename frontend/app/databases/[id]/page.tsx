"use client";
import DatabaseTableRow from "@/components/database-table-row/database-table-row";
import ProviderIcon from "@/components/provider-icon/provider-icon";
import EditorSection from "@/components/sections/editor-section";
import { errorHandler } from "@/lib/error-handler";
import { Database } from "@/schemas/database.schema";
import { useAuth } from "@clerk/nextjs";
import { Editor } from "@monaco-editor/react";
import { AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { BsDiagram2Fill } from "react-icons/bs";
import { FaSave } from "react-icons/fa";
import { FaDiagramProject, FaFolderOpen, FaPlay } from "react-icons/fa6";
import { TbSql } from "react-icons/tb";
import useSWRImmutable from "swr/immutable";
import useSWRMutation from "swr/mutation";

export default function SpecificDatabase() {
  const [isEditorShown, setIsEditorShown] = useState(true);
  const { id } = useParams();
  const { getToken } = useAuth();

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

        return (await databaseResponse.json()) as Database;
      });
    }
  );

  console.log(data);

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
    <div className="p-4 flex flex-grow flex-col">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-x-5 items-center">
          <div className="text-4xl text-primary">
            <ProviderIcon provider={data.provider} type={data.type} />
          </div>
          <div className="text-start">
            <p className="font-semibold text-2xl">{data.name}</p>
            <p className="text-sm opacity-60 -mt-1">{`${data.type} / ${data.provider}`}</p>
          </div>
        </div>
      </div>
      <div className="h-full w-full flex flex-grow">
        <EditorSection type={data.type} />
      </div>
    </div>
  );
}
