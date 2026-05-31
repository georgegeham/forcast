"use server";
import { getCurrentUser } from "@/lib/auth/hooks/getCurrentUserInfo";
import { supabaseAdmin } from "../storage";
import { addUserPic } from "@/drizzle/services/Users";
import { revalidatePath } from "next/cache";

export async function uploadAvatar(
  formData: FormData,
  callbackURL: string,
): Promise<{ error: boolean; message: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");
    const file = formData.get("file") as File;
    const bytes = await file.arrayBuffer();
    const ext = file.type.split("/")[1];
    const path = `${user?.id}/avatar.${ext}`;

    if (user.image) {
      const url = new URL(user.image);

      const pathname = decodeURIComponent(url.pathname);

      const filePath = pathname.split("/public/Profile Pics/")[1];

      if (filePath) {
        const { error } = await supabaseAdmin.storage
          .from("Profile Pics")
          .remove([filePath]);

        if (error) {
          throw new Error(error.message);
        }
      }
    }
    const { error } = await supabaseAdmin.storage
      .from("Profile Pics")
      .upload(path, bytes, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(error.message || "Error uploading avatar");
    }

    const { data } = supabaseAdmin.storage
      .from("Profile Pics")
      .getPublicUrl(path);
    await addUserPic(user.id, data.publicUrl);
    console.log("Avatar uploaded:", data.publicUrl);
    revalidatePath(callbackURL);
    revalidatePath("/actors");
    revalidatePath("/home");
    return { error: false, message: data.publicUrl };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return { error: true, message: "Error uploading avatar" };
  }
}
