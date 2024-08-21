"use client";
import { Editor, Monaco } from "@monaco-editor/react";
import { Play, Save } from "lucide-react";
import React, { useState, useEffect } from "react";
import { queryDatabase } from "@/lib/actions/database-actions";
import { toast } from "sonner";
import ObjectTable from "../object-table/object-table";

export default function EditorClient({
  id,
  type,
}: {
  id: string;
  type: string;
}) {
  const [editorContent, setEditorContent] = useState("");
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [fields, setFields] = useState<Record<"name", string>[] | undefined>(
    undefined
  );

  const runQuery = async (id: string, query: string) => {
    return await queryDatabase(id, query);
  };

  return (
    <>
      <div className="gap-x-1.5 rounded-md flex items-center justify-start mb-1.5">
        <button
          onClick={async () => {
            const response = await runQuery(id, editorContent);
            setRows(response.rows);
            setFields(response.fields);
          }}
          className="hover:text-primary flex items-center gap-x-1.5 px-3 py-1 rounded-md text-sm transition-all ease-in-out duration-200 hover:bg-primary/10"
        >
          <Play className="text-xs" /> Run Query
        </button>
        <button className="hover:text-primary flex items-center gap-x-1.5 px-3 py-1 rounded-md text-sm transition-all ease-in-out duration-200 hover:bg-primary/10">
          <Save /> Save Query
        </button>
      </div>
      <div className="relative">
        <Editor
          className="overflow-hidden flex w-full rounded-md min-w-0 flex-1 absolute h-full"
          defaultLanguage="sql"
          theme="vs-dark"
          value={editorContent}
          onChange={(e) => setEditorContent(e || "")}
          height={"18rem"}
          options={{ minimap: { enabled: false }, automaticLayout: true }}
        />
      </div>
      <div className="relative border rounded-md flex flex-1 overflow-hidden mt-1.5">
        <span className="absolute overflow-auto h-full w-full">
          {rows.length ? <ObjectTable rows={rows} fields={fields} /> : null}
        </span>
      </div>
    </>
  );
}
