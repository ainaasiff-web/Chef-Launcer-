import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { safeDb } from "../db/index.js";
import { authMiddleware, chefOnlyMiddleware, Variables } from "../middleware/auth.js";

export const chefsRouter = new Hono<{ Variables: Variables }>();

const updateProfileSchema = z.object({
  bio: z.string().optional(),
  cuisineType: z.string().optional(),
  cuisine_type: z.string().optional(),
  stripeConnectId: z.string().optional(),
  stripe_connect_id: z.string().optional(),
});

// GET /chefs - Public list of all chefs with their profile info and associated menus
chefsRouter.get("/", async (c) => {
  try {
    const chefs = await safeDb.getChefs();
    return c.json({ success: true, data: chefs });
  } catch (err: any) {
    console.error("[Chefs List Error]:", err);
    return c.json({ success: false, error: "Failed to fetch chefs" }, 500);
  }
});

// GET /chefs/:id - Public detail route for a specific chef
chefsRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const chef = await safeDb.getChefById(id);

    if (!chef) {
      return c.json({ success: false, error: "Chef profile not found" }, 404);
    }

    return c.json({ success: true, data: chef });
  } catch (err: any) {
    console.error("[Chefs Get Error]:", err);
    return c.json({ success: false, error: "Failed to fetch chef profile" }, 500);
  }
});

// GET /chefs/:id/menu - Fetch set menu items for a chef (supporting optional day filter)
chefsRouter.get("/:id/menu", async (c) => {
  try {
    const id = c.req.param("id");
    const day = c.req.query("day");
    const setMenuItems = await safeDb.getSetMenuItemsByChefId(id, day);
    return c.json({ success: true, data: setMenuItems });
  } catch (err: any) {
    console.error("[Chef Set Menu Get Error]:", err);
    return c.json({ success: false, error: "Failed to fetch set menu items" }, 500);
  }
});

// GET /chefs/:id/weekly-schedule - Fetch weekly schedule items for a chef (grouped or filtered by weekday)
chefsRouter.get("/:id/weekly-schedule", async (c) => {
  try {
    const id = c.req.param("id");
    const day = c.req.query("day");
    const scheduleItems = await safeDb.getWeeklyScheduleByChefId(id, day);
    return c.json({ success: true, data: scheduleItems });
  } catch (err: any) {
    console.error("[Chef Weekly Schedule Get Error]:", err);
    return c.json({ success: false, error: "Failed to fetch weekly schedule" }, 500);
  }
});

// GET /chefs/:id/a-la-carte - Fetch individual À La Carte items for a chef (supporting category filter)
chefsRouter.get("/:id/a-la-carte", async (c) => {
  try {
    const id = c.req.param("id");
    const category = c.req.query("category");
    const aLaCarteItems = await safeDb.getALaCarteItemsByChefId(id, category);
    return c.json({ success: true, data: aLaCarteItems });
  } catch (err: any) {
    console.error("[Chef A La Carte Get Error]:", err);
    return c.json({ success: false, error: "Failed to fetch à la carte items" }, 500);
  }
});



// PUT /chefs/profile - Protected route (Chef role only) to update bio, cuisine, etc.
chefsRouter.put(
  "/profile",
  authMiddleware,
  chefOnlyMiddleware,
  zValidator("json", updateProfileSchema, (result, c) => {
    if (!result.success) {
      const issue = result.error.issues[0];
      return c.json({ success: false, error: issue?.message || "Invalid profile data" }, 400);
    }
  }),
  async (c) => {
    try {
      const user = c.get("user");
      const body = c.req.valid("json");

      const bio = body.bio;
      const cuisineType = body.cuisineType || body.cuisine_type;
      const stripeConnectId = body.stripeConnectId || body.stripe_connect_id;

      const updatedProfile = await safeDb.upsertChefProfile({
        userId: user.id,
        bio,
        cuisineType,
        stripeConnectId,
      });

      return c.json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (err: any) {
      console.error("[Chef Profile Update Error]:", err);
      return c.json({ success: false, error: "Failed to update chef profile" }, 500);
    }
  }
);
