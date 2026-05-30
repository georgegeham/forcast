"use server";

import z from "zod";
import { signUpSchema } from "../../schemas/Schemas";
import { auth } from "@/lib/auth/auth";
import { CreateUser } from "@/drizzle/services/Users";

export const SignUpAction = async (
  data: z.infer<typeof signUpSchema>,
): Promise<{ error: boolean; message?: string }> => {
  // 1. Validate
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.message,
    };
  }

  const { name, email, password } = parsed.data;

  try {
    // 2. Create the auth user via Better Auth
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      asResponse: false,
    });

    if (!result?.user?.id) {
      return { error: true, message: "Failed to create account" };
    }

    // 3. Create the user profile row
    await CreateUser(result.user.id);

    return { error: false, message: "Welcome Onboard" };
  } catch (error) {
    // Better Auth throws on duplicate email etc.
    if (error instanceof Error) {
      return { error: true, message: error.message };
    }
    return { error: true, message: "Something went wrong" };
  }
};