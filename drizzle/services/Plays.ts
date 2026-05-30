import db from "@/drizzle/db";
import {
  play,
  playImage,
  playVideo,
  playTrophy,
  userProfilePlay,
} from "@/drizzle/schemas/play-schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getUserProfile } from "./Users";

export async function getPlays() {
  return await db.select().from(play);
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

export async function getPlayDetails(playId: string) {
  const result = await db.query.play.findFirst({
    where: (play, { eq }) => eq(play.id, playId),
    with: {
      images: true,
      videos: true,
      trophies: true,
      users: {
        with: {
          userProfile: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  });
  return result;
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
  try{
    const user = await getUserProfile(userId);
    if (!user) throw new Error("User profile not found");
  await db.update(play).set({ writer_Id: userId, writer: user.name }).where(eq(play.id, playId));
  }catch(e){
    console.log(e);
    throw e;
  }
}
