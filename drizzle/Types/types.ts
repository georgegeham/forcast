import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { play, userProfile } from "../schema";
import { getPlayDetails } from "../services/Plays";

// Type Selecting User Profile
export type UserProfile = InferSelectModel<typeof userProfile>;

// Type Inserting User Profile
export type InsertUserProfile = InferInsertModel<typeof userProfile>;

export type Play = InferSelectModel<typeof play>;

export type PlayDetails = Awaited<ReturnType<typeof getPlayDetails>>;
