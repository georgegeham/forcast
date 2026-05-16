// lib/get-current-user.ts
import { auth } from "@/lib/auth/auth";
import db from "@/drizzle/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  return db.query.user.findFirst({
    where: (user) => eq(user.id, session.user.id),
    with: {
      profile: {
        with: { plays: true },
      },
    },
  });
});

export type CurrentUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>;
