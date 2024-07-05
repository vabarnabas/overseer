import { useAuth } from "@clerk/nextjs";
import { Editor, Monaco } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { FaSave, FaFolderOpen, FaPlay } from "react-icons/fa";
import useSWRMutation from "swr/mutation";
import ObjectTable from "../object-table/object-table";
import { toast } from "sonner";
import "monaco-editor/esm/vs/basic-languages/sql/sql.contribution";

interface Props {
  type: "postgres" | "mysql";
}

export default function EditorSection({ type }: Props) {
  const [editorContent, setEditorContent] = useState("");
  const { getToken } = useAuth();
  const { id } = useParams();

  const { trigger, data: queryData } = useSWRMutation(
    `/databases/${id}/query`,
    async (url) => {
      const token = await getToken();

      if (!editorContent) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: editorContent }),
      });
      const data = await res.json();
      return data;
    }
  );

  const runQuery = () => {
    toast.promise(trigger(), {
      loading: "Executing Query...",
      success: "Query Executed Successfully",
      error: "Failed to Execute Query",
    });
  };

  return (
    <div className="flex flex-col mt-6 w-full flex-grow">
      <div className="relative ">
        <Editor
          className="overflow-hidden flex w-full rounded-md min-w-0 flex-1 absolute h-full"
          defaultLanguage="sql"
          theme="vs-dark"
          value={editorContent}
          onChange={(e) => setEditorContent(e || "")}
          height={"18rem"}
          options={{ minimap: { enabled: false }, automaticLayout: true }}
          beforeMount={(monaco: Monaco) => {
            monaco.editor.addEditorAction({
              id: "runSqlQuery",
              label: "Run SQL Query",
              keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
              run: () => {
                runQuery();
              },
            });
          }}
        />
      </div>
      <div className="px-2 py-2 gap-x-4 rounded-md top-3 bg-white flex items-center justify-end">
        <button className="hover:text-primary flex items-center gap-x-1.5">
          <FaSave /> Save Query
        </button>
        <button
          onClick={() => {
            runQuery();
          }}
          className="hover:text-primary flex items-center gap-x-1.5"
        >
          <FaPlay className="text-sm" /> Run Query
        </button>
      </div>
      <div className="relative border rounded-md flex flex-1 overflow-hidden">
        <span className="absolute overflow-auto h-full w-full">
          {queryData ? (
            <ObjectTable rows={queryData.rows} fields={queryData.fields} />
          ) : null}
        </span>
      </div>
    </div>
  );
}
