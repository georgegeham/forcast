import { getPlays } from "@/drizzle/services/Plays";
import PlaysGrid from "./_components/PlaysGrid";

const PlaysPage = async () => {
  const plays = await getPlays();

  return <PlaysGrid plays={plays} />;
};

export default PlaysPage;
