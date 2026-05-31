import { getUsers } from "@/drizzle/services/Users";
import { User } from "lucide-react";
import ActorCard from "./_components/ActorCard";

const ActorsPage = async () => {
  const users = await getUsers();

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Actors</h1>
        <p className="text-muted-foreground mt-1">
          Browse all registered actors and performers
        </p>
      </div>

      {/* Grid */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <User className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No actors yet. Users will appear here once registered.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {users.map((user) => (
            <ActorCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActorsPage;
