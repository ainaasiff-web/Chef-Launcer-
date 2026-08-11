import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db/index.js";
import { menus, subscriptions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { authMiddleware, Variables } from "../middleware/auth.js";

export const checkoutRouter = new Hono<{ Variables: Variables }>();

const checkoutSchema = z.object({
  menuId: z.string().uuid(),
});

checkoutRouter.post(
  "/create-session",
  authMiddleware,
  zValidator("json", checkoutSchema),
  async (c) => {
    const user = c.get("user");
    const { menuId } = c.req.valid("json");

    const [menu] = await db.select().from(menus).where(eq(menus.id, menuId));
    if (!menu) return c.json({ error: "Menu not found" }, 404);

    // In a real application, initialize Stripe SDK and create a checkout session here.
    // We are mocking it for now.
    const mockSessionUrl = `http://localhost:3000/dashboard/user?success=true&menuId=${menu.id}`;

    return c.json({ url: mockSessionUrl });
  }
);

checkoutRouter.post("/webhooks/stripe", async (c) => {
  // Mock stripe webhook handler
  // const sig = c.req.header('stripe-signature');
  // const body = await c.req.text();
  // Verify signature and process event (e.g. checkout.session.completed)

  return c.json({ received: true });
});
