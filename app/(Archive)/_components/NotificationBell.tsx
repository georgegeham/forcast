"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Bell, BellRing, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "@/lib/auth/hooks/useSession";
import {
  getUserNotificationsAction,
  markAsReadAction,
  markAllAsReadAction,
} from "@/drizzle/actions/Notifications";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  type: "new_actor" | "new_play" | "admin_push";
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  createdAt: Date;
};

const NotificationBell = () => {
  const sessionUser = useSession();
  const userId = sessionUser?.id;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let ignore = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getUserNotificationsAction().then((result) => {
      if (ignore) return;
      setNotifications(result.notifications as Notification[]);
      setUnreadCount(result.unreadCount);
      setLoading(false);
    });
    return () => { ignore = true; };
  }, [userId, pathname]);

  const handleMarkAllRead = async () => {
    await markAllAsReadAction();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleClick = async (n: Notification) => {
    setOpen(false);
    if (!n.read) {
      await markAsReadAction(n.id);
      setNotifications((prev) =>
        prev.map((p) => (p.id === n.id ? { ...p, read: true } : p)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    if (n.link) router.push(n.link);
  };

  if (!userId) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer"
        >
          {unreadCount > 0 ? (
            <BellRing className="w-5 h-5 text-amber-400" />
          ) : (
            <Bell className="w-5 h-5 text-stone-400" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 mt-1 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800">
          <span className="text-sm font-medium">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-6">
              No notifications yet
            </p>
          ) : (
            notifications.slice(0, 5).map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-stone-800/50 hover:bg-stone-800/50 transition-colors",
                  !n.read && "bg-stone-800/30",
                )}
              >
                <p
                  className={cn(
                    "text-sm line-clamp-1",
                    !n.read ? "text-stone-100 font-medium" : "text-stone-400",
                  )}
                >
                  {n.title}
                </p>
                {n.message && (
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {n.message}
                  </p>
                )}
                <p className="text-[10px] text-stone-600 mt-1">
                  {new Date(n.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </button>
            ))
          )}
        </div>

        <Link
          href="/notifications"
          onClick={() => setOpen(false)}
          className="block text-center text-xs text-amber-400 hover:text-amber-300 py-3 border-t border-stone-800"
        >
          View all notifications →
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
