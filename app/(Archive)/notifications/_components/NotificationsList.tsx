"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, UserPlus, Theater, Megaphone, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAsReadAction, markAllAsReadAction } from "@/drizzle/actions/Notifications";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
};

const typeIcon = {
  new_actor: UserPlus,
  new_play: Theater,
  admin_push: Megaphone,
};

const NotificationsList = ({
  notifications: initial,
  initialUnread,
}: {
  notifications: NotificationItem[];
  initialUnread: number;
}) => {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [unreadCount, setUnreadCount] = useState(initialUnread);

  const handleClick = async (n: NotificationItem) => {
    if (!n.read) {
      await markAsReadAction(n.id);
      setItems((prev) =>
        prev.map((p) => (p.id === n.id ? { ...p, read: true } : p)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    if (n.link) router.push(n.link);
  };

  const handleMarkAllRead = async () => {
    await markAllAsReadAction();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const Icon = (type: string) =>
    typeIcon[type as keyof typeof typeIcon] ?? BellRing;

  return (
    <div>
      {unreadCount > 0 && (
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all as read
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <BellRing className="w-10 h-10 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No notifications yet
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((n) => {
            const Icn = Icon(n.type);
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={cn(
                  "w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg transition-colors",
                  !n.read
                    ? "bg-stone-800/40 hover:bg-stone-800/60"
                    : "hover:bg-stone-800/20",
                )}
              >
                <div
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5",
                    !n.read
                      ? "bg-amber-400/10 text-amber-400"
                      : "bg-stone-800 text-stone-500",
                  )}
                >
                  <Icn className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm line-clamp-1",
                      !n.read
                        ? "text-stone-100 font-medium"
                        : "text-stone-400",
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
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!n.read && (
                  <span className="shrink-0 w-2 h-2 rounded-full bg-amber-400 mt-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
