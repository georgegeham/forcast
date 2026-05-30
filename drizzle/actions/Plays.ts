"use server";

import { nanoid } from "nanoid";
import {
  createPlay,
  createPlayImages,
  createPlayVideos,
  createPlayTrophies,
  joinCast as joinCastService,
  claimDirector as claimDirectorService,
  claimWriter as claimWriterService,
} from "@/drizzle/services/Plays";
import { uploadPlayImage } from "@/lib/supabase/actions/upload-play-image";
import { revalidatePath } from "next/cache";

export async function createPlayAction(_: unknown, formData: FormData) {
  try {
    const id = nanoid();

    const thumbnailFile = formData.get("thumbnail") as File;

    const imageFiles = formData.getAll("images") as File[];

    let thumbnailUrl = "";

    if (thumbnailFile?.size) {
      thumbnailUrl = await uploadPlayImage(
        thumbnailFile,
        `plays/${id}/thumbnail`,
      );
    }

    const imageUrls: string[] = [];

    for (const image of imageFiles) {
      if (!image.size) continue;

      const url = await uploadPlayImage(image, `plays/${id}/gallery`);

      imageUrls.push(url);
    }

    const createdPlay = await createPlay({
      id,
      name: formData.get("name") as string,
      bio: formData.get("bio") as string,
      writer: formData.get("writer") as string,
      director: formData.get("director") as string,
      playDate: formData.get("playDate") as string,
      photosBucket: formData.get("photosBucket") as string,
      thumbnail: thumbnailUrl,
    });

    const videos = JSON.parse((formData.get("videoLinks") as string) || "[]");

    const trophies = JSON.parse((formData.get("trophies") as string) || "[]");

    await Promise.all([
      createPlayImages(createdPlay.id, imageUrls),
      createPlayVideos(createdPlay.id, videos),
      createPlayTrophies(createdPlay.id, trophies),
    ]);

    return {
      error: false,
      message: "Play created successfully",
    };
  } catch (e) {
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to create play",
    };
  }
}

export async function joinCastAction({
  playId,
  userId,
}: {
  playId: string;
  userId: string;
}): Promise<{ error: boolean; message?: string }> {
  try {
    await joinCastService({ playId, userId });
    revalidatePath(`/plays/${playId}`);
    return {
      error: false,
      message: "Joined cast successfully",
    };
  } catch (e) {
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to join cast",
    };
  }
}

export async function claimDirectorAction({
  playId,
  userId,
}: {
  playId: string;
  userId: string;
}): Promise<{ error: boolean; message?: string }> {
  try {
    await claimDirectorService({ playId, userId });
    revalidatePath(`/plays/${playId}`);
    return {
      error: false,
      message: "Claimed director successfully",
    };
  } catch (e) {
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to claim director",
    };
  }
}

export async function claimWriterAction({
  playId,
  userId,
}: {
  playId: string;
  userId: string;
}): Promise<{ error: boolean; message?: string }> {
  try {
    await claimWriterService({ playId, userId });
    revalidatePath(`/plays/${playId}`);
    return {
      error: false,
      message: "Claimed writer successfully",
    };
  } catch (e) {
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to claim writer",
    };
  }
}
