import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seed() {
    const existingUser = await storage.getUserByUsername("demo");
    if (!existingUser) {
        const password = await hashPassword("demo123");
        const user = await storage.createUser({ username: "demo", password });
        
        const prop = await storage.createProperty({
            name: "Sunset Apartments",
            address: "123 Sunset Blvd",
            imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3",
            userId: user.id
        });
        
        await storage.createTask({
            title: "Fix leaky faucet",
            description: "Unit 102 kitchen sink",
            status: "open",
            propertyId: prop.id
        });
        
        await storage.createTask({
            title: "Paint lobby",
            description: "Scheduled for next week",
            status: "in_progress",
            propertyId: prop.id
        });
        console.log("Database seeded!");
    }
}
