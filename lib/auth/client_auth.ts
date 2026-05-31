import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";
const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
  baseURL: url,
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
