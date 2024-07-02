import { Pool, PoolClient } from "pg";
import { prisma } from "../prisma";
import { getTablesAndColumnsQuery } from "../constants/sql";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export class DatabaseService {
  encrypt(text: string): string {
    if (text === undefined) {
      throw new Error("The 'text' argument must not be undefined");
    }

    const iv = randomBytes(16);
    const cipher = createCipheriv(
      "aes-256-gcm",
      Buffer.from(process.env.ENCRYPTION_KEY || "", "hex"),
      iv
    );

    const encrypted = Buffer.concat([
      cipher.update(text, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${encrypted.toString(
      "hex"
    )}:${authTag.toString("hex")}`;
  }

  decrypt(hash: string): string {
    const [iv, encryptedText, authTag] = hash.split(":");

    const decipher = createDecipheriv(
      "aes-256-gcm",
      Buffer.from(process.env.ENCRYPTION_KEY || "", "hex"),
      Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, "hex")),
      decipher.final(),
    ]);

    return decrypted.toString();
  }

  private async withPostgresClient<T>(
    connectionString: string,
    operation: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const pool = new Pool({ connectionString });
    const client = await pool.connect();
    try {
      return await operation(client);
    } finally {
      client.release();
    }
  }

  async testConnection(type: string, connectionString: string): Promise<void> {
    if (type === "postgres") {
      await this.withPostgresClient(connectionString, async () => {});
    }
  }

  async getTables(type: string, connectionString: string) {
    if (type === "postgres") {
      return await this.withPostgresClient(connectionString, async (client) => {
        const schema = await client.query(getTablesAndColumnsQuery);

        const tableMap = new Map<string, { name: string; type: string }[]>();

        schema.rows.forEach(
          ({
            table_name,
            column_name,
            data_type,
          }: {
            table_name: string;
            column_name: string;
            data_type: string;
          }) => {
            if (!tableMap.has(table_name)) {
              tableMap.set(table_name, []);
            }
            tableMap
              .get(table_name)
              ?.push({ name: column_name, type: data_type });
          }
        );

        const transformedResponse = Array.from(tableMap.entries()).map(
          ([tableName, columns]) => ({
            tableName,
            columns,
          })
        );

        return transformedResponse;
      });
    }
  }

  async findSpecific(id: string) {
    return await prisma.database.findUnique({ where: { id } });
  }

  async findMy(userId: string) {
    return await prisma.database.findMany({ where: { userId } });
  }

  async create(dto: any) {
    return await prisma.database.create({ data: dto });
  }
}
