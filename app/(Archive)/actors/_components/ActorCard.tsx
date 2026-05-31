"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserWithProfile } from "@/drizzle/Types/types";
import { Pencil, Trash2, User } from "lucide-react";
import { authClient } from "@/lib/auth/client_auth";
import { deleteUserAction } from "@/drizzle/actions/Users";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ActorCard = ({ user }: { user: UserWithProfile }) => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    authClient.getSession().then((session) => {
      const u = session?.data?.user;
      setUserRole((u as { role?: string })?.role ?? null);
      setUserId((u as { id?: string })?.id ?? null);
    });
  }, []);

  return (
    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group overflow-hidden pt-0 relative">
      <Link href={`/actors/${user.id}`} className="block">
        <div className="relative w-full h-44 bg-muted overflow-hidden flex items-center justify-center">
          {user.image ? (
            <div className="relative w-full h-44 bg-muted overflow-hidden">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
        </div>

        <CardHeader>
          <CardTitle className="text-base pt-2 line-clamp-1 uppercase text-center tracking-wider">
            {user.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex justify-between items-center text-center space-y-1 p-4 pt-1">
          {user.profile?.gender && (
            <p className="text-xs capitalize text-muted-foreground">
              {user.profile.gender}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </CardContent>

        <CardFooter className="text-xs text-muted-foreground justify-center">
          View profile →
        </CardFooter>
      </Link>

      {userRole === "admin" && userId !== user.id && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon-xs"
            className="bg-stone-900/80 hover:bg-stone-800 text-stone-400"
            onClick={() => router.push(`/actors/${user.id}`)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="bg-stone-900/80 hover:bg-stone-800 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Trash2 className="text-red-400" />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete Actor</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{user.name}&rdquo;?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={async () => {
                    const result = await deleteUserAction(user.id);
                    if (result?.error) {
                      toast.error(result.message ?? "Failed to delete");
                    } else {
                      toast.success("Actor deleted");
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </Card>
  );
};

export default ActorCard;
