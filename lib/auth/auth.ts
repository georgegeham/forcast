import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/drizzle/db";
export const auth = betterAuth({
  // user model
  user: {
    additionalFields: {
      completedProfile: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
  // Options
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },

  // DataBase Config
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
