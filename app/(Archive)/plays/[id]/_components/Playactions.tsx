"use client";

import { useEffect, useState } from "react";
import { UserPlus, Clapperboard, PenLine } from "lucide-react";
import { toast } from "sonner";
import {
  joinCastAction,
  claimDirectorAction,
  claimWriterAction,
  unjoinCastAction,
  unclaimDirectorAction,
  unclaimWriterAction,
} from "@/drizzle/actions/Plays";
import { useSession } from "@/lib/auth/hooks/useSession";
import { PlayDetails } from "@/drizzle/Types/types";

const btn =
  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

export function PlayActions({ play }: { play: PlayDetails }) {
  const sessionUser = useSession();
  const userId = sessionUser?.id ?? null;

  const alreadyInCast =
    !!userId && (play?.users ?? []).some((u) => u.userProfile?.user?.id === userId);
  const alreadyDirector = !!userId && play?.director_Id === userId;
  const alreadyWriter = !!userId && play?.writer_Id === userId;

  const [loading, setLoading] = useState<"cast" | "director" | "writer" | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    setDone((prev) => {
      const next = new Set(prev);
      if (alreadyInCast) next.add("cast");
      if (alreadyDirector) next.add("director");
      if (alreadyWriter) next.add("writer");
      return next;
    });
  }, [userId, alreadyInCast, alreadyDirector, alreadyWriter]);

  async function handle(
    type: "cast" | "director" | "writer",
    action: () => Promise<{ error: boolean; message?: string }>,
  ) {
    if (!userId || done.has(type)) return;
    setLoading(type);
    try {
      const result = await action();
      if (result.error) throw new Error(result.message);
      toast.success(result.message || "Action performed successfully");
      setDone((prev) => new Set(prev).add(type));
    } catch (e) {
      if (e instanceof Error) toast.error(e.message || "Failed to perform action");
    } finally {
      setLoading(null);
    }
  }

  async function handleUnclaim(
    type: "cast" | "director" | "writer",
    action: () => Promise<{ error: boolean; message?: string }>,
  ) {
    if (!userId || !done.has(type)) return;
    setLoading(type);
    try {
      const result = await action();
      if (result.error) throw new Error(result.message);
      toast.success(result.message || "Action performed successfully");
      setDone((prev) => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });
    } catch (e) {
      if (e instanceof Error) toast.error(e.message || "Failed to perform action");
    } finally {
      setLoading(null);
    }
  }

  if (!userId) return null;

  // Hidden entirely when another user already holds the role
  const directorTaken = !!play?.director_Id && !alreadyDirector && !done.has("director");
  const writerTaken = !!play?.writer_Id && !alreadyWriter && !done.has("writer");

  return (
    <div className="flex flex-wrap gap-3">
      {/* Join / Leave Cast */}
      <button
        className={`${btn} ${
          done.has("cast")
            ? "bg-amber-400/10 border-amber-400/40 text-amber-400 hover:border-red-400/50 hover:text-red-400"
            : "bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-400/50 hover:text-amber-400"
        }`}
        disabled={!!loading}
        onClick={() =>
          done.has("cast")
            ? handleUnclaim("cast", () => unjoinCastAction({ playId: play!.id, userId }))
            : handle("cast", () => joinCastAction({ playId: play!.id, userId }))
        }
      >
        {loading === "cast" ? (
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        {done.has("cast") ? "Leave Cast" : "Join the Cast"}
      </button>

      {/* Claim / Unclaim Director — hidden when taken by someone else */}
      {(!directorTaken || done.has("director")) && (
        <button
          className={`${btn} ${
            done.has("director")
              ? "bg-amber-400/10 border-amber-400/40 text-amber-400 hover:border-red-400/50 hover:text-red-400"
              : "bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-400/50 hover:text-amber-400"
          }`}
          disabled={!!loading}
          onClick={() =>
            done.has("director")
              ? handleUnclaim("director", () => unclaimDirectorAction({ playId: play!.id, userId }))
              : handle("director", () => claimDirectorAction({ playId: play!.id, userId }))
          }
        >
          {loading === "director" ? (
            <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <Clapperboard className="w-4 h-4" />
          )}
          {done.has("director") ? "Unclaim Directing" : "Claim Directing"}
        </button>
      )}

      {/* Claim / Unclaim Writer — hidden when taken by someone else */}
      {(!writerTaken || done.has("writer")) && (
        <button
          className={`${btn} ${
            done.has("writer")
              ? "bg-amber-400/10 border-amber-400/40 text-amber-400 hover:border-red-400/50 hover:text-red-400"
              : "bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-400/50 hover:text-amber-400"
          }`}
          disabled={!!loading}
          onClick={() =>
            done.has("writer")
              ? handleUnclaim("writer", () => unclaimWriterAction({ playId: play!.id, userId }))
              : handle("writer", () => claimWriterAction({ playId: play!.id, userId }))
          }
        >
          {loading === "writer" ? (
            <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <PenLine className="w-4 h-4" />
          )}
          {done.has("writer") ? "Unclaim Writing" : "Claim Writing"}
        </button>
      )}
    </div>
  );
}