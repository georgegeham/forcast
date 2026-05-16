import { pgTable, text, timestamp, date, integer } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";
import { userProfilePlay } from "./play-schema";

export const userProfile = pgTable("user_profile", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  bio: text("bio"),

  gender: text("gender", {
    enum: ["male", "female"],
  }),

  birthday: date("birthday"),

  age: integer("age"),

  phone: text("phone"),

  interviewer: text("interviewer_id").references(() => user.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userProfileRelations = relations(userProfile, ({ one, many }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
    relationName: "profile_user",
  }),
  interviewer: one(user, {
    fields: [userProfile.interviewer],
    references: [user.id],
    relationName: "profile_interviewer",
  }),
  plays: many(userProfilePlay),
}));
