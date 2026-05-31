import { getActorDetails } from "@/drizzle/services/Users";
import ActorDetailsPage from "./_components/ActorDetailsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actor = await getActorDetails(id);

  return <ActorDetailsPage actor={actor} />;
}
