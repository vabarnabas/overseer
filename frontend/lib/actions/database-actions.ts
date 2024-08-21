"use server";
import { CreateDatabase } from "@/schemas/create-database.schema";
import { Database } from "@/schemas/database.schema";
import { UpdateDatabase } from "@/schemas/update-database.schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

export async function createDatabase(dto: CreateDatabase): Promise<Database> {
  const user = await currentUser();
  const { getToken } = auth();

  if (!user) {
    throw new Error("User not found");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/databases`, {
    method: "POST",
    body: JSON.stringify({ ...dto, userId: user.id, state: "development" }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to Create Database");
  }

  revalidateTag("/databases");
  return await response.json();
}

export async function updateDatabase(id: string, dto: UpdateDatabase) {
  const user = await currentUser();
  const { getToken } = auth();

  if (!user) {
    throw new Error("User not found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/databases/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(dto),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to Update Database");
  }

  revalidateTag("/databases");
  return await response.json();
}

export async function deleteDatabase(id: string) {
  const { getToken } = auth();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/databases/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to Delete Database");
  }

  revalidateTag("/databases");
}

export async function testDatabaseConnection(
  dto: Pick<CreateDatabase, "type" | "connectionString">
) {
  const { getToken } = auth();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/databases/test`,
    {
      method: "POST",
      body: JSON.stringify(dto),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to Test Database Connection");
  }

  revalidateTag("/databases");
  return await response.json();
}
