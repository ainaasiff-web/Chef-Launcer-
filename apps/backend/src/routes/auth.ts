import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { sign, verify } from "hono/jwt";
import { authMiddleware, Variables } from "../middleware/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export const authRouter = new Hono<{ Variables: Variables }>();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.string().optional(),
  role: z.enum(["CHEF", "USER"]).default("USER"),
});

authRouter.post("/signup", zValidator("json", signupSchema), async (c) => {
  const { email, password, phoneNumber, role } = c.req.valid("json");
  
  // In a real app, hash password with bcrypt
  const passwordHash = password;

  const existingUser = await db.select().from(users).where(eq(users.email, email));
  if (existingUser.length > 0) {
    return c.json({ error: "Email already in use" }, 400);
  }

  const [newUser] = await db
    .insert(users)
    .values({ email, passwordHash, phoneNumber, role })
    .returning();

  const token = await sign({ id: newUser.id, role: newUser.role }, JWT_SECRET);
  return c.json({ token, user: { id: newUser.id, email: newUser.email, role: newUser.role } });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user || user.passwordHash !== password) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await sign({ id: user.id, role: user.role }, JWT_SECRET);
  return c.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

authRouter.post("/verify-otp", async (c) => {
  // Stub for phone OTP verification via Twilio/Supabase
  return c.json({ message: "OTP verified" });
});

authRouter.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
  
  if (!dbUser) return c.json({ error: "User not found" }, 404);
  
  return c.json({ user: { id: dbUser.id, email: dbUser.email, role: dbUser.role, isVerified: dbUser.isVerified } });
});
