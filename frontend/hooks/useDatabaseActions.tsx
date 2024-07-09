import { encrypt } from "@/lib/encryption";
import { errorHandler } from "@/lib/error-handler";
import { CreateDatabase } from "@/schemas/create-database.schema";
import { Database } from "@/schemas/database.schema";
import { UpdateDatabase } from "@/schemas/update-database.schema";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";

export default function useDatabaseActions() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();

  const createDatabase = useSWRMutation(
    "/databases",
    async (url, { arg: formValues }: { arg: CreateDatabase }) => {
      const token = await getToken();

      formValues.connectionString = encrypt(formValues.connectionString);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: "POST",
        body: JSON.stringify({
          ...formValues,
          userId: user!.id,
          state: "development",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to Create Database");
      }

      router.push("/databases");
    }
  );

  const updateDatabase = useSWRMutation(
    "/databases",
    async (
      url,
      {
        arg: { id, formValues },
      }: { arg: { id: string; formValues: UpdateDatabase } }
    ) => {
      const token = await getToken();

      formValues.connectionString = encrypt(formValues.connectionString);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...formValues,
            userId: user!.id,
            state: "development",
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to Create Database");
      }

      router.push("/");
    }
  );

  const testDatabaseConnection = useSWRMutation(
    "/databases/test",
    async (
      url,
      { arg }: { arg: Pick<CreateDatabase, "type" | "connectionString"> }
    ) => {
      const token = await getToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: "POST",
        body: JSON.stringify(arg),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to Test Connection");
      }
    }
  );

  const deleteDatabase = useSWRMutation(
    "/databases",
    async (url, { arg: id }: { arg: string }) => {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to Test Connection");
      }
    }
  );

  return {
    createDatabase,
    updateDatabase,
    testDatabaseConnection,
    deleteDatabase,
  };
}
