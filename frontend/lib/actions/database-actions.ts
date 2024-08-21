"use server";
import { CreateDatabase } from "@/schemas/create-database.schema";
import { Database } from "@/schemas/database.schema";
import { UpdateDatabase } from "@/schemas/update-database.schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { decrypt } from "../encryption";

export async function getDatabase(id: string): Promise<Database> {
  const { getToken } = auth();

  const databaseResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/databases/${id}`,
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );

  if (!databaseResponse.ok) {
    throw new Error("Failed to fetch database");
  }

  const database = await databaseResponse.json();

  database.connectionString = decrypt(database.connectionString);

  return database;
}

export async function queryDatabase(id: string, query: string) {
  const { getToken } = auth();

  console.log("query", query);

  const queryResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/databases/${id}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!queryResponse.ok) {
    throw new Error("Failed to Query Database");
  }

  return await queryResponse.json();
}

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

  return await response.json();
}
