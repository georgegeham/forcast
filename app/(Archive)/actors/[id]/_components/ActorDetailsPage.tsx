"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Mail,
  Phone,
  Cake,
  User as UserIcon,
  Theater,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/app/(Archive)/plays/[id]/_components/UI";

type ActorData = Awaited<
  ReturnType<typeof import("@/drizzle/services/Users").getActorDetails>
>;

export default function ActorDetailsPage({ actor }: { actor: ActorData }) {
  if (!actor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0a09]">
        <p className="text-stone-400 text-lg">Actor not found.</p>
      </div>
    );
  }

  const { profile } = actor;

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-100">
      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative w-full h-[60vh] overflow-hidden">
        {actor.image ? (
          <div className="absolute inset-0 flex justify-center">
            <div className="relative w-[92%] h-full">
              <Image
                src={actor.image}
                alt={actor.name}
                fill
                className="object-cover"
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
            {actor.name}
          </h1>
          <div className="flex items-center gap-2 mt-4 text-stone-400 text-sm">
            <CalendarDays className="w-4 h-4 text-amber-400" />
            <span>
              Joined{" "}
              {new Date(actor.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* ─── Main Content ─────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 md:px-16 py-12 space-y-16">
        {/* ─── Profile Info ──────────────────────────────────── */}
        <section>
          <SectionHeading label="Profile" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile?.bio && (
              <div className="md:col-span-2">
                <p className="text-stone-400 text-sm leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}
            <InfoRow
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value={actor.email}
            />
            {profile?.gender && (
              <InfoRow
                icon={<UserIcon className="w-4 h-4" />}
                label="Gender"
                value={
                  profile.gender.charAt(0).toUpperCase() +
                  profile.gender.slice(1)
                }
              />
            )}
            {profile?.birthday && (
              <InfoRow
                icon={<Cake className="w-4 h-4" />}
                label="Birthday"
                value={new Date(profile.birthday).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            )}
            {profile?.phone && (
              <InfoRow
                icon={<Phone className="w-4 h-4" />}
                label="Phone"
                value={profile.phone}
              />
            )}
            {profile?.interviewer && (
              <InfoRow
                icon={<UserIcon className="w-4 h-4" />}
                label="Interviewer"
                value={profile.interviewer.name}
              />
            )}
          </div>
        </section>

        {/* ─── Joined Plays (Cast) ──────────────────────────── */}
        {actor.joinedPlays.length > 0 && (
          <section>
            <SectionHeading label="Cast" />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {actor.joinedPlays.map((p) => (
                <MiniPlayCard key={p.id} play={p} role="Cast" />
              ))}
            </div>
          </section>
        )}

        {/* ─── Written Plays ────────────────────────────────── */}
        {actor.writtenPlays.length > 0 && (
          <section>
            <SectionHeading label="Written" />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {actor.writtenPlays.map((p) => (
                <MiniPlayCard key={p.id} play={p} role="Writer" />
              ))}
            </div>
          </section>
        )}

        {/* ─── Directed Plays ───────────────────────────────── */}
        {actor.directedPlays.length > 0 && (
          <section>
            <SectionHeading label="Directed" />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {actor.directedPlays.map((p) => (
                <MiniPlayCard key={p.id} play={p} role="Director" />
              ))}
            </div>
          </section>
        )}

        {/* ─── Empty State ───────────────────────────────────── */}
        {actor.joinedPlays.length === 0 &&
          actor.writtenPlays.length === 0 &&
          actor.directedPlays.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
              <Theater className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">
                No plays associated with this actor yet.
              </p>
            </div>
          )}

        <Separator className="bg-stone-800" />
        <p className="text-stone-600 text-xs text-center tracking-widest uppercase pb-8">
          — End of Actor Profile —
        </p>
      </main>
    </div>
  );
}

/* ─── Info Row ─────────────────────────────────────────────────── */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-amber-400/70 shrink-0">{icon}</span>
      <div>
        <span className="text-stone-500 uppercase tracking-wider text-xs block">
          {label}
        </span>
        <span className="text-stone-300">{value}</span>
      </div>
    </div>
  );
}

/* ─── Mini Play Card ───────────────────────────────────────────── */

function MiniPlayCard({
  play,
  role,
}: {
  play: NonNullable<ActorData>["joinedPlays"][number];
  role: string;
}) {
  return (
    <Link href={`/plays/${play.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group overflow-hidden pt-0">
        <div className="relative w-full h-36 bg-muted overflow-hidden">
          {play.thumbnail ? (
            <Image
              src={play.thumbnail}
              alt={play.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Theater className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold line-clamp-1 uppercase flex-1">
              {play.name}
            </h3>
            <Badge variant="outline" className="shrink-0 text-[10px]">
              {role}
            </Badge>
          </div>
          {play.playDate && (
            <p className="text-xs text-muted-foreground">
              {new Date(play.playDate).toLocaleDateString()}
            </p>
          )}
          <p className="text-xs text-muted-foreground group-hover:text-amber-400 transition-colors">
            View details →
          </p>
        </div>
      </Card>
    </Link>
  );
}
