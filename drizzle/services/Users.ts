import db from "../db";
import { userProfile, play } from "../schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { user } from "../schemas/auth-schema";
import { ProfileSchema } from "../../lib/schemas/Schemas";
import z from "zod";

export async function getUsers() {
  return await db.query.user.findMany({
    with: { profile: true },
  });
}

export const getUserProfile = async (userId: string) => {
  try {
    const profile = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });
    return profile;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
export const CreateUser = async (id: string) => {
  try {
    return await db.insert(userProfile).values({
      id: nanoid(),
      userId: id,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const addUserPic = async (userId: string, picUrl: string) => {
  try {
    await db.update(user).set({ image: picUrl }).where(eq(user.id, userId));
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const updateUserProfile = async (
  userId: string,
  data: Omit<z.infer<typeof ProfileSchema>, "profileImage">,
) => {
  try {
    const { bio, gender, birthday, phone, interviewer } = data;
    await db
      .update(userProfile)
      .set({ bio, gender, birthday, phone, interviewer })
      .where(eq(userProfile.userId, userId));
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const markUserProfileComplete = async (userId: string) => {
  try {
    await db
      .update(user)
      .set({ completedProfile: true })
      .where(eq(user.id, userId));
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export async function deleteUser(userId: string) {
  await db.delete(user).where(eq(user.id, userId));
}

export async function getActorDetails(userId: string) {
  const actor = await db.query.user.findFirst({
    where: eq(user.id, userId),
    with: {
      profile: {
        with: {
          interviewer: true,
          plays: {
            with: {
              play: true,
            },
          },
        },
      },
    },
  });
  if (!actor) return null;

  const joinedPlays = actor.profile?.plays.map((p) => p.play) ?? [];

  const writtenPlays = await db
    .select()
    .from(play)
    .where(eq(play.writer_Id, userId));

  const directedPlays = await db
    .select()
    .from(play)
    .where(eq(play.director_Id, userId));

  return {
    ...actor,
    profile: actor.profile ?? null,
    joinedPlays,
    writtenPlays,
    directedPlays,
  };
}
