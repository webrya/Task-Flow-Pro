import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role", { enum: ["HOST_PRIVATE", "CLEANER", "CLEANING_COMPANY", "PM_COMPANY"] }).notNull().default("HOST_PRIVATE"),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  userId: integer("user_id").notNull(),
  imageUrl: text("image_url"),
  iCalUrl: text("ical_url"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("open"), // open, in_progress, completed
  propertyId: integer("property_id").notNull(),
  bookingId: integer("booking_id"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  source: text("source").notNull(),
  externalUid: text("external_uid").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  user: one(users, {
    fields: [properties.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
  bookings: many(bookings),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  property: one(properties, {
    fields: [tasks.propertyId],
    references: [properties.id],
  }),
  booking: one(bookings, {
    fields: [tasks.bookingId],
    references: [bookings.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  property: one(properties, {
    fields: [bookings.propertyId],
    references: [properties.id],
  }),
  tasks: many(tasks),
}));

export const insertUserSchema = createInsertSchema(users);
export const insertPropertySchema = createInsertSchema(properties).omit({ id: true, userId: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
