import { getPlayDetails } from "@/drizzle/services/Plays";
import EditPlayPage from "./EditPlayPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const play = await getPlayDetails(id);

  return <EditPlayPage play={play} />;
}
