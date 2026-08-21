import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export type UserRole = "diner" | "chef";

export type Variables = {
  user: {
    id: string;
    role: UserRole;
    email: string;
  };
};

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export const authMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ success: false, error: "Unauthorized access. Token missing." }, 401);
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = await verify(token, JWT_SECRET, "HS256");
      c.set("user", decoded as Variables["user"]);
      await next();
    } catch (e: any) {
      console.error("[Auth Middleware Error]:", e?.message || e);
      return c.json({ success: false, error: "Invalid or expired token." }, 401);
    }
  }
);

export const chefOnlyMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const user = c.get("user");
    if (!user || user.role !== "chef") {
      return c.json(
        { success: false, error: "Forbidden. Chef role required." },
        403
      );
    }
    await next();
  }
);
