import { Hono } from "hono";
import { safeDb } from "../db/index.js";
import { authMiddleware, Variables } from "../middleware/auth.js";

export const subscriptionsRouter = new Hono<{ Variables: Variables }>();

// GET /subscriptions - Get active subscriptions & order history for authenticated user
subscriptionsRouter.get("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const subscriptionsList = await safeDb.getSubscriptionsByUserId(user.id);
    return c.json({ success: true, data: subscriptionsList });
  } catch (err: any) {
    console.error("[Subscriptions List Error]:", err);
    return c.json({ success: false, error: "Failed to fetch subscriptions" }, 500);
  }
});
