import { Hono } from "hono";
import { DatabaseService } from "../services/database.service";
import { getAuth } from "@hono/clerk-auth";
import { BadRequestError, UnauthorizedError } from "../constants/errors";

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

DatabaseController.post("/", async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json(UnauthorizedError, 401);
  }

  const dto = await c.req.json();

  if (!dto) {
    return c.json(BadRequestError, 400);
  }

  try {
    dto.connectionString = databaseService.encrypt(dto.connectionString);
    dto.state = "dev";
    const database = await databaseService.create(dto);
    return c.json(database);
  } catch {
    return c.json(
      { error: "Something Went Wrong Creating Your Database Entry" },
      400
    );
  }
});
