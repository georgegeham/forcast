"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth/client_auth";
import { CurrentUser } from "@/lib/auth/hooks/getCurrentUserInfo";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

const UserAvatar = ({ user }: { user: CurrentUser | null }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const signOut = async () => {
    setLoading(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/signin");
        },
        onError: (error) => {
          toast.error(
            error.error.message ||
              "Error While Sign out please try again later",
          );
        },
      },
    });
    setLoading(false);
  };
  if (!user) return null;

  const avatarSrc = user.image
    ? `${user.image}?v=${user.updatedAt?.getTime() ?? Date.now()}`
    : "";

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer" asChild>
        <Avatar>
          <AvatarImage src={avatarSrc} alt="User Avatar" />
          <AvatarFallback>{user?.name?.charAt(0) || ""}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-60 mt-1" align="end">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={avatarSrc} alt="User Avatar" />
              <AvatarFallback>{user?.name?.charAt(0) || ""}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="border-t" />
          <div className="flex items-center gap-2">
            <Link className="cursor-pointer" href="/profile">
              Profile
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={signOut}
            >
              <LoadingSwap isLoading={loading}>Sign Out</LoadingSwap>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserAvatar;
