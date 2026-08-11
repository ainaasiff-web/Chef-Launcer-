import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db/index.js";
import { chefProfiles, users, menus } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { authMiddleware, Variables } from "../middleware/auth.js";

export const chefsRouter = new Hono<{ Variables: Variables }>();

const profileSchema = z.object({
  bio: z.string().optional(),
  profileImage: z.string().optional(),
  cuisineType: z.string().optional(),
});

chefsRouter.post(
  "/profile",
  authMiddleware,
  zValidator("json", profileSchema),
  async (c) => {
    const user = c.get("user");
    if (user.role !== "CHEF") {
      return c.json({ error: "Only chefs can create profiles" }, 403);
    }

    const { bio, profileImage, cuisineType } = c.req.valid("json");

    const existing = await db
      .select()
      .from(chefProfiles)
      .where(eq(chefProfiles.userId, user.id));
      
    if (existing.length > 0) {
      const [updated] = await db
        .update(chefProfiles)
        .set({ bio, profileImage, cuisineType })
        .where(eq(chefProfiles.userId, user.id))
        .returning();
      return c.json(updated);
    }

    const [newProfile] = await db
      .insert(chefProfiles)
      .values({ userId: user.id, bio, profileImage, cuisineType })
      .returning();
    return c.json(newProfile);
  }
);

chefsRouter.get("/", async (c) => {
  const chefs = await db
    .select({
      id: chefProfiles.id,
      bio: chefProfiles.bio,
      cuisineType: chefProfiles.cuisineType,
      profileImage: chefProfiles.profileImage,
      user: {
        id: users.id,
        email: users.email,
      },
    })
    .from(chefProfiles)
    .innerJoin(users, eq(chefProfiles.userId, users.id))
    .where(eq(chefProfiles.status, "ACTIVE"));

  return c.json(chefs);
});

chefsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const [chef] = await db
    .select({
      id: chefProfiles.id,
      bio: chefProfiles.bio,
      cuisineType: chefProfiles.cuisineType,
      profileImage: chefProfiles.profileImage,
      user: {
        id: users.id,
        email: users.email,
      },
    })
    .from(chefProfiles)
    .innerJoin(users, eq(chefProfiles.userId, users.id))
    .where(eq(chefProfiles.id, id));

  if (!chef) return c.json({ error: "Chef not found" }, 404);

  const chefMenus = await db.select().from(menus).where(eq(menus.chefId, id));
  
  return c.json({ ...chef, menus: chefMenus });
});
