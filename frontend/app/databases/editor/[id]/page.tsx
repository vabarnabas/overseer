import { getDatabase } from "@/lib/actions/database-actions";
import UpdateDatabaseForm from "@/components/forms/update-database-form";

export default async function NewDatabasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const database = await getDatabase(id);

  return <UpdateDatabaseForm defaultValues={database} />;
}
