import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { safeDb } from "../db/index.js";
import { authMiddleware, chefOnlyMiddleware } from "../middleware/auth.js";
export const menusRouter = new Hono();
const normalizeSubscriptionType = (type) => {
    if (!type)
        return "one_time";
    const lower = type.toLowerCase();
    if (lower.includes("weekly"))
        return "weekly";
    if (lower.includes("monthly"))
        return "monthly";
    return "one_time";
};
const createMenuSchema = z.object({
    title: z.string().min(1, "Menu title is required"),
    description: z.string().optional(),
    price: z.number().int().positive("Price must be a positive integer in cents"),
    subscriptionType: z.string().optional().default("one_time"),
    subscription_type: z.string().optional(),
});
// GET /menus - Public list of available menus/subscriptions
menusRouter.get("/", async (c) => {
    try {
        const menusList = await safeDb.getAllMenus();
        return c.json({ success: true, data: menusList });
    }
    catch (err) {
        console.error("[Menus List Error]:", err);
        return c.json({ success: false, error: "Failed to fetch menus" }, 500);
    }
});
// POST /menus - Protected route (Chef role only) to create a new menu option
menusRouter.post("/", authMiddleware, chefOnlyMiddleware, zValidator("json", createMenuSchema, (result, c) => {
    if (!result.success) {
        const issue = result.error.issues[0];
        return c.json({ success: false, error: issue?.message || "Invalid menu data" }, 400);
    }
}), async (c) => {
    try {
        const user = c.get("user");
        const chefProfile = await safeDb.getChefProfileByUserId(user.id);
        if (!chefProfile) {
            return c.json({ success: false, error: "Chef profile not found. Please create a chef profile first." }, 400);
        }
        const body = c.req.valid("json");
        const rawSub = body.subscriptionType || body.subscription_type;
        const subscriptionType = normalizeSubscriptionType(rawSub);
        const newMenu = await safeDb.createMenu({
            chefId: chefProfile.id,
            title: body.title,
            description: body.description,
            price: body.price,
            subscriptionType,
        });
        return c.json({
            success: true,
            message: "Menu created successfully",
            data: newMenu,
        }, 201);
    }
    catch (err) {
        console.error("[Menu Create Error]:", err);
        return c.json({ success: false, error: "Failed to create menu" }, 500);
    }
});
// DELETE /menus/:id - Protected route (Chef role only) to remove a menu
menusRouter.delete("/:id", authMiddleware, chefOnlyMiddleware, async (c) => {
    try {
        const user = c.get("user");
        const menuId = c.req.param("id");
        const chefProfile = await safeDb.getChefProfileByUserId(user.id);
        if (!chefProfile) {
            return c.json({ success: false, error: "Chef profile not found" }, 400);
        }
        const deleted = await safeDb.deleteMenu(menuId, chefProfile.id);
        if (!deleted) {
            return c.json({ success: false, error: "Menu not found or you do not have permission to delete it" }, 404);
        }
        return c.json({ success: true, message: "Menu deleted successfully" });
    }
    catch (err) {
        console.error("[Menu Delete Error]:", err);
        return c.json({ success: false, error: "Failed to delete menu" }, 500);
    }
});
