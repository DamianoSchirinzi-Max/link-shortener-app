import { pgTable, integer, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  shortCode: varchar("short_code", { length: 20 }).notNull().unique(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
