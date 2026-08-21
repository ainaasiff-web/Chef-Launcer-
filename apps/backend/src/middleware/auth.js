import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret";
export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ success: false, error: "Unauthorized access. Token missing." }, 401);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = await verify(token, JWT_SECRET, "HS256");
        c.set("user", decoded);
        await next();
    }
    catch (e) {
        console.error("[Auth Middleware Error]:", e?.message || e);
        return c.json({ success: false, error: "Invalid or expired token." }, 401);
    }
});
export const chefOnlyMiddleware = createMiddleware(async (c, next) => {
    const user = c.get("user");
    if (!user || user.role !== "chef") {
        return c.json({ success: false, error: "Forbidden. Chef role required." }, 403);
    }
    await next();
});
