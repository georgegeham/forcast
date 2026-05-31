"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  CalendarDays,
  PenLine,
  Clapperboard,
  Trophy,
  Film,
  MapPin,
  Plus,
  MessageSquare,
  Send,
  Trash2,
} from "lucide-react";
import type {
  Festival,
  PlayDetails,
  Trophy as PlayTrophy,
  Video,
  Comment,
} from "@/drizzle/Types/types";
import { authClient } from "@/lib/auth/client_auth";

import { Textarea } from "@/components/ui/textarea";
import { SectionHeading, Lightbox } from "./UI";
import { PlayActions } from "./Playactions";
import { addPlayComment, deletePlayAction } from "@/drizzle/actions/Plays";
import { toast } from "sonner";
import {
  AddPhotosModal,
  AddVideoModal,
  AddTrophyModal,
  AddFestivalModal,
} from "./Modals";
import {
  getInitials,
  formatDate,
  getGoogleDriveEmbedUrl,
  getYouTubeEmbedUrl,
  addBtnClass,
} from "@/lib/utils";

type ModalType = "photos" | "video" | "trophy" | "festival" | null;

export default function PlayDetailsPage({ play }: { play: PlayDetails }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);

  const localImages = play?.images ?? [];
  const [localVideos, setLocalVideos] = useState<Video[]>(play?.videos ?? []);
  const [localTrophies, setLocalTrophies] = useState<PlayTrophy[]>(
    play?.trophies ?? [],
  );
  const [localFestivals, setLocalFestivals] = useState<Festival[]>(
    (play as PlayDetails & { festivals?: Festival[] })?.festivals ?? [],
  );
  const [localComments, setLocalComments] = useState<
    (Comment & {
      user: { id: string; name: string | null; image: string | null } | null;
    })[]
  >((play as PlayDetails & { comments?: Comment[] })?.comments ?? []);
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const [showCommentBtn, setShowCommentBtn] = useState(true);

  useEffect(() => {
    const el = commentSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowCommentBtn(!entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    authClient.getSession().then((session) => {
      const user = session?.data?.user;
      if (user?.id) {
        setUserId(user.id);
        setUserName(user.name ?? null);
        setUserImage(user.image ?? null);
        setUserRole((user as { role?: string }).role ?? null);
      }
    });
  }, []);

  if (!play) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0a09]">
        <p className="text-stone-400 text-lg">Play not found.</p>
      </div>
    );
  }

  const actors = play.users?.map((u) => u.userProfile) ?? [];

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-100">
      {/* ─── Modals ───────────────────────────────────────────── */}
      {modal === "photos" && (
        <AddPhotosModal
          playId={play.id}
          onClose={() => setModal(null)}
          onAdded={() => setModal(null)}
        />
      )}
      {modal === "video" && (
        <AddVideoModal
          playId={play.id}
          onClose={() => setModal(null)}
          onAdded={(v) =>
            setLocalVideos((prev) => [...prev, { ...v, playId: play.id }])
          }
        />
      )}
      {modal === "trophy" && (
        <AddTrophyModal
          playId={play.id}
          onClose={() => setModal(null)}
          onAdded={(t) =>
            setLocalTrophies((prev) => [
              ...prev,
              { ...t, playId: play.id, description: t.description ?? null },
            ])
          }
        />
      )}
      {modal === "festival" && (
        <AddFestivalModal
          playId={play.id}
          onClose={() => setModal(null)}
          onAdded={(f: Festival) => setLocalFestivals((prev) => [...prev, f])}
        />
      )}

      {/* ─── Lightbox ─────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={localImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative w-full h-[60vh] overflow-hidden">
        {play.thumbnail ? (
          <div className="absolute inset-0 flex justify-center">
            <div className="relative w-[92%] h-full">
              <Image
                src={play.thumbnail}
                alt={play.name}
                fill
                className="object-cover w-[80%]"
                priority
              />
            </div>
          </div>
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

      {/* ─── Main Content ─────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 md:px-16 py-12 space-y-16">
        {/* Meta row + action buttons */}
        <div className="flex flex-wrap justify-between gap-5">
          <div className="flex flex-wrap gap-6 text-sm">
            {play.writer && (
              <div className="flex items-center gap-2 text-stone-400">
                <PenLine className="w-4 h-4 text-amber-400/70" />
                <span className="text-stone-500 uppercase tracking-wider text-xs">
                  Written by
                </span>
                <span className="text-stone-200 font-medium">
                  {play.writer}
                </span>
              </div>
            )}
            {play.director && (
              <div className="flex items-center gap-2 text-stone-400">
                <Clapperboard className="w-4 h-4 text-amber-400/70" />
                <span className="text-stone-500 uppercase tracking-wider text-xs">
                  Directed by
                </span>
                <span className="text-stone-200 font-medium">
                  {play.director}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <PlayActions play={play} />
            {userRole === "admin" && (
              <button
                onClick={async () => {
                  if (!confirm("Delete this play permanently?")) return;
                  const result = await deletePlayAction(play.id);
                  if (result?.error) {
                    toast.error(result.message ?? "Failed to delete");
                  } else {
                    window.location.href = "/plays";
                  }
                }}
                className="text-stone-500 hover:text-red-400 transition-colors"
                title="Delete play"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
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

        {/* ─── Cast ─────────────────────────────────────────── */}
        {actors.length > 0 && (
          <section>
            <SectionHeading label="Cast" />
            <div className="mt-6 relative">
              <Carousel
                opts={{ align: "start", loop: true, dragFree: true }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {actors.map((actor) => {
                    const userId = actor?.user?.id;
                    const name =
                      actor?.user?.name ??
                      actor?.user?.email?.split("@")[0] ??
                      "Actor";
                    const image = actor?.user?.image;
                    const isWriter = userId && play.writer_Id === userId;
                    const isDirector = userId && play.director_Id === userId;
                    return (
                      <CarouselItem
                        key={actor?.id}
                        className="pl-4 basis-30 md:basis-35 lg:basis-40"
                      >
                        <Link
                          href={`/actors/${userId}`}
                          className="flex flex-col items-center gap-3 group cursor-pointer"
                        >
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-amber-400/0 group-hover:bg-amber-400/20 transition-all duration-300 blur-sm" />
                            <Avatar className="w-20 h-20 md:w-24 md:h-24 ring-2 ring-stone-700 group-hover:ring-amber-400/50 transition-all duration-300">
                              <AvatarImage
                                src={image ?? undefined}
                                alt={name}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-stone-800 text-amber-400 text-lg font-semibold">
                                {getInitials(name)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <p className="text-stone-300 text-xs text-center leading-tight group-hover:text-amber-400 transition-colors duration-200 font-medium max-w-25">
                            {name}
                          </p>
                          {(isWriter || isDirector) && (
                            <div className="flex gap-1 -mt-1.5">
                              {isWriter && (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1.5 py-0 h-4 border-amber-400/40 text-amber-400/80"
                                >
                                  Writer
                                </Badge>
                              )}
                              {isDirector && (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1.5 py-0 h-4 border-amber-400/40 text-amber-400/80"
                                >
                                  Director
                                </Badge>
                              )}
                            </div>
                          )}
                        </Link>
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

        {/* ─── Festivals ────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-5">
            <SectionHeading label="Festivals" />
            {userId && (
              <button
                className={addBtnClass}
                onClick={() => setModal("festival")}
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            )}
          </div>
          {localFestivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localFestivals.map((festival) => (
                <div
                  key={festival.id}
                  className="bg-stone-900/60 border border-stone-800 rounded-xl p-5 flex gap-4 items-start hover:border-amber-400/30 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-stone-100 font-semibold text-sm">
                      {festival.title}
                    </p>
                    {festival.location && (
                      <p className="text-stone-400 text-xs mt-1">
                        {festival.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-600 text-sm mt-2">
              No festivals added yet.
            </p>
          )}
        </section>

        {/* ─── Awards ───────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-5">
            <SectionHeading label="Awards & Recognition" />
            {userId && (
              <button
                className={addBtnClass}
                onClick={() => setModal("trophy")}
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            )}
          </div>
          {localTrophies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localTrophies.map((trophy) => (
                <div
                  key={trophy.id}
                  className="bg-stone-900/60 border border-stone-800 rounded-xl p-5 flex gap-4 items-start hover:border-amber-400/30 transition-colors"
                >
                  <Trophy className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-stone-100 font-semibold text-sm">
                      {trophy.title}
                    </p>
                    {trophy.description && (
                      <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                        {trophy.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-600 text-sm mt-2">No awards added yet.</p>
          )}
        </section>

        {/* ─── Gallery ──────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-5">
            <SectionHeading label="Gallery" />
            {userId && (
              <button
                className={addBtnClass}
                onClick={() => setModal("photos")}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Photos
              </button>
            )}
          </div>
          {localImages.length > 0 ? (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-3">
                {localImages.map((img, i) => (
                  <CarouselItem
                    key={img.id}
                    className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
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
          ) : (
            <p className="text-stone-600 text-sm mt-2">No photos yet.</p>
          )}
        </section>

        {/* ─── Videos ───────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-5">
            <SectionHeading label="Videos" />
            {userId && (
              <button className={addBtnClass} onClick={() => setModal("video")}>
                <Plus className="w-3.5 h-3.5" />
                Add Video
              </button>
            )}
          </div>
          {localVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {localVideos.map((video) => {
                const embedUrl =
                  getGoogleDriveEmbedUrl(video.url) ??
                  getYouTubeEmbedUrl(video.url);
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
          ) : (
            <p className="text-stone-600 text-sm mt-2">No videos yet.</p>
          )}
        </section>

        {/* ─── Comments ─────────────────────────────────────── */}
        <section ref={commentSectionRef}>
          <SectionHeading label="Comments" />
          <div className="mt-6 space-y-6">
            {localComments.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8">
                <MessageSquare className="w-8 h-8 text-stone-600" />
                <p className="text-stone-500 text-sm">No comments yet.</p>
              </div>
            ) : (
              <div className="h-60 overflow-y-scroll scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-stone-900">
                <div className="flex flex-col-reverse ">
                  {localComments.map((comment) => {
                    const authorName = comment.user?.name ?? "Unknown";
                    const authorImage = comment.user?.image;
                    return (
                      <div key={comment.id} className="flex gap-3 mt-2">
                        <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                          <AvatarImage
                            src={authorImage ?? undefined}
                            alt={authorName}
                          />
                          <AvatarFallback className="bg-stone-800 text-stone-400 text-xs">
                            {getInitials(authorName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-stone-200 text-sm font-medium">
                              {authorName}
                            </span>
                            <span className="text-stone-600 text-xs">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <p className="text-stone-400 text-sm mt-1 leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {userId && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newComment.trim() || submitting) return;
                  setSubmitting(true);
                  try {
                    const result = await addPlayComment({
                      playId: play.id,
                      userId,
                      content: newComment.trim(),
                    });
                    if (result?.error) throw new Error(result.message);
                    setLocalComments((prev) => [
                      {
                        id: crypto.randomUUID(),
                        playId: play.id,
                        userId,
                        content: newComment.trim(),
                        createdAt: new Date(),
                        user: {
                          id: userId,
                          name: userName,
                          image: userImage,
                        },
                      },
                      ...prev,
                    ]);
                    setNewComment("");
                    textareaRef.current?.focus();
                  } catch (e) {
                    toast.error(
                      e instanceof Error ? e.message : "Failed to add comment",
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="flex gap-3 items-start pt-3 border-t border-stone-800"
              >
                <Avatar className="w-8 h-8 shrink-0 mt-1">
                  <AvatarImage
                    src={userImage ?? undefined}
                    alt={userName ?? "You"}
                  />
                  <AvatarFallback className="bg-stone-800 text-stone-400 text-xs">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={1}
                    className="min-h-0 resize-none bg-stone-900 border-stone-700 text-stone-200 placeholder:text-stone-600 text-sm focus-visible:ring-amber-400/50 focus-visible:border-amber-400/50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const form = e.currentTarget.closest("form");
                        form?.requestSubmit();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="shrink-0 mt-1.5 text-stone-400 hover:text-amber-400 disabled:text-stone-700 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <Separator className="bg-stone-800" />
        <p className="text-stone-600 text-xs text-center tracking-widest uppercase pb-8">
          — End of Production Details —
        </p>
      </main>

      {/* ─── Comment FAB ──────────────────────────────────────── */}
      {userId && showCommentBtn && (
        <button
          onClick={() =>
            commentSectionRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          className="fixed bottom-8 right-8 z-50 bg-amber-400 text-stone-950 rounded-full p-3.5 shadow-lg hover:bg-amber-300 transition-all"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
