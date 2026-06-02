import { auth } from "@/lib/auth/auth"
import Navbar from "./_components/Navbar"
import SlideNav from "./_components/SlideNav"
import { headers } from "next/headers"
import { redirect } from "next/navigation";

const ArchiveLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");
  return (
    <main className="min-h-screen w-full">
      <SlideNav>
        <Navbar />
      </SlideNav>
      <div className="h-nav" />
      <section className="container mx-auto min-h-with-nav px-4 overflow-hidden">
        {children}
      </section>
    </main>
  );
};

export default ArchiveLayout 