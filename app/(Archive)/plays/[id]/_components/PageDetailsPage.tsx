/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  PenLine,
  Clapperboard,
  Trophy,
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Film,
} from "lucide-react";
import { PlayDetails } from "@/drizzle/Types/types";
import {
  joinCastAction,
  claimDirectorAction,
  claimWriterAction,
} from "@/drizzle/actions/Plays";
import { authClient } from "@/lib/auth/client_auth";
import { toast } from "sonner";

/* ─── Helpers ────────────────────────────────────────────────── */

function getInitials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getGoogleDriveEmbedUrl(url: string): string | null {
  const match = url.match(/\/d\/([^/]+)/);
  const fileId = match?.[1];
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
}

/* ─── Lightbox ───────────────────────────────────────────────── */

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: { id: string; imageUrl: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* close */}
      <button
        className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors"
        onClick={onClose}
      >
        <X className="w-7 h-7" />
      </button>

      {/* counter */}
      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-stone-400 text-sm tracking-widest">
        {index + 1} / {images.length}
      </span>

      {/* prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-400 transition-colors"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <ChevronLeft className="w-9 h-9" />
        </button>
      )}

      {/* image */}
      <div
        className="relative max-w-5xl w-full max-h-[85vh] mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index].imageUrl}
          alt="Preview"
          width={1200}
          height={800}
          className="object-contain w-full max-h-[85vh] rounded-lg"
        />
      </div>

      {/* next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-400 transition-colors"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <ChevronRight className="w-9 h-9" />
        </button>
      )}
    </div>
  );
}

/* ─── Action Buttons ─────────────────────────────────────────── */

function PlayActions({ play }: { play: PlayDetails }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session?.data?.user?.id) setUserId(session.data.user.id);
    });
  }, []);

  // Derive already-claimed state from play data once userId is known
  const alreadyInCast =
    !!userId && (play?.users ?? []).some((u) => u.userProfile?.user?.id === userId);
  const alreadyDirector = !!userId && play?.director_Id === userId;
  const alreadyWriter = !!userId && play?.writer_Id === userId;

  const [loading, setLoading] = useState<"cast" | "director" | "writer" | null>(null);

  // Seed done from existing play data so buttons reflect reality on mount
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

  if (!userId) return null;

  const btn =
    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap gap-3">
      {/* Join Cast */}
      <button
        className={`${btn} ${
          done.has("cast")
            ? "bg-amber-400/10 border-amber-400/40 text-amber-400"
            : "bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-400/50 hover:text-amber-400"
        }`}
        disabled={!!loading || done.has("cast")}
        onClick={() =>
          handle("cast", () => joinCastAction({ playId: play!.id, userId }))
        }
      >
        {loading === "cast" ? (
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        {done.has("cast") ? "Joined Cast" : "Join the Cast"}
      </button>

      {/* Claim Director */}
      <button
        className={`${btn} ${
          done.has("director")
            ? "bg-amber-400/10 border-amber-400/40 text-amber-400"
            : "bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-400/50 hover:text-amber-400"
        }`}
        disabled={!!loading || done.has("director") || !!play?.director_Id}
        onClick={() =>
          handle("director", () => claimDirectorAction({ playId: play!.id, userId }))
        }
        title={play?.director_Id ? "Director already claimed" : undefined}
      >
        {loading === "director" ? (
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <Clapperboard className="w-4 h-4" />
        )}
        {done.has("director")
          ? "Directing Claimed"
          : play?.director_Id
          ? "Director Taken"
          : "Claim Directing"}
      </button>

      {/* Claim Writer */}
      <button
        className={`${btn} ${
          done.has("writer")
            ? "bg-amber-400/10 border-amber-400/40 text-amber-400"
            : "bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-400/50 hover:text-amber-400"
        }`}
        disabled={!!loading || done.has("writer") || !!play?.writer_Id}
        onClick={() =>
          handle("writer", () => claimWriterAction({ playId: play!.id, userId }))
        }
        title={play?.writer_Id ? "Writer already claimed" : undefined}
      >
        {loading === "writer" ? (
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <PenLine className="w-4 h-4" />
        )}
        {done.has("writer")
          ? "Writing Claimed"
          : play?.writer_Id
          ? "Writer Taken"
          : "Claim Writing"}
      </button>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function PlayDetailsPage({ play }: { play: PlayDetails }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!play) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0a09]">
        <p className="text-stone-400 text-lg">Play not found.</p>
      </div>
    );
  }

  const actors = play.users?.map((u) => u.userProfile) ?? [];
  const images = play.images ?? [];

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-100">
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative w-full h-[60vh] overflow-hidden">
        {play.thumbnail ? (
          <Image
            src={play.thumbnail}
            alt={play.name}
            fill
            className="object-contain"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-stone-900 via-stone-800 to-stone-900" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#0c0a09] via-[#0c0a09]/50 to-transparent" />
        <div className="absolute left-12 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-amber-400/40 to-transparent hidden lg:block" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-16 md:pb-14">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {play.name}
          </h1>

          {play.playDate && (
            <div className="flex items-center gap-2 mt-4 text-stone-400 text-sm">
              <CalendarDays className="w-4 h-4 text-amber-400" />
              <span>{formatDate(play.playDate)}</span>
            </div>
          )}
        </div>
      </section>

      {/* ─── Main content ─────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 md:px-16 py-12 space-y-16">

        {/* Meta row + action buttons */}
        <div className="flex justify-between gap-5">
          <div className="flex flex-wrap gap-6 text-sm">
            {play.writer && (
              <div className="flex items-center gap-2 text-stone-400">
                <PenLine className="w-4 h-4 text-amber-400/70" />
                <span className="text-stone-500 uppercase tracking-wider text-xs">Written by</span>
                <span className="text-stone-200 font-medium">{play.writer}</span>
              </div>
            )}
            {play.director && (
              <div className="flex items-center gap-2 text-stone-400">
                <Clapperboard className="w-4 h-4 text-amber-400/70" />
                <span className="text-stone-500 uppercase tracking-wider text-xs">Directed by</span>
                <span className="text-stone-200 font-medium">{play.director}</span>
              </div>
            )}
          </div>
          <PlayActions play={play} />
        </div>

        {/* Bio */}
        {play.bio && (
          <section>
            <SectionHeading label="About the Play" />
            <p className="text-stone-300 leading-relaxed text-base md:text-lg max-w-3xl mt-5">
              {play.bio}
            </p>
          </section>
        )}

        {/* ─── Actors Carousel ───────────────────────────────── */}
        {actors.length > 0 && (
          <section>
            <SectionHeading label="Cast" />
            <div className="mt-6 relative">
              <Carousel opts={{ align: "start", loop: true, dragFree: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {actors.map((actor) => {
                    const name =
                      actor?.user?.name ?? actor?.user?.email?.split("@")[0] ?? "Actor";
                    const image = actor?.user?.image;
                    return (
                      <CarouselItem key={actor?.id} className="pl-4 basis-30 md:basis-35 lg:basis-40">
                        <div className="flex flex-col items-center gap-3 group cursor-pointer">
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-amber-400/0 group-hover:bg-amber-400/20 transition-all duration-300 blur-sm" />
                            <Avatar className="w-20 h-20 md:w-24 md:h-24 ring-2 ring-stone-700 group-hover:ring-amber-400/50 transition-all duration-300">
                              <AvatarImage src={image ?? undefined} alt={name} className="object-cover" />
                              <AvatarFallback className="bg-stone-800 text-amber-400 text-lg font-semibold">
                                {getInitials(name)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <p className="text-stone-300 text-xs text-center leading-tight group-hover:text-amber-400 transition-colors duration-200 font-medium max-w-25">
                            {name}
                          </p>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-x-1/2 bg-stone-900/80 border-stone-700 hover:bg-stone-800 hover:border-amber-400/50 text-stone-300 hover:text-amber-400 transition-all" />
                <CarouselNext className="right-0 translate-x-1/2 bg-stone-900/80 border-stone-700 hover:bg-stone-800 hover:border-amber-400/50 text-stone-300 hover:text-amber-400 transition-all" />
              </Carousel>
            </div>
          </section>
        )}

        {/* ─── Trophies ──────────────────────────────────────── */}
        {play.trophies && play.trophies.length > 0 && (
          <section>
            <SectionHeading label="Awards & Recognition" />
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {play.trophies.map((trophy) => (
                <div
                  key={trophy.id}
                  className="bg-stone-900/60 border border-stone-800 rounded-xl p-5 flex gap-4 items-start hover:border-amber-400/30 transition-colors"
                >
                  <Trophy className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-stone-100 font-semibold text-sm">{trophy.title}</p>
                    {trophy.description && (
                      <p className="text-stone-400 text-xs mt-1 leading-relaxed">{trophy.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Images Gallery ────────────────────────────────── */}
        {images.length > 0 && (
          <section>
            <SectionHeading label="Gallery" />
            <div className="mt-5">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-3">
                  {images.map((img, i) => (
                    <CarouselItem key={img.id} className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3">
                      <button
                        className="w-full relative aspect-video rounded-xl overflow-hidden bg-stone-900 ring-1 ring-stone-800 hover:ring-amber-400/50 transition-all group cursor-zoom-in"
                        onClick={() => setLightboxIndex(i)}
                      >
                        <Image
                          src={img.imageUrl}
                          alt="Play photo"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-stone-900/80 border-stone-700 hover:border-amber-400/50 text-stone-300 hover:text-amber-400" />
                <CarouselNext className="right-2 bg-stone-900/80 border-stone-700 hover:border-amber-400/50 text-stone-300 hover:text-amber-400" />
              </Carousel>
            </div>
          </section>
        )}

        {/* ─── Videos ────────────────────────────────────────── */}
        {play.videos && play.videos.length > 0 && (
          <section>
            <SectionHeading label="Videos" />
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {play.videos.map((video) => {
                const embedUrl = getGoogleDriveEmbedUrl(video.url);
                return (
                  <div
                    key={video.id}
                    className="rounded-xl overflow-hidden aspect-video bg-stone-900 ring-1 ring-stone-800"
                  >
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allow="autoplay"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-500 text-sm gap-2">
                        <Film className="w-5 h-5" />
                        <span>Invalid video URL</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <Separator className="bg-stone-800" />

        <p className="text-stone-600 text-xs text-center tracking-widest uppercase pb-8">
          — End of Production Details —
        </p>
      </main>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-amber-400/60 text-xs tracking-[0.25em] uppercase font-light">
        {label}
      </span>
      <div className="flex-1 h-px bg-stone-800" />
    </div>
  );
}