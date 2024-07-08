import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { DatabaseController } from "./controllers/database.controller";
import { cors } from "hono/cors";
import { clerkMiddleware } from "@hono/clerk-auth";
import { logger } from "hono/logger";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.use(cors());
app.use(logger());
app.use(clerkMiddleware());

app.route("/databases", DatabaseController);

const port = parseInt(process.env.PORT ?? "3000");
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
