import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/signin");
  if (!session.user.completedProfile) redirect("/profile");

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-4xl font-bold">Welcome back, {firstName} 👋</h1>
      <p className="text-muted-foreground">What would you like to do today?</p>

      <nav className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Dashboard
        </Link>
        <Link href="/settings" className="px-4 py-2 border rounded-lg">
          Settings
        </Link>
      </nav>
    </div>
  );
};

export default page;
