import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if(!session) redirect("/signin");

  if(!session.user.completedProfile) redirect("/profile");

  return <div>Hello World</div>;
};

export default page;
