import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db/index.js";
import { menus, chefProfiles } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { authMiddleware, Variables } from "../middleware/auth.js";

export const menusRouter = new Hono<{ Variables: Variables }>();

const menuSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  recurringType: z.enum(["ONE_TIME", "WEEKLY_SUBSCRIPTION", "MONTHLY_SUBSCRIPTION"]),
  imageUrl: z.string().optional(),
});

menusRouter.post(
  "/",
  authMiddleware,
  zValidator("json", menuSchema),
  async (c) => {
    const user = c.get("user");
    if (user.role !== "CHEF") {
      return c.json({ error: "Only chefs can create menus" }, 403);
    }

    const [chef] = await db.select().from(chefProfiles).where(eq(chefProfiles.userId, user.id));
    if (!chef) {
      return c.json({ error: "Chef profile not found. Create one first." }, 400);
    }

    const body = c.req.valid("json");
    const [newMenu] = await db
      .insert(menus)
      .values({ ...body, chefId: chef.id })
      .returning();

    return c.json(newMenu);
  }
);

menusRouter.get("/", async (c) => {
  const allMenus = await db.select().from(menus).where(eq(menus.status, "ACTIVE"));
  return c.json(allMenus);
});

menusRouter.put(
  "/:id",
  authMiddleware,
  zValidator("json", menuSchema.partial()),
  async (c) => {
    const user = c.get("user");
    const menuId = c.req.param("id");

    if (user.role !== "CHEF") {
      return c.json({ error: "Only chefs can update menus" }, 403);
    }

    const [chef] = await db.select().from(chefProfiles).where(eq(chefProfiles.userId, user.id));
    if (!chef) return c.json({ error: "Chef profile not found" }, 400);

    const [existingMenu] = await db.select().from(menus).where(eq(menus.id, menuId));
    if (!existingMenu || existingMenu.chefId !== chef.id) {
      return c.json({ error: "Menu not found or not owned by you" }, 404);
    }

    const body = c.req.valid("json");
    const [updatedMenu] = await db
      .update(menus)
      .set(body)
      .where(eq(menus.id, menuId))
      .returning();

    return c.json(updatedMenu);
  }
);
