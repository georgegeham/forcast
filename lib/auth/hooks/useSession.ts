import { useEffect, useState } from "react";
import { authClient } from "../client_auth";

let sessionPromise: Promise<{ id: string; role: string; name: string; image: string | null } | null> | null = null;

export function useSession() {
  const [user, setUser] = useState<{ id: string; role: string; name: string; image: string | null } | null>(null);

  useEffect(() => {
    if (!sessionPromise) {
      sessionPromise = authClient
        .getSession()
        .then((s) => {
          const u = s?.data?.user as { id: string; role: string; name: string; image: string | null } | undefined;
          return u ?? null;
        });
    }
    sessionPromise.then(setUser);
  }, []);

  return user;
}
