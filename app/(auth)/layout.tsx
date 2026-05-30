import { getCurrentUser } from "@/lib/auth/hooks/getCurrentUserInfo";
import AuthTabs from "./_components/AuthTabs";
import { redirect } from "next/navigation";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  if (user) {
    redirect("/home");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <AuthTabs>{children}</AuthTabs>
    </main>
  );
};

export default Layout;
