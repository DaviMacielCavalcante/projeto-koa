import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL não está definido. Configure no .env (veja .env.example).');
}

const client = postgres(databaseUrl, { prepare: false });

export const db = drizzle(client);

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
