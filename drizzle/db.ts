import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema"
const connectionString = process.env.DATABASE_URL_SUPABASE;
const db = drizzle(connectionString!, {schema})

export default db
