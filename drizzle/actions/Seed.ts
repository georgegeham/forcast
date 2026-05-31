"use server";

import { auth } from "@/lib/auth/auth";
import db from "@/drizzle/db";
import { user } from "@/drizzle/schemas/auth-schema";
import { CreateUser } from "@/drizzle/services/Users";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_NAME = process.env.ADMIN_NAME!;
export async function seedAdmin(): Promise<{
  error: boolean;
  message?: string;
}> {
  try {
    const existing = await db
      .select()
      .from(user)
      .where(eq(user.email, ADMIN_EMAIL))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(user)
        .set({ role: "admin" })
        .where(eq(user.email, ADMIN_EMAIL));
      return { error: false, message: "Admin role updated." };
    }

    const result = await auth.api.signUpEmail({
      body: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
      asResponse: false,
    });

    if (!result?.user?.id) {
      return { error: true, message: "Failed to create admin user." };
    }

    await CreateUser(result.user.id);

    await db
      .update(user)
      .set({ role: "admin", completedProfile: true, emailVerified: true })
      .where(eq(user.id, result.user.id));

    return {
      error: false,
      message: `Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`,
    };
  } catch (e) {
    return {
      error: true,
      message: e instanceof Error ? e.message : "Seed failed",
    };
  }
}
