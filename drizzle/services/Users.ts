import db from "../db";
import { userProfile } from "../schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { user } from "../schemas/auth-schema";
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
