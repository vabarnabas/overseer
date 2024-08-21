import EditorClient from "@/components/editor/editor";
import ProviderIcon from "@/components/provider-icon/provider-icon";
import EditorSection from "@/components/sections/editor-section";
import { getDatabase } from "@/lib/actions/database-actions";

export default async function SpecificDatabase({
  params: { id },
}: {
  params: { id: string };
}) {
  const database = await getDatabase(id);

  return (
    <div className="p-4 flex flex-grow flex-col">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-x-5 items-center">
          <div className="text-4xl text-primary">
            <ProviderIcon provider={database.provider} type={database.type} />
          </div>
          <div className="text-start">
            <p className="font-semibold text-2xl">{database.name}</p>
            <p className="text-sm opacity-60 -mt-1">{`${database.type} / ${database.provider}`}</p>
          </div>
        </div>
      </div>
      <div className="h-full w-full flex flex-grow">
        <EditorSection id={id} type={database.type} />
      </div>
    </div>
  );
}
