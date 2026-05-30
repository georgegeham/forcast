import { supabaseAdmin } from "@/lib/supabase/storage";
import { nanoid } from "nanoid";

export async function uploadPlayImage(file: File, folder: string) {
  const extension = file.name.split(".").pop();

  const path = `${folder}/${nanoid()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from("plays")
    .upload(path, file, {
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage.from("plays").getPublicUrl(path);
  return data.publicUrl;
}
