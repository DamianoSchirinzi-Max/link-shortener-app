import { db } from "@/db";
import { links } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getLinksByUserId(userId: string) {
  return db.select().from(links).where(eq(links.userId, userId)).orderBy(desc(links.updatedAt));
}

export async function createLink(input: {
  userId: string;
  shortCode: string;
  url: string;
}) {
  return db.insert(links).values(input);
}

export async function updateLink(input: {
  id: number;
  userId: string;
  shortCode: string;
  url: string;
}) {
  return db
    .update(links)
    .set({ shortCode: input.shortCode, url: input.url, updatedAt: new Date() })
    .where(and(eq(links.id, input.id), eq(links.userId, input.userId)));
}

export async function deleteLink(input: { id: number; userId: string }) {
  return db
    .delete(links)
    .where(and(eq(links.id, input.id), eq(links.userId, input.userId)));
}
