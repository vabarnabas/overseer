import { z } from "zod";

export const updateDatabaseSchema = z.object({
  name: z.string().min(1),
  provider: z.string(),
  type: z.string(),
  connectionString: z.string(),
  userId: z.string(),
  state: z.string(),
});

export type UpdateDatabase = z.infer<typeof updateDatabaseSchema>;
