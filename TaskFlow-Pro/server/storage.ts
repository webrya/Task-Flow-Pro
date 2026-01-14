import { db } from "./db";
import { users, properties, tasks, bookings, type User, type InsertUser, type Property, type InsertProperty, type Task, type InsertTask, type Booking, type InsertBooking } from "@shared/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getProperties(userId: number): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty & { userId: number }): Promise<Property>;
  deleteProperty(id: number): Promise<void>;

  getTasks(propertyId: number): Promise<Task[]>;
  createTask(task: InsertTask & { propertyId: number }): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  getBookingByExternalUid(uid: string): Promise<Booking | undefined>;
  getTaskByBookingId(bookingId: number): Promise<Task | undefined>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property>;
  updateUser(id: number, user: Partial<User>): Promise<User>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
        pool,
        createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const [updatedUser] = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  async getProperties(userId: number): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.userId, userId));
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(property: InsertProperty & { userId: number }): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async deleteProperty(id: number): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  async getTasks(propertyId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.propertyId, propertyId));
  }

  async createTask(task: InsertTask & { propertyId: number }): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task> {
    const [updatedTask] = await db.update(tasks).set(task).where(eq(tasks.id, id)).returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
      await db.delete(tasks).where(eq(tasks.id, id));
  }

  async getBookings(propertyId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.propertyId, propertyId));
  }

  async createBooking(booking: InsertBooking & { propertyId: number }): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async deleteBooking(id: number): Promise<void> {
    await db.delete(bookings).where(eq(bookings.id, id));
  }

  async getBookingByExternalUid(uid: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.externalUid, uid));
    return booking;
  }

  async getTaskByBookingId(bookingId: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.bookingId, bookingId));
    return task;
  }

  async updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property> {
    const [updatedProperty] = await db.update(properties).set(property).where(eq(properties.id, id)).returning();
    return updatedProperty;
  }
}

export const storage = new DatabaseStorage();
