import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export type Variables = {
  user: {
    id: string;
    role: "CHEF" | "USER" | "ADMIN";
  };
};

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export const authMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = await verify(token, JWT_SECRET);
      c.set("user", decoded as Variables["user"]);
      await next();
    } catch (e) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }
);
