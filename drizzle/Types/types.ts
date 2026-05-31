import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  play,
  playComment,
  playFestival,
  playImage,
  playTrophy,
  playVideo,
  userProfile,
} from "../schema";
import { getPlayDetails } from "../services/Plays";
import { getUsers } from "../services/Users";

// Type Selecting User Profile
export type UserProfile = InferSelectModel<typeof userProfile>;

export type UserWithProfile = Awaited<ReturnType<typeof getUsers>>[number];

// Type Inserting User Profile
export type InsertUserProfile = InferInsertModel<typeof userProfile>;

export type Play = InferSelectModel<typeof play>;

export type PlayDetails = Awaited<ReturnType<typeof getPlayDetails>>;

export type Video = InferSelectModel<typeof playVideo>;

export type Image = InferSelectModel<typeof playImage>;

export type Comment = InferSelectModel<typeof playComment>;

export type Trophy = InferSelectModel<typeof playTrophy>;

export type Festival = InferSelectModel<typeof playFestival>;