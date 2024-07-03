"use client";
import DatabaseTableRow from "@/components/database-table-row/database-table-row";
import ProviderIcon from "@/components/provider-icon/provider-icon";
import EditorSection from "@/components/sections/editor-section";
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
      const token = await getToken();

      const databaseResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const database = await databaseResponse.json();

      const tablesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}/tables`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const tables = await tablesResponse.json();

      return { database, tables };
    }
  );

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
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-x-5 items-center">
          <div className="text-4xl text-primary">
            <ProviderIcon
              provider={data.database.provider}
              type={data.database.type}
            />
          </div>
          <div className="text-start">
            <p className="font-semibold text-2xl">{data.database.name}</p>
            <p className="text-sm opacity-60 -mt-1">{`${data.database.type} / ${data.database.provider}`}</p>
          </div>
        </div>
        <button
          onClick={() =>
            setIsEditorShown((prevIsEditorShown) => !prevIsEditorShown)
          }
          className="text-3xl hover:text-primary"
        >
          {isEditorShown ? <FaDiagramProject className="text-xl" /> : <TbSql />}
        </button>
      </div>
      {isEditorShown ? (
        <EditorSection />
      ) : (
        <>
          <p className="text-2xl font-semibold mt-6 mb-4">Schema</p>
          <AnimatePresence>
            <div className="flex flex-col gap-y-1">
              {data.tables.map((table: any) => (
                <DatabaseTableRow key={table.tableName} table={table} />
              ))}
            </div>
          </AnimatePresence>
        </>
      )}
    </>
  );
}
