import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Play } from "@/drizzle/Types/types";
import { Theater } from "lucide-react";
import Image from "next/image";

const PlayCard = ({ play }: { play: Play }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group overflow-hidden pt-0">
      {/* Thumbnail */}
      <div className="relative w-full h-44 bg-muted overflow-hidden ">
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
        <CardTitle className="text-base line-clamp-1 uppercase">{play.name}</CardTitle>
      </CardHeader>
      <CardContent className=" space-y-2 grid grid-rows-[auto_auto_1fr] grid-cols-2">
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
    </Card>
  );
};

export default PlayCard;
