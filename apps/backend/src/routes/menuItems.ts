import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { safeDb } from "../db/index.js";
import { authMiddleware, chefOnlyMiddleware, Variables } from "../middleware/auth.js";

export const menuItemsRouter = new Hono<{ Variables: Variables }>();

const createMenuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  category: z.string().optional().default("Mains"),
  price: z.number().int().positive("Price must be a positive integer in cents"),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().optional().default(true),
  type: z.enum(["SET_MENU", "A_LA_CARTE"]).optional().default("A_LA_CARTE"),
  dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "ALL_WEEK"]).optional(),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]).optional().default("LUNCH"),
});

const updateMenuItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().int().positive().optional(),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().optional(),
  type: z.enum(["SET_MENU", "A_LA_CARTE"]).optional(),
  dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "ALL_WEEK"]).optional(),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]).optional(),
});

// GET /menu-items - Public listing (optional chefId query param)
menuItemsRouter.get("/", async (c) => {
  try {
    const chefId = c.req.query("chefId");
    if (!chefId) {
      return c.json({ success: false, error: "chefId query parameter is required" }, 400);
    }
    const items = await safeDb.getMenuItemsByChefId(chefId);
    return c.json({ success: true, data: items });
  } catch (err: any) {
    console.error("[Menu Items GET Error]:", err);
    return c.json({ success: false, error: "Failed to fetch menu items" }, 500);
  }
});

// POST /menu-items - Protected endpoint (Chef role only) to create a Menu or À La Carte item
menuItemsRouter.post(
  "/",
  authMiddleware,
  chefOnlyMiddleware,
  zValidator("json", createMenuItemSchema, (result, c) => {
    if (!result.success) {
      const issue = result.error.issues[0];
      return c.json({ success: false, error: issue?.message || "Invalid item data" }, 400);
    }
  }),
  async (c) => {
    try {
      const user = c.get("user");
      const chefProfile = await safeDb.getChefProfileByUserId(user.id);
      if (!chefProfile) {
        return c.json({ success: false, error: "Chef profile not found" }, 400);
      }

      const body = c.req.valid("json");
      const newItem = await safeDb.createMenuItem({
        chefId: chefProfile.id,
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price,
        imageUrl: body.imageUrl,
        isAvailable: body.isAvailable,
        type: body.type,
        dayOfWeek: body.dayOfWeek,
        mealType: body.mealType,
      });

      return c.json({
        success: true,
        message: "Menu item created successfully",
        data: newItem,
      }, 201);
    } catch (err: any) {
      console.error("[Menu Item Create Error]:", err);
      return c.json({ success: false, error: "Failed to create menu item" }, 500);
    }
  }
);


// PUT /menu-items/:id - Protected endpoint (Chef role only) to edit item details or toggle availability
menuItemsRouter.put(
  "/:id",
  authMiddleware,
  chefOnlyMiddleware,
  zValidator("json", updateMenuItemSchema, (result, c) => {
    if (!result.success) {
      const issue = result.error.issues[0];
      return c.json({ success: false, error: issue?.message || "Invalid update data" }, 400);
    }
  }),
  async (c) => {
    try {
      const user = c.get("user");
      const id = c.req.param("id");
      const chefProfile = await safeDb.getChefProfileByUserId(user.id);
      if (!chefProfile) {
        return c.json({ success: false, error: "Chef profile not found" }, 400);
      }

      const body = c.req.valid("json");
      const updatedItem = await safeDb.updateMenuItem(id, chefProfile.id, body);

      if (!updatedItem) {
        return c.json({ success: false, error: "Item not found or unauthorized" }, 404);
      }

      return c.json({
        success: true,
        message: "Menu item updated successfully",
        data: updatedItem,
      });
    } catch (err: any) {
      console.error("[Menu Item Update Error]:", err);
      return c.json({ success: false, error: "Failed to update menu item" }, 500);
    }
  }
);

// DELETE /menu-items/:id - Protected endpoint (Chef role only) to remove an item
menuItemsRouter.delete(
  "/:id",
  authMiddleware,
  chefOnlyMiddleware,
  async (c) => {
    try {
      const user = c.get("user");
      const id = c.req.param("id");
      const chefProfile = await safeDb.getChefProfileByUserId(user.id);
      if (!chefProfile) {
        return c.json({ success: false, error: "Chef profile not found" }, 400);
      }

      const deleted = await safeDb.deleteMenuItem(id, chefProfile.id);
      if (!deleted) {
        return c.json({ success: false, error: "Item not found or unauthorized" }, 404);
      }

      return c.json({ success: true, message: "Menu item deleted successfully" });
    } catch (err: any) {
      console.error("[Menu Item Delete Error]:", err);
      return c.json({ success: false, error: "Failed to delete menu item" }, 500);
    }
  }
);
