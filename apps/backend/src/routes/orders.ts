import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { safeDb } from "../db/index.js";
import { authMiddleware, Variables } from "../middleware/auth.js";

export const ordersRouter = new Hono<{ Variables: Variables }>();

const createOrderSchema = z.object({
  dishName: z.string().min(1, "Dish name is required"),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().optional(),
  mealType: z.string().optional(),
  chefId: z.string().optional(),
  status: z.string().optional(),
  imageUrl: z.string().optional(),
});

ordersRouter.use("*", authMiddleware);

ordersRouter.post(
  "/",
  zValidator("json", createOrderSchema, (result, c) => {
    if (!result.success) {
      return c.json({ success: false, error: "Invalid order payload" }, 400);
    }
  }),
  async (c) => {
    try {
      const user = c.get("user");
      const body = c.req.valid("json");

      const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

      const order = await safeDb.createOrder({
        userId: user.id,
        chefId: body.chefId,
        dishName: body.dishName,
        category: body.category || "Main Dish",
        mealType: body.mealType,
        price: Math.round(body.price),
        status: body.status || "confirmed",
        imageUrl: body.imageUrl,
        orderNumber,
      });

      return c.json({
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          order_number: order.orderNumber,
          dishName: order.dishName,
          category: order.category,
          mealType: order.mealType,
          price: order.price,
          status: order.status,
          imageUrl: order.imageUrl,
          createdAt: order.createdAt,
        },
      });
    } catch (err: any) {
      console.error("[Create Order Error]:", err);
      return c.json({ success: false, error: "Failed to create order" }, 500);
    }
  }
);

ordersRouter.get("/me", async (c) => {
  try {
    const user = c.get("user");
    const userOrders = await safeDb.getOrdersByUserId(user.id);
    return c.json({
      success: true,
      data: userOrders.map((o) => ({
        ...o,
        order_number: o.orderNumber,
      })),
    });
  } catch (err: any) {
    console.error("[Get Orders Error]:", err);
    return c.json({ success: false, error: "Failed to fetch orders" }, 500);
  }
});
