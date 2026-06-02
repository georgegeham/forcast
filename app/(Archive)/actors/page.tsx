import { getUsers } from "@/drizzle/services/Users";
import { getPlays } from "@/drizzle/services/Plays";
import ActorsGrid from "./_components/ActorsGrid";

const ActorsPage = async () => {
  const [users, plays] = await Promise.all([getUsers(), getPlays()]);

  return <ActorsGrid users={users} plays={plays} />;
};

export default ActorsPage;
