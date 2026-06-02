import db from "../db";
import { notification, user } from "../schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: {
  userId: string;
  type: "new_actor" | "new_play" | "admin_push";
  title: string;
  message?: string;
  link?: string;
}) {
  const [n] = await db
    .insert(notification)
    .values({ id: nanoid(), userId, type, title, message, link })
    .returning();
  return n;
}

export async function notifyAllActors({
  type,
  title,
  message,
  link,
}: {
  type: "new_actor" | "new_play" | "admin_push";
  title: string;
  message?: string;
  link?: string;
}) {
  const actors = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.completedProfile, true));

  if (actors.length === 0) return;

  const values = actors.map((a) => ({
    id: nanoid(),
    userId: a.id,
    type,
    title,
    message: message ?? null,
    link: link ?? null,
    read: false as const,
    createdAt: new Date(),
  }));

  await db.insert(notification).values(values);
}

export async function getNotifications(userId: string, limit = 20, offset = 0) {
  return await db
    .select()
    .from(notification)
    .where(eq(notification.userId, userId))
    .orderBy(desc(notification.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getUnreadCount(userId: string) {
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(notification)
    .where(
      and(eq(notification.userId, userId), eq(notification.read, false)),
    );
  return row?.count ?? 0;
}

export async function markAsRead(notificationId: string) {
  await db
    .update(notification)
    .set({ read: true })
    .where(eq(notification.id, notificationId));
}

export async function markAllAsRead(userId: string) {
  await db
    .update(notification)
    .set({ read: true })
    .where(
      and(eq(notification.userId, userId), eq(notification.read, false)),
    );
}
