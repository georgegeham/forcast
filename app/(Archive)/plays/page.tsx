import { getPlays } from "@/drizzle/services/Plays";
import { Button } from "@/components/ui/button";
import { Plus, Theater } from "lucide-react";
import Link from "next/link";
import PlayCard from "./_components/PlayCard";

const PlaysPage = async () => {
  const plays = await getPlays();

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Plays</h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage all available plays
        </p>
      </div>

      {/* Grid */}
      {plays.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <Theater className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No plays yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {plays.map((play) => (
            <PlayCard key={play.id} play={play} />
          ))}
        </div>
      )}

      {/* Sticky Add Button */}
      <Link href="/plays/create">
        <Button
          size="lg"
          className="fixed bottom-8 right-8 rounded-full shadow-lg gap-2 z-50"
        >
          <Plus className="w-5 h-5" />
          Add Play
        </Button>
      </Link>
    </div>
  );
};

export default PlaysPage;
