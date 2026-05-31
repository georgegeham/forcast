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
  createPlayFestival,
  createPlayComment,
  deletePlay as deletePlayService,
} from "@/drizzle/services/Plays";
import { uploadPlayImage } from "@/lib/supabase/actions/upload-play-image";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";

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

    const festival = JSON.parse((formData.get("festivals") as string) || "[]");
    await Promise.all([
      createPlayImages(createdPlay.id, imageUrls),
      createPlayVideos(createdPlay.id, videos),
      createPlayTrophies(createdPlay.id, trophies),
      createPlayFestival(createdPlay.id, festival),
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

export async function addPlayImage({
  playId,
  files,
}: {
  playId: string;
  files: FormData;
}): Promise<{ error: boolean; message?: string }> {
  try {
    const images = files.getAll("images") as File[];
    const imagesURLs = [];
    for (const image of images) {
      const url = await uploadPlayImage(image, `plays/${playId}/gallery`);
      imagesURLs.push(url);
    }
    await createPlayImages(playId, imagesURLs);
    revalidatePath(`/plays/${playId}`);
    return {
      error: false,
      message: "Photos added successfully",
    };
  } catch (e) {
    console.log(e);
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to add photos",
    };
  }
}

export async function addPlayVideo({
  playId,
  url,
}: {
  playId: string;
  url: string;
}): Promise<{ error: boolean; message?: string }> {
  try {
    await createPlayVideos(playId, [url]);
    revalidatePath(`/plays/${playId}`);
    return {
      error: false,
      message: "Video added successfully",
    };
  } catch (e) {
    console.log(e);
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to add video",
    };
  }
}

export async function addPlayTrophy({
  playId,
  trophy,
}: {
  playId: string;
  trophy: {
    title: string;
    description?: string;
  };
}): Promise<{ error: boolean; message?: string }> {
  try {
    await createPlayTrophies(playId, [trophy]);
    revalidatePath(`/plays/${playId}`);
    return {
      error: false,
      message: "Trophy added successfully",
    };
  } catch (e) {
    console.log(e);
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to add trophy",
    };
  }
}

export async function addPlayFestival({
  playId,
  festival,
}: {
  playId: string;
  festival: {
    title: string;
    location?: string | null;
  };
}): Promise<{ error: boolean; message?: string }> {
  try {
    await createPlayFestival(playId, [festival]);
    revalidatePath(`/plays/${playId}`);
    return {
      error: false,
      message: "Festival added successfully",
    };
  } catch (e) {
    console.log(e);
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to add festival",
    };
  }
}

export async function addPlayComment({
  playId,
  userId,
  content,
}: {
  playId: string;
  userId: string;
  content: string;
}): Promise<{ error: boolean; message?: string }> {
  try {
    await createPlayComment({ playId, userId, content });
    revalidatePath(`/plays/${playId}`);
    return { error: false, message: "Comment added" };
  } catch (e) {
    console.log(e);
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to add comment",
    };
  }
}

export async function deletePlayAction(
  playId: string,
): Promise<{ error: boolean; message?: string }> {
  try {
    await requireAdmin();
    await deletePlayService(playId);
    revalidatePath("/plays");
    return { error: false, message: "Play deleted" };
  } catch (e) {
    console.log(e);
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to delete play",
    };
  }
}
