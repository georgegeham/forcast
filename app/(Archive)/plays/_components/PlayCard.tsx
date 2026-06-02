"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "@/drizzle/Types/types";
import { Pencil, Theater } from "lucide-react";
import { useSession } from "@/lib/auth/hooks/useSession";
import DeletePlayButton from "./DeletePlayButton";

const PlayCard = ({ play }: { play: Play }) => {
  const router = useRouter();
  const sessionUser = useSession();
  const userRole = sessionUser?.role ?? null;

  return (
    <Card className="h-full hover:shadow-md transition-shadow cursoe-pointer group overflow-hidden pt-0 relative">
      <Link href={`/plays/${play.id}`} className="block">
        <div className="relative w-full h-44 bg-muted overflow-hidden">
          {play.thumbnail ? (
            <Image
              src={play.thumbnail}
              alt={play.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Theater className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
        </div>

        <CardHeader>
          <CardTitle className="text-base line-clamp-1 uppercase pt-2">
            {play.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 grid grid-rows-[auto_auto_1fr] grid-cols-2 p-4 pt-1">
          {play.writer && (
            <p className="text-sm line-clamp-1">Writer: {play.writer}</p>
          )}
          {play.director && (
            <p className="text-sm line-clamp-1">Director: {play.director}</p>
          )}
          {play.playDate && (
            <p className="text-xs text-muted-foreground">
              {new Date(play.playDate).toLocaleDateString()}
            </p>
          )}
        </CardContent>

        <CardFooter className="text-xs text-muted-foreground">
          View details →
        </CardFooter>
      </Link>

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="ghost"
          size="icon-xs"
          className="bg-stone-900/80 hover:bg-stone-800 text-stone-400"
          onClick={() => router.push(`/plays/${play.id}/edit`)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        {userRole === "admin" && <DeletePlayButton play={play} />}
      </div>
    </Card>
  );
};

export default PlayCard;
