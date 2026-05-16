import { createAuthClient} from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
    plugins: [inferAdditionalFields<typeof auth>()],
    baseURL:"http://localhost:3000" 
})

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;