import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getNotifications, getUnreadCount } from "@/drizzle/services/Notifications";
import { markAllAsReadAction } from "@/drizzle/actions/Notifications";
import NotificationsList from "./_components/NotificationsList";

const NotificationsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/signin");

  const [notifications, unreadCount] = await Promise.all([
    getNotifications(session.user.id, 50, 0),
    getUnreadCount(session.user.id),
  ]);

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
      </div>

      <NotificationsList
        notifications={notifications.map((n) => ({
          ...n,
          createdAt: n.createdAt.toISOString(),
        }))}
        initialUnread={unreadCount}
      />
    </div>
  );
};

export default NotificationsPage;
