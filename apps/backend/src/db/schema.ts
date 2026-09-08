import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["diner", "chef"]);
export const subscriptionTypeEnum = pgEnum("subscription_type", [
  "one_time",
  "weekly",
  "monthly",
]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
]);
export const menuItemTypeEnum = pgEnum("menu_item_type", [
  "SET_MENU",
  "A_LA_CARTE",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  dob: text("dob"),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("diner").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chefProfiles = pgTable("chef_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  name: text("name"),
  bio: text("bio"),
  cuisineType: text("cuisine_type"),
  profileImage: text("profile_image"),
  rating: text("rating"),
  stripeConnectId: text("stripe_connect_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menus = pgTable("menus", {
  id: uuid("id").defaultRandom().primaryKey(),
  chefId: uuid("chef_id")
    .references(() => chefProfiles.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // price in cents
  subscriptionType: subscriptionTypeEnum("subscription_type")
    .default("one_time")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  chefId: uuid("chef_id")
    .references(() => chefProfiles.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").default("Mains").notNull(),
  price: integer("price").notNull(), // in cents
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  type: text("type").default("A_LA_CARTE").notNull(), // 'SET_MENU' vs 'A_LA_CARTE'
  dayOfWeek: text("day_of_week"), // 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'ALL_WEEK'
  mealType: text("meal_type").default("LUNCH"), // 'BREAKFAST', 'LUNCH', 'DINNER'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  menuId: uuid("menu_id")
    .references(() => menus.id, { onDelete: "cascade" })
    .notNull(),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  chefId: text("chef_id"),
  dishName: text("dish_name").notNull(),
  category: text("category"),
  mealType: text("meal_type"),
  price: integer("price").notNull(), // in cents
  status: text("status").default("confirmed").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


