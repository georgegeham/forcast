
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { userProfile } from "../schema";

// Type Selecting User Profile
export type UserProfile = InferSelectModel<typeof userProfile>;

// Type Inserting User Profile
export type InsertUserProfile  = InferInsertModel<typeof userProfile>;