import { useAuth } from "@clerk/nextjs";
import { Editor } from "@monaco-editor/react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSave, FaFolderOpen, FaPlay } from "react-icons/fa";
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

  const {
    trigger,
    data: queryData,
    error,
  } = useSWRMutation(`/databases/${id}/query`, async (url) => {
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
  });

  useEffect(() => {
    if (!error && queryData) {
      setInternalState(InternalState.QueryResult);
    }
  }, [queryData, error]);

  return (
    <div className="flex flex-col mt-6 w-full flex-grow">
      <div className="relative flex">
        <Editor
          className="overflow-hidden flex w-full rounded-md"
          defaultLanguage="sql"
          theme="vs-dark"
          value={editorContent}
          onChange={(e) => setEditorContent(e || "")}
          height={"16rem"}
          options={{ minimap: { enabled: false } }}
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
      <div className="relative border rounded-md flex mt-2 flex-1 overflow-hidden">
        <span className="absolute overflow-auto h-full w-full">
          {queryData ? (
            <ObjectTable rows={queryData.rows} fields={queryData.fields} />
          ) : null}
        </span>
      </div>
    </div>
  );
}
