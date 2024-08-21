import EditorClient from "../editor/editor";

export default function EditorSection({
  id,
  type,
}: {
  type: string;
  id: string;
}) {
  return (
    <div className="flex flex-col mt-6 w-full flex-grow">
      <EditorClient id={id} type={type} />
      
    </div>
  );
}
