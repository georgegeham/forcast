"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  notifyAllActors,
} from "@/drizzle/services/Notifications";
import { requireAdmin } from "@/lib/auth/admin";

async function getSessionUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

export async function getUserNotificationsAction() {
  const userId = await getSessionUserId();
  if (!userId) return { notifications: [], unreadCount: 0 };

  const [notifications, unreadCount] = await Promise.all([
    getNotifications(userId, 20, 0),
    getUnreadCount(userId),
  ]);

  return { notifications, unreadCount };
}

export async function markAsReadAction(notificationId: string) {
  const userId = await getSessionUserId();
  if (!userId) return;
  await markAsRead(notificationId);
}

export async function markAllAsReadAction() {
  const userId = await getSessionUserId();
  if (!userId) return;
  await markAllAsRead(userId);
}

export async function pushNotificationAction(formData: FormData) {
  try {
    await requireAdmin();
    const title = formData.get("title") as string;
    const message = formData.get("message") as string;

    if (!title) {
      return { error: true, message: "Title is required" };
    }

    await notifyAllActors({
      type: "admin_push",
      title,
      message: message || undefined,
    });

    return { error: false, message: "Notification sent" };
  } catch (e) {
    return {
      error: true,
      message: e instanceof Error ? e.message : "Failed to send notification",
    };
  }
}
