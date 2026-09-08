import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { safeDb } from "../db/index.js";
import { authMiddleware, Variables } from "../middleware/auth.js";

export const checkoutRouter = new Hono<{ Variables: Variables }>();

const checkoutSchema = z.object({
  menuId: z.string().min(1, "Menu ID is required"),
});

checkoutRouter.post(
  "/create-session",
  authMiddleware,
  zValidator("json", checkoutSchema, (result, c) => {
    if (!result.success) {
      return c.json({ success: false, error: "Invalid menu ID" }, 400);
    }
  }),
  async (c) => {
    try {
      const user = c.get("user");
      const { menuId } = c.req.valid("json");

      const menu = await safeDb.getMenuById(menuId);
      if (!menu) {
        return c.json({ success: false, error: "Menu not found" }, 404);
      }

      // Record active subscription for user
      const subscription = await safeDb.createSubscription({
        userId: user.id,
        menuId: menu.id,
        status: "active",
      });

      const mockSessionUrl = `http://localhost:3000/dashboard/user?success=true&menuId=${menu.id}&subId=${subscription.id}`;

      return c.json({
        success: true,
        url: mockSessionUrl,
        subscription,
      });
    } catch (err: any) {
      console.error("[Checkout Session Error]:", err);
      return c.json({ success: false, error: "Failed to create checkout session" }, 500);
    }
  }
);

checkoutRouter.post("/webhooks/stripe", async (c) => {
  return c.json({ received: true });
});
