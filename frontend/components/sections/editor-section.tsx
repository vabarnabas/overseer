import { useAuth } from "@clerk/nextjs";
import { Editor } from "@monaco-editor/react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { FaFolderOpen, FaPlay } from "react-icons/fa6";
import useSWRMutation from "swr/mutation";
import ObjectTable from "../object-table/object-table";
import { toast } from "sonner";

enum InternalState {
  Editor = "editor",
  QueryResult = "query-result",
}

export default function EditorSection() {
  const [internalState, setInternalState] = useState<InternalState>(
    InternalState.Editor
  );
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

  useEffect(() => {
    if (queryData) {
      setInternalState(InternalState.QueryResult);
    }
  }, [queryData]);

  return (
    <div className="flex flex-col flex-grow mt-6">
      <div className="flex items-center">
        <button
          onClick={() => setInternalState(InternalState.Editor)}
          className={clsx(
            "hover:bg-slate-100 text-sm font-medium py-1 border w-max px-6 flex justify-center rounded-t-md",
            internalState === InternalState.Editor && "bg-slate-100"
          )}
        >
          SQL Query
        </button>
        {queryData ? (
          <button
            onClick={() => setInternalState(InternalState.QueryResult)}
            className={clsx(
              "hover:bg-slate-100 text-sm font-medium py-1 border w-max px-6 flex justify-center rounded-t-md",
              internalState === InternalState.QueryResult && "bg-slate-100"
            )}
          >
            Query Result
          </button>
        ) : null}
      </div>
      {internalState === InternalState.Editor ? (
        <div className="relative flex flex-grow h-full">
          <Editor
            className="overflow-hidden flex flex-grow w-full h-full rounded-b-md"
            defaultLanguage="sql"
            theme="vs-dark"
            value={editorContent}
            onChange={(e) => setEditorContent(e || "")}
            height={"auto"}
          />
          <div className="absolute right-4 px-2 py-2 gap-x-3 rounded-md top-3 bg-white flex items-center justify-center">
            <button className="text-lg hover:text-primary">
              <FaFolderOpen />
            </button>
            <button className="text-lg hover:text-primary">
              <FaSave />
            </button>
            <button
              onClick={() =>
                toast.promise(trigger(), {
                  loading: "Executing Query...",
                  success: "Query Executed Successfully",
                  error: "Failed to Execute Query",
                })
              }
              className="text-lg hover:text-primary"
            >
              <FaPlay />
            </button>
          </div>
        </div>
      ) : null}
      {internalState === InternalState.QueryResult ? (
        <div className="flex overflow-x-auto">
          <ObjectTable rows={queryData.rows} fields={queryData.fields} />
        </div>
      ) : null}
    </div>
  );
}
