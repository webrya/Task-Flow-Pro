import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";
import ical from "node-ical";

import { seed } from "./seed";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
    setupAuth(app);

    // Seed data
    seed().catch(console.error);

    // Properties
    app.get(api.properties.list.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const properties = await storage.getProperties(user.id);
        res.json(properties);
    });

    app.post(api.properties.create.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const input = api.properties.create.input.parse(req.body);
        const property = await storage.createProperty({ ...input, userId: user.id });
        res.status(201).json(property);
    });
    
    app.get(api.properties.get.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const property = await storage.getProperty(Number(req.params.id));
        if (!property) return res.sendStatus(404);
        if (property.userId !== user.id) return res.sendStatus(403);
        res.json(property);
    });

    app.delete(api.properties.delete.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const property = await storage.getProperty(Number(req.params.id));
        if (!property) return res.sendStatus(404);
        if (property.userId !== user.id) return res.sendStatus(403);
        await storage.deleteProperty(Number(req.params.id));
        res.sendStatus(204);
    });

    app.put(api.properties.update.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const property = await storage.getProperty(Number(req.params.id));
        if (!property) return res.sendStatus(404);
        if (property.userId !== user.id) return res.sendStatus(403);
        const input = api.properties.update.input.parse(req.body);
        const updated = await storage.updateProperty(Number(req.params.id), input);
        res.json(updated);
    });

    app.post(api.properties.sync.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const property = await storage.getProperty(Number(req.params.id));
        if (!property) return res.sendStatus(404);
        if (property.userId !== user.id) return res.sendStatus(403);
        if (!property.iCalUrl) return res.status(400).json({ message: "No iCal URL configured" });

        try {
            const webEvents = await ical.async.fromURL(property.iCalUrl);
            let newBookings = 0;
            let newTasks = 0;

            for (const k in webEvents) {
                if (webEvents.hasOwnProperty(k)) {
                    const ev = webEvents[k];
                    if (ev.type === "VEVENT" && ev.start && ev.end && ev.uid) {
                        const existing = await storage.getBookingByExternalUid(ev.uid);
                        if (!existing) {
                            const booking = await storage.createBooking({
                                propertyId: property.id,
                                startDate: ev.start.toISOString().split('T')[0],
                                endDate: ev.end.toISOString().split('T')[0],
                                source: "ical",
                                externalUid: ev.uid,
                            });
                            newBookings++;

                            // Auto-generate task
                            const dueDate = new Date(ev.end);
                            dueDate.setDate(dueDate.getDate() + 1);
                            
                            await storage.createTask({
                                propertyId: property.id,
                                bookingId: booking.id,
                                title: "Cleaning after checkout",
                                status: "open",
                                dueDate: dueDate,
                            });
                            newTasks++;
                        }
                    }
                }
            }
            res.json({ newBookings, newTasks });
        } catch (err) {
            console.error("iCal sync error:", err);
            res.status(500).json({ message: "Failed to fetch or parse iCal" });
        }
    });

    // Tasks
    app.get(api.tasks.list.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const property = await storage.getProperty(Number(req.params.propertyId));
        if (!property || property.userId !== user.id) return res.sendStatus(404);
        
        const tasks = await storage.getTasks(Number(req.params.propertyId));
        res.json(tasks);
    });

    app.post(api.tasks.create.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const property = await storage.getProperty(Number(req.params.propertyId));
        if (!property || property.userId !== user.id) return res.sendStatus(404);

        const input = api.tasks.create.input.parse(req.body);
        const task = await storage.createTask({ ...input, propertyId: Number(req.params.propertyId) });
        res.status(201).json(task);
    });

    app.put(api.tasks.update.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const input = api.tasks.update.input.parse(req.body);
        const task = await storage.updateTask(Number(req.params.id), input);
        res.json(task);
    });

    app.delete(api.tasks.delete.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        await storage.deleteTask(Number(req.params.id));
        res.sendStatus(204);
    });

    // Bookings
    app.get(api.bookings.list.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const property = await storage.getProperty(Number(req.params.propertyId));
        if (!property || property.userId !== user.id) return res.sendStatus(404);

        const bookings = await storage.getBookings(Number(req.params.propertyId));
        res.json(bookings);
    });

    app.post(api.bookings.create.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const property = await storage.getProperty(Number(req.params.propertyId));
        if (!property || property.userId !== user.id) return res.sendStatus(404);

        const input = api.bookings.create.input.parse(req.body);
        const booking = await storage.createBooking({ ...input, propertyId: Number(req.params.propertyId) });
        res.status(201).json(booking);
    });

    app.patch("/api/user", async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const { name, role } = req.body;
        const updated = await storage.updateUser(user.id, { name, role });
        res.json(updated);
    });

    app.post("/api/user/password", async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        const user = req.user as any;
        const { currentPassword, newPassword } = req.body;
        
        // In a real app, we'd verify currentPassword first
        // But the prompt says email/password auth is being used
        // and for this scope we'll just implement the update logic
        const { scrypt, randomBytes, timingSafeEqual } = await import("crypto");
        const { promisify } = await import("util");
        const scryptAsync = promisify(scrypt);

        const [hash, salt] = user.password.split(".");
        const hashedBuffer = await scryptAsync(currentPassword, salt, 64) as Buffer;
        
        if (!timingSafeEqual(Buffer.from(hash, "hex"), hashedBuffer)) {
            return res.status(400).json({ message: "Invalid current password" });
        }

        const newSalt = randomBytes(16).toString("hex");
        const newBuf = await scryptAsync(newPassword, newSalt, 64) as Buffer;
        const newHashedPassword = `${newBuf.toString("hex")}.${newSalt}`;
        
        await storage.updateUser(user.id, { password: newHashedPassword });
        res.json({ message: "Password updated successfully" });
    });

    app.delete(api.bookings.delete.path, async (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        await storage.deleteBooking(Number(req.params.id));
        res.sendStatus(204);
    });

    return httpServer;
}
