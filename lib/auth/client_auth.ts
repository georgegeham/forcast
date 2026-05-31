import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";
const url =
  process.env.NODE_ENV === "development"
    ? process.env.BETTER_AUTH_URL_DEV!
    : process.env.BETTER_AUTH_URL_PRODUCTION!;
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
  baseURL: url,
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
