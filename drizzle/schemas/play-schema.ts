import { pgTable, text, primaryKey} from "drizzle-orm/pg-core";
import { userProfile } from "./user-profile-schema";
import { relations } from "drizzle-orm";


export const play = pgTable("play", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  thumbnail: text("thumbnail"),
});

export const userProfilePlay = pgTable(
  "user_profile_play",
  {
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, {
        onDelete: "cascade",
      }),

    playId: text("play_id")
      .notNull()
      .references(() => play.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [
    primaryKey({
      columns: [table.userProfileId, table.playId],
    }),
  ],
);

export const playRelations = relations(play, ({many}) => ({
    users: many(userProfilePlay)
}))

export const userProfilePlayRelations = relations(userProfilePlay, ({ one }) => ({
  userProfile: one(userProfile, {
    fields: [userProfilePlay.userProfileId],
    references: [userProfile.id],
  }),
  play: one(play, {
    fields: [userProfilePlay.playId],
    references: [play.id],
  }),
}));