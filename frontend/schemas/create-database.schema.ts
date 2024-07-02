import { z } from "zod";

export const createDatabaseSchema = z.object({
  name: z.string().min(1),
  provider: z.string(),
  type: z.string(),
  connectionString: z.string(),
});

export type CreateDatabase = z.infer<typeof createDatabaseSchema>;
