import {
  pgTable,
  text,
  primaryKey,
  date,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { userProfile } from "./user-profile-schema";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const play = pgTable("play", {
  id: text("id").primaryKey(),

  name: text("name").notNull().unique(),

  bio: text("bio"),

  thumbnail: text("thumbnail"),

  playDate: date("play_date"),

  writer: text("writer"),

  director: text("director"),

  writer_Id: text("writer_id").references(() => user.id, {
    onDelete: "set null",
  }),

  director_Id: text("director_id").references(() => user.id, {
    onDelete: "set null",
  }),

  photosBucket: text("photos_bucket"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const playImage = pgTable(
  "play_image",
  {
    id: text("id").primaryKey(),

    playId: text("play_id")
      .notNull()
      .references(() => play.id, {
        onDelete: "cascade",
      }),

    imageUrl: text("image_url").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("play_image_play_id_idx").on(table.playId)],
);
export const playVideo = pgTable(
  "play_video",
  {
    id: text("id").primaryKey(),

    playId: text("play_id")
      .notNull()
      .references(() => play.id, {
        onDelete: "cascade",
      }),

    url: text("url").notNull(),
  },
  (table) => [index("play_video_play_id_idx").on(table.playId)],
);

export const playTrophy = pgTable(
  "play_trophy",
  {
    id: text("id").primaryKey(),

    playId: text("play_id")
      .notNull()
      .references(() => play.id, {
        onDelete: "cascade",
      }),

    title: text("title").notNull(),

    description: text("description"),
  },
  (table) => [index("play_trophy_play_id_idx").on(table.playId)],
);

export const playFestival = pgTable(
  "play_festival",
  {
    id: text("id").primaryKey(),

    playId: text("play_id")
      .notNull()
      .references(() => play.id, {
        onDelete: "cascade",
      }),

    title: text("name").notNull(),
    location: text("location"),
  },
  (table) => [index("play_festival_play_id_idx").on(table.playId)],
);

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
    index("user_profile_play_play_id_idx").on(table.playId),
  ],
);

export const playComment = pgTable(
  "play_comment",
  {
    id: text("id").primaryKey(),

    playId: text("play_id")
      .notNull()
      .references(() => play.id, {
        onDelete: "cascade",
      }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    content: text("content").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("play_comment_play_id_idx").on(table.playId)],
);

export const playRelations = relations(play, ({ many }) => ({
  users: many(userProfilePlay),

  images: many(playImage),

  videos: many(playVideo),

  trophies: many(playTrophy),

  festivals: many(playFestival),

  comments: many(playComment),
}));

export const userProfilePlayRelations = relations(
  userProfilePlay,
  ({ one }) => ({
    userProfile: one(userProfile, {
      fields: [userProfilePlay.userProfileId],
      references: [userProfile.id],
    }),
    play: one(play, {
      fields: [userProfilePlay.playId],
      references: [play.id],
    }),
  }),
);

export const playImageRelations = relations(playImage, ({ one }) => ({
  play: one(play, {
    fields: [playImage.playId],
    references: [play.id],
  }),
}));

export const playVideoRelations = relations(playVideo, ({ one }) => ({
  play: one(play, {
    fields: [playVideo.playId],
    references: [play.id],
  }),
}));

export const playTrophyRelations = relations(playTrophy, ({ one }) => ({
  play: one(play, {
    fields: [playTrophy.playId],
    references: [play.id],
  }),
}));

export const playCommentRelations = relations(playComment, ({ one }) => ({
  play: one(play, {
    fields: [playComment.playId],
    references: [play.id],
  }),
  user: one(user, {
    fields: [playComment.userId],
    references: [user.id],
  }),
}));

export const playFestivalRelations = relations(playFestival, ({ one }) => ({
  play: one(play, {
    fields: [playFestival.playId],
    references: [play.id],
  }),
}));
