import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Theater, Clapperboard, PenLine, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getRecentPlays } from "@/drizzle/services/Plays";

const HomePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/signin");
  if (!session.user.completedProfile) redirect("/profile");

  const firstName = session.user.name?.split(" ")[0] ?? "there";
  const recentPlays = await getRecentPlays();
  const isAdmin = (session.user as { role?: string }).role === "admin";

  return (
    <div className="p-6 md:p-10">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening in the archive.
        </p>
        {isAdmin && (
          <span className="inline-block mt-2 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
            Admin
          </span>
        )}
      </div>

      <div>
        <div className="lg:col-span-2 space-y-10">
          {/* Your Cast Plays */}
          {/* {castPlays.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold tracking-tight">
                  Your Productions
                </h2>
                <Link
                  href={`/actors/${userId}`}
                  className="text-xs text-muted-foreground hover:text-amber-400 transition-colors"
                >
                  View profile →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {castPlays.map((p) => (
                  <Link key={p.id} href={`/plays/${p.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow group overflow-hidden pt-0">
                      <div className="relative w-full h-32 bg-muted overflow-hidden">
                        {p.thumbnail ? (
                          <Image
                            src={p.thumbnail}
                            alt={p.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Theater className="w-7 h-7 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm line-clamp-1 uppercase">
                          {p.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )} */}

          {/* Recent Plays */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold tracking-tight">
                Recently Added
              </h2>
              <Link
                href="/plays"
                className="text-xs text-muted-foreground hover:text-amber-400 transition-colors"
              >
                View all →
              </Link>
            </div>
            {recentPlays.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <Theater className="w-10 h-10 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  No plays in the archive yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentPlays.map((p) => (
                  <Link key={p.id} href={`/plays/${p.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow group overflow-hidden pt-0">
                      <div className="relative w-full h-36 bg-muted overflow-hidden">
                        {p.thumbnail ? (
                          <Image
                            src={p.thumbnail}
                            alt={p.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Theater className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm line-clamp-1 uppercase">
                          {p.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1">
                        {p.writer && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <PenLine className="w-3 h-3" />
                            <span>{p.writer}</span>
                          </div>
                        )}
                        {p.director && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clapperboard className="w-3 h-3" />
                            <span>{p.director}</span>
                          </div>
                        )}
                        {p.playDate && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="w-3 h-3" />
                            <span>{formatDate(p.playDate)}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
