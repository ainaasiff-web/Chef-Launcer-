import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  uuid,
  pgEnum,
  decimal,
  integer,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["CHEF", "USER", "ADMIN"]);
export const statusEnum = pgEnum("status", ["ACTIVE", "PENDING"]);
export const recurringTypeEnum = pgEnum("recurring_type", [
  "ONE_TIME",
  "WEEKLY_SUBSCRIPTION",
  "MONTHLY_SUBSCRIPTION",
]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "ACTIVE",
  "CANCELED",
  "PAST_DUE",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number"),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("USER").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chefProfiles = pgTable("chef_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  cuisineType: text("cuisine_type"),
  stripeConnectId: text("stripe_connect_id"),
  status: statusEnum("status").default("PENDING").notNull(),
});

export const menus = pgTable("menus", {
  id: uuid("id").defaultRandom().primaryKey(),
  chefId: uuid("chef_id")
    .references(() => chefProfiles.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // price in cents
  recurringType: recurringTypeEnum("recurring_type")
    .default("ONE_TIME")
    .notNull(),
  imageUrl: text("image_url"),
  status: statusEnum("status").default("ACTIVE").notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  menuId: uuid("menu_id")
    .references(() => menus.id, { onDelete: "cascade" })
    .notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: subscriptionStatusEnum("status").default("ACTIVE").notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
});
