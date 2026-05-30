"use server";

import { ProfileSchema } from "@/lib/schemas/Schemas";
import {
  getUserProfile,
  updateUserProfile as updateUserProfileService,
  markUserProfileComplete,
} from "@/services/Users";
import z from "zod";

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
