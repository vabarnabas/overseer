import { Hono } from "hono";
import { DatabaseService } from "../services/database.service";
import { getAuth } from "@hono/clerk-auth";
import { BadRequestError, UnauthorizedError } from "../constants/errors";
import { zValidator } from "@hono/zod-validator";
import { createDatabaseSchema } from "../dto/create-database.dto";
import { updateDatabaseSchema } from "../dto/update-database.dto";
import { z } from "zod";

const databaseService = new DatabaseService();

export const DatabaseController = new Hono();

DatabaseController.get("/me", async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json(UnauthorizedError, 401);
  }

  const databases = await databaseService.findMy(auth.userId!);

  return c.json(databases);
});

DatabaseController.get("/:id", async (c) => {
  const { id } = c.req.param();

  const database = await databaseService.findSpecific(id);

  return c.json(database);
});

DatabaseController.get("/:id/tables", async (c) => {
  const { id } = c.req.param();

  const database = await databaseService.findSpecific(id);

  if (!database) {
    return c.json({ error: "Database Not Found" }, 404);
  }

  const decryptedConnectionString = databaseService.decrypt(
    database.connectionString
  );

  const tables = await databaseService.getTables(
    database.type,
    decryptedConnectionString
  );

  if (!tables) {
    return c.json({ error: "Failed to Get Tables" }, 500);
  }

  return c.json(tables);
});

DatabaseController.post("/test", async (c) => {
  const { connectionString, type } = await c.req.json();

  try {
    await databaseService.testConnection(type, connectionString);
  } catch (e) {
    return c.json({ error: "Failed to Test Connection" }, 400);
  }

  return c.json({ message: "Connection Successful" });
});

DatabaseController.post(
  "/",
  zValidator("json", createDatabaseSchema),
  async (c) => {
    const dto = c.req.valid("json");
    const auth = getAuth(c);

    if (!dto) {
      return c.json(BadRequestError, 400);
    }

    if (!auth?.userId) {
      return c.json(UnauthorizedError, 401);
    }

    try {
      const database = await databaseService.create(dto);
      return c.json(database);
    } catch {
      return c.json(
        { error: "Something Went Wrong Creating Your Database Entry" },
        400
      );
    }
  }
);

DatabaseController.post("/:id/query", async (c) => {
  const { id } = c.req.param();
  const auth = getAuth(c);
  const { query } = await c.req.json();

  if (!query) {
    return c.json(BadRequestError, 400);
  }

  if (!auth?.userId) {
    return c.json(UnauthorizedError, 401);
  }

  const database = await databaseService.findSpecific(id);

  if (!database) {
    return c.json({ error: "Database Not Found" }, 404);
  }

  const decryptedConnectionString = databaseService.decrypt(
    database.connectionString
  );

  const result = await databaseService.runQuery(
    database.type,
    decryptedConnectionString,
    query
  );

  return c.json(result);
});

DatabaseController.put(
  "/:id",
  zValidator("json", updateDatabaseSchema),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.param();
    const dto = await c.req.valid("json");

    if (!dto) {
      return c.json(BadRequestError, 400);
    }

    if (!auth?.userId) {
      return c.json(UnauthorizedError, 401);
    }

    try {
      const database = await databaseService.update(id, dto);
      return c.json(database);
    } catch {
      return c.json(
        { error: "Something Went Wrong Updating Your Database Entry" },
        400
      );
    }
  }
);

DatabaseController.delete("/:id", async (c) => {
  const auth = getAuth(c);
  const { id } = c.req.param();

  if (!auth?.userId) {
    return c.json(UnauthorizedError, 401);
  }

  try {
    await databaseService.delete(id);
    return c.json({ message: "Database Deleted" });
  } catch {
    return c.json(
      { error: "Something Went Wrong Deleting Your Database Entry" },
      400
    );
  }
});
