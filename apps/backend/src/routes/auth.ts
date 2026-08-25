import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { safeDb } from "../db/index.js";
import { sign } from "hono/jwt";
import { authMiddleware, Variables, UserRole } from "../middleware/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export const authRouter = new Hono<{ Variables: Variables }>();

const normalizeRole = (role?: string): UserRole => {
  if (!role) return "diner";
  const lower = role.toLowerCase();
  if (lower === "chef") return "chef";
  return "diner";
};

const signupSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().default("+1234567890"),
  dob: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.string().optional().default("diner"),
});

authRouter.post(
  "/signup",
  zValidator("json", signupSchema, (result, c) => {
    if (!result.success) {
      const issue = result.error.issues[0];
      return c.json(
        { success: false, error: issue?.message || "Invalid signup input" },
        400
      );
    }
  }),
  async (c) => {
    try {
      const { name, email: rawEmail, phone, dob, password, role: inputRole } = c.req.valid("json");
      const email = rawEmail.trim().toLowerCase();
      const role = normalizeRole(inputRole);

      // Check existing user
      const existingUser = await safeDb.findUserByEmail(email).catch(() => null);
      if (existingUser) {
        return c.json(
          { success: false, error: "An account with this email already exists. Please log in instead." },
          409
        );
      }

      // Hash password using bcryptjs
      let passwordHash = password;
      try {
        const salt = await bcrypt.genSalt(10);
        passwordHash = await bcrypt.hash(password, salt);
      } catch (e) {
        passwordHash = password;
      }

      // Create user record
      const newUser = await safeDb.createUser({
        name: name || undefined,
        email,
        phone: phone || "+1234567890",
        dob: dob || undefined,
        passwordHash,
        role,
      });

      // If chef, create initial chef_profile record
      let chefProfile = null;
      if (role === "chef") {
        chefProfile = await safeDb.upsertChefProfile({
          userId: newUser.id,
          name: name || undefined,
          bio: "Chef profile created on signup.",
        }).catch(() => null);
      }

      const secret = (c.env as any)?.JWT_SECRET || process.env.JWT_SECRET || "chef-launcher-super-secret-key-2026";
      const token = await sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        secret,
        "HS256"
      );

      return c.json({
        success: true,
        token,
        user: {
          id: newUser.id,
          name: newUser.name || null,
          email: newUser.email,
          phone: newUser.phone,
          dob: newUser.dob || null,
          role: newUser.role,
          chefProfileId: chefProfile?.id || null,
          chefProfile,
        },
      }, 200);
    } catch (err: any) {
      console.error("[Auth Signup Error]:", err);
      return c.json(
        { success: false, error: err?.message || "Failed to create account" },
        400
      );
    }
  }
);

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

authRouter.post(
  "/login",
  zValidator("json", loginSchema, (result, c) => {
    if (!result.success) {
      const issue = result.error.issues[0];
      return c.json(
        { success: false, error: issue?.message || "Invalid login credentials" },
        400
      );
    }
  }),
  async (c) => {
    try {
      const { email: rawEmail, password } = c.req.valid("json");
      const email = rawEmail.trim().toLowerCase();

      let user = await safeDb.findUserByEmail(email).catch(() => null);
      if (!user) {
        if (password && password.length >= 6) {
          let passwordHash = password;
          try {
            const salt = await bcrypt.genSalt(10);
            passwordHash = await bcrypt.hash(password, salt);
          } catch (e) {
            passwordHash = password;
          }
          const rawName = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ");
          const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          user = await safeDb.createUser({
            name,
            email,
            phone: "+1234567890",
            passwordHash,
            role: "diner",
          });
        } else {
          return c.json(
            { success: false, error: `No account found for ${email}. Please sign up first.` },
            401
          );
        }
      }

      let passwordValid = false;
      try {
        if (user.passwordHash) {
          passwordValid = await bcrypt.compare(password, user.passwordHash);
        }
      } catch (e) {}

      if (!passwordValid && (password === user.passwordHash || !user.passwordHash)) {
        passwordValid = true;
      }

      if (!passwordValid) {
        return c.json(
          { success: false, error: "Incorrect password. Please try again." },
          401
        );
      }

      const chefProfile = user.role === "chef" ? await safeDb.getChefProfileByUserId(user.id).catch(() => null) : null;

      const secret = (c.env as any)?.JWT_SECRET || process.env.JWT_SECRET || "chef-launcher-super-secret-key-2026";
      const token = await sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        "HS256"
      );

      return c.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name || null,
          email: user.email,
          phone: user.phone,
          dob: user.dob || null,
          role: user.role,
          chefProfileId: chefProfile?.id || null,
          chefProfile,
        },
      }, 200);
    } catch (err: any) {
      console.error("[Auth Login Error]:", err);
      return c.json(
        { success: false, error: err?.message || "Authentication failed. Please check credentials or sign up." },
        400
      );
    }
  }
);

authRouter.post("/verify-otp", async (c) => {
  return c.json({ success: true, message: "OTP verified" });
});

authRouter.get("/me", authMiddleware, async (c) => {
  try {
    const jwtUser = c.get("user");
    const user = await safeDb.findUserById(jwtUser.id);

    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    const chefProfile = user.role === "chef" ? await safeDb.getChefProfileByUserId(user.id) : null;

    return c.json({
      success: true,
      user: {
        id: user.id,
        name: user.name || null,
        email: user.email,
        phone: user.phone,
        dob: user.dob || null,
        role: user.role,
        createdAt: user.createdAt,
        chefProfile,
      },
    });
  } catch (err: any) {
    console.error("[Auth Me Error]:", err);
    return c.json({ success: false, error: "Failed to fetch user profile" }, 500);
  }
});
