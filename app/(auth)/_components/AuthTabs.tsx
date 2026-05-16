"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthTabs = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <Tabs value={pathname === "/signup" ? "signup" : "signin"}>
      <TabsList>
        <TabsTrigger value="signin" asChild>
          <Link href="/signin">Sign In</Link>
        </TabsTrigger>

        <TabsTrigger value="signup" asChild>
          <Link href="/signup">Sign Up</Link>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default AuthTabs;
