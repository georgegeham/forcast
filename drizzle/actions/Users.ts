"use server";

import { ProfileSchema } from "@/lib/schemas/Schemas";
import {
  getUserProfile,
  updateUserProfile as updateUserProfileService,
  markUserProfileComplete,
  deleteUser,
  CreateUser,
} from "@/services/Users";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";
import z from "zod";

export const createUserProfile = async (
  userId: string,
  data: z.infer<typeof ProfileSchema>,
): Promise<{ error: boolean; message?: string }> => {
  try {
    await CreateUser(userId);
    await updateUserProfileService(userId, data);
    const user = await getUserProfile(userId);
    if (!user?.completedProfile) {
      await markUserProfileComplete(userId);
    }
    return { error: false, message: "Profile created successfully" };
  } catch (e) {
    console.log(e);
    return { error: true, message: "Failed to create profile" };
  }
};
export const updateUserProfile = async (
  userId: string,
  data: Omit<z.infer<typeof ProfileSchema>, "profileImage">,
): Promise<{ error: boolean; message?: string }> => {
  try {
    await updateUserProfileService(userId, data);
    const user = await getUserProfile(userId);
    if (!user?.completedProfile) {
      await markUserProfileComplete(userId);
    }
    return { error: false, message: "Profile updated successfully" };
  } catch (e) {
    console.log(e);
    return { error: true, message: "Failed to update profile" };
  }
};

export async function deleteUserAction(
  userId: string,
): Promise<{ error: boolean; message?: string }> {
  try {
    await requireAdmin();
    await deleteUser(userId);
    revalidatePath("/actors");
    return { error: false, message: "User deleted" };
  } catch (e) {
    console.log(e);
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to delete user",
    };
  }
}
