import { auth } from "./auth";
import { headers } from "next/headers";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  if ((session.user as { role?: string }).role !== "admin")
    throw new Error("Forbidden");
  return session.user;
}
