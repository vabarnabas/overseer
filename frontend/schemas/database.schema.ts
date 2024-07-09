import { z } from "zod";

export const databaseSchema = z.object({
  name: z.string().min(1),
  provider: z.string(),
  type: z.string(),
  connectionString: z.string(),
  state: z.string(),
  userId: z.string(),
});

export type Database = z.infer<typeof databaseSchema>;
