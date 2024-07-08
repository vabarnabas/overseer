import { z } from "zod";

export const createDatabaseSchema = z.object({
  name: z.string(),
  provider: z.string(),
  type: z.string(),
  connectionString: z.string(),
  userId: z.string(),
  state: z.string(),
});

export type CreateDatabase = z.infer<typeof createDatabaseSchema>;
