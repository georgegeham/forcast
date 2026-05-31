import db from "@/drizzle/db";
import {
  play,
  playImage,
  playVideo,
  playTrophy,
  userProfilePlay,
  playFestival,
  playComment,
} from "@/drizzle/schemas/play-schema";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getUserProfile } from "./Users";

export async function getPlays() {
  return await db.select().from(play);
}

export async function getRecentPlays() {
  return await db.select().from(play).orderBy(desc(play.createdAt)).limit(6);
}
export async function createPlay(data: typeof play.$inferInsert) {
  const [createdPlay] = await db.insert(play).values(data).returning();
  return createdPlay;
}

export async function createPlayImages(playId: string, images: string[]) {
  if (!images.length) return;
  await db.insert(playImage).values(
    images.map((image) => ({
      playId,
      imageUrl: image,
      id: nanoid(),
    })),
  );
}

export async function createPlayVideos(playId: string, videos: string[]) {
  if (!videos.length) return;
  await db.insert(playVideo).values(
    videos.map((url) => ({
      playId,
      url,
      id: nanoid(),
    })),
  );
}

export async function createPlayTrophies(
  playId: string,
  trophies: {
    title: string;
    description?: string;
  }[],
) {
  if (!trophies.length) return;
  await db.insert(playTrophy).values(
    trophies.map((trophy) => ({
      playId,
      title: trophy.title,
      description: trophy.description,
      id: nanoid(),
    })),
  );
}

export async function createPlayFestival(
  playId: string,
  festivals: { title: string; location?: string | null }[],
) {
  if (!festivals.length) return;
  await db.insert(playFestival).values(
    festivals.map((festival) => ({
      playId,
      title: festival.title,
      location: festival.location,
      id: nanoid(),
    })),
  );
}

export async function getPlayDetails(playId: string) {
  const result = await db.query.play.findFirst({
    where: (play, { eq }) => eq(play.id, playId),
    with: {
      images: true,
      videos: true,
      trophies: true,
      festivals: true,
      users: {
        with: {
          userProfile: {
            with: {
              user: true,
            },
          },
        },
      },
      comments: {
        with: {
          user: true,
        },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
  });
  return result;
}

export async function updatePlay(id: string, data: Partial<typeof play.$inferInsert>) {
  const [updated] = await db
    .update(play)
    .set(data)
    .where(eq(play.id, id))
    .returning();
  return updated;
}

export async function deletePlayVideos(playId: string) {
  await db.delete(playVideo).where(eq(playVideo.playId, playId));
}

export async function deletePlayTrophies(playId: string) {
  await db.delete(playTrophy).where(eq(playTrophy.playId, playId));
}

export async function deletePlayFestivals(playId: string) {
  await db.delete(playFestival).where(eq(playFestival.playId, playId));
}

export async function createPlayComment({
  playId,
  userId,
  content,
}: {
  playId: string;
  userId: string;
  content: string;
}) {
  const [comment] = await db
    .insert(playComment)
    .values({ id: nanoid(), playId, userId, content })
    .returning();
  return comment;
}

export async function deletePlay(playId: string) {
  await db.delete(play).where(eq(play.id, playId));
}

export async function joinCast({
  playId,
  userId,
}: {
  playId: string;
  userId: string;
}) {
  const profile = await db.query.userProfile.findFirst({
    where: (p, { eq }) => eq(p.userId, userId),
  });
  if (!profile) throw new Error("User profile not found");
  await db
    .insert(userProfilePlay)
    .values({ userProfileId: profile.id, playId });
}

export async function claimDirector({
  playId,
  userId,
}: {
  playId: string;
  userId: string;
}) {
  try {
    const user = await getUserProfile(userId);
    if (!user) throw new Error("User profile not found");
    await db
      .update(play)
      .set({ director_Id: userId, director: user.name })
      .where(eq(play.id, playId));
    await joinCast({ playId, userId }).catch(() => {});
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function claimWriter({
  playId,
  userId,
}: {
  playId: string;
  userId: string;
}) {
  try {
    const user = await getUserProfile(userId);
    if (!user) throw new Error("User profile not found");
    await db
      .update(play)
      .set({ writer_Id: userId, writer: user.name })
      .where(eq(play.id, playId));
    await joinCast({ playId, userId }).catch(() => {});
  } catch (e) {
    console.log(e);
    throw e;
  }
}
