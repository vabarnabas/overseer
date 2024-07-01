import { Pool } from "pg";
import { prisma } from "../prisma";
import { getTablesSQL } from "../constants/sql";
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

  private async createPostgresClient(connectionString: string) {
    const pool = new Pool({ connectionString: connectionString });

    try {
      return await pool.connect();
    } catch {
      throw new Error("Failed to Connect to Database");
    }
  }

  async testConnection(type: string, connectionString: string) {
    if (type === "postgres") {
      const client = await this.createPostgresClient(connectionString);
      client.release();
    }
  }

  async getTables(type: string, connectionString: string) {
    if (type === "postgres") {
      const client = await this.createPostgresClient(connectionString);
      const schema = await client.query(getTablesSQL);
      client.release();
      return schema.rows.map((row) => row.table_name);
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
