import { getPlayDetails } from "@/drizzle/services/Plays";
import PlayDetailsPage from "./_components/PageDetailsPage";


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const play = await getPlayDetails(id);

  return <PlayDetailsPage play={play} />;
}
