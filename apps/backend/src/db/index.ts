import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { eq, and, desc } from "drizzle-orm";
import { users, chefProfiles, menus, menuItems, subscriptions, orders } from "./schema.js";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/chef_launcher";

export const client = postgres(connectionString, {
  prepare: false,
  connect_timeout: 2,
  idle_timeout: 1,
  max: 5,
});

export const db = drizzle(client, { schema });

// --- In-Memory Fallback Store for Offline Development ---
import { seedChefsData } from "./seed.js";

export interface MemoryUser {
  id: string;
  name?: string | null;
  email: string;
  phone: string;
  dob?: string | null;
  passwordHash: string;
  role: "diner" | "chef";
  createdAt: Date;
}

export interface MemoryChefProfile {
  id: string;
  userId: string;
  name?: string | null;
  bio?: string | null;
  cuisineType?: string | null;
  rating?: string | null;
  reviews?: number;
  profileImage?: string | null;
  stripeConnectId?: string | null;
  createdAt: Date;
}

export interface MemoryMenu {
  id: string;
  chefId: string;
  title: string;
  description?: string | null;
  price: number;
  subscriptionType: "one_time" | "weekly" | "monthly";
  imageUrl?: string | null;
  createdAt: Date;
}

export interface MemorySubscription {
  id: string;
  userId: string;
  menuId: string;
  status: "active" | "canceled";
  stripeSubscriptionId?: string | null;
  createdAt: Date;
}

export interface MemoryMenuItem {
  id: string;
  chefId: string;
  name: string;
  description?: string | null;
  category: string;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  type: "SET_MENU" | "A_LA_CARTE";
  dayOfWeek?: string | null;
  mealType?: string | null;
  createdAt: Date;
}

export interface MemoryOrder {
  id: string;
  orderNumber: string;
  userId: string;
  chefId?: string | null;
  dishName: string;
  category?: string | null;
  mealType?: string | null;
  price: number;
  status: string;
  imageUrl?: string | null;
  createdAt: Date;
}

const memoryUsers: MemoryUser[] = [];
const memoryChefProfiles: MemoryChefProfile[] = [];
const memoryMenus: MemoryMenu[] = [];
const memoryMenuItems: MemoryMenuItem[] = [];
const memorySubscriptions: MemorySubscription[] = [];
const memoryOrders: MemoryOrder[] = [];

// Populate in-memory arrays from seedChefsData
for (const sc of seedChefsData) {
  memoryUsers.push({
    id: sc.userId,
    email: sc.email,
    phone: sc.phone,
    passwordHash: "$2a$10$wE47mQ2B1K/S0HjK7Z5mU.f40lDk9eK3T7B4K8e9m0B1C2D3E4F5G",
    role: "chef",
    createdAt: new Date(),
  });

  memoryChefProfiles.push({
    id: sc.id,
    userId: sc.userId,
    name: sc.name,
    bio: sc.bio,
    cuisineType: sc.cuisineType,
    rating: sc.rating,
    reviews: sc.reviews,
    profileImage: sc.profileImage,
    createdAt: new Date(),
  });

  for (const m of sc.menus) {
    memoryMenus.push({
      id: m.id,
      chefId: sc.id,
      title: m.title,
      description: m.description,
      price: m.price,
      subscriptionType: m.subscriptionType,
      imageUrl: m.imageUrl,
      createdAt: new Date(),
    });
  }

  if (sc.menuItems) {
    for (const mi of sc.menuItems) {
      memoryMenuItems.push({
        id: mi.id,
        chefId: sc.id,
        name: mi.name,
        description: mi.description,
        category: mi.category,
        price: mi.price,
        imageUrl: mi.imageUrl,
        isAvailable: mi.isAvailable ?? true,
        type: mi.type,
        dayOfWeek: mi.dayOfWeek || null,
        mealType: mi.mealType || "LUNCH",
        createdAt: new Date(),
      });
    }
  }
}

function isDbConnectionError(err: any): boolean {
  if (!err) return false;
  return true;
}

export const safeDb = {
  async findUserByEmail(email: string): Promise<MemoryUser | null> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      return user ? (user as MemoryUser) : null;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        return (
          memoryUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          ) || null
        );
      }
      throw err;
    }
  },

  async createUser(input: {
    name?: string;
    email: string;
    phone: string;
    dob?: string;
    passwordHash: string;
    role: "diner" | "chef";
  }): Promise<MemoryUser> {
    try {
      const [newUser] = await db
        .insert(users)
        .values({
          name: input.name || null,
          email: input.email,
          phone: input.phone,
          dob: input.dob || null,
          passwordHash: input.passwordHash,
          role: input.role,
        })
        .returning();
      return newUser as MemoryUser;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        const newUser: MemoryUser = {
          id: globalThis.crypto?.randomUUID() || `u-${Date.now()}`,
          name: input.name || null,
          email: input.email,
          phone: input.phone,
          dob: input.dob || null,
          passwordHash: input.passwordHash,
          role: input.role,
          createdAt: new Date(),
        };
        memoryUsers.push(newUser);
        return newUser;
      }
      throw err;
    }
  },

  async findUserById(id: string): Promise<MemoryUser | null> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user ? (user as MemoryUser) : null;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        return memoryUsers.find((u) => u.id === id) || null;
      }
      throw err;
    }
  },

  async getChefs() {
    try {
      const chefs = await db
        .select({
          id: chefProfiles.id,
          name: chefProfiles.name,
          bio: chefProfiles.bio,
          cuisineType: chefProfiles.cuisineType,
          rating: chefProfiles.rating,
          profileImage: chefProfiles.profileImage,
          stripeConnectId: chefProfiles.stripeConnectId,
          createdAt: chefProfiles.createdAt,
          user: {
            id: users.id,
            email: users.email,
            phone: users.phone,
          },
        })
        .from(chefProfiles)
        .innerJoin(users, eq(chefProfiles.userId, users.id));

      const result = [];
      for (const chef of chefs) {
        const chefMenus = await db
          .select()
          .from(menus)
          .where(eq(menus.chefId, chef.id));
        result.push({ ...chef, menus: chefMenus });
      }
      return result;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        return memoryChefProfiles.map((cp) => {
          const user = memoryUsers.find((u) => u.id === cp.userId);
          const chefMenus = memoryMenus.filter((m) => m.chefId === cp.id);
          return {
            id: cp.id,
            name: cp.name,
            bio: cp.bio,
            cuisineType: cp.cuisineType,
            rating: cp.rating || "4.9",
            reviews: cp.reviews || 120,
            profileImage: cp.profileImage || "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&auto=format&fit=crop",
            stripeConnectId: cp.stripeConnectId,
            createdAt: cp.createdAt,
            user: {
              id: user?.id || cp.userId,
              email: user?.email || "chef@example.com",
              phone: user?.phone || "+1234567890",
            },
            menus: chefMenus,
          };
        });
      }
      throw err;
    }
  },

  async getChefById(id: string) {
    try {
      const [chef] = await db
        .select({
          id: chefProfiles.id,
          name: chefProfiles.name,
          bio: chefProfiles.bio,
          cuisineType: chefProfiles.cuisineType,
          rating: chefProfiles.rating,
          profileImage: chefProfiles.profileImage,
          stripeConnectId: chefProfiles.stripeConnectId,
          createdAt: chefProfiles.createdAt,
          user: {
            id: users.id,
            email: users.email,
            phone: users.phone,
          },
        })
        .from(chefProfiles)
        .innerJoin(users, eq(chefProfiles.userId, users.id))
        .where(eq(chefProfiles.id, id));

      if (!chef) return null;
      const chefMenus = await db
        .select()
        .from(menus)
        .where(eq(menus.chefId, id));
      return { ...chef, menus: chefMenus };
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        const cp = memoryChefProfiles.find((c) => c.id === id);
        if (!cp) return null;
        const user = memoryUsers.find((u) => u.id === cp.userId);
        const chefMenus = memoryMenus.filter((m) => m.chefId === id);
        return {
          id: cp.id,
          name: cp.name,
          bio: cp.bio,
          cuisineType: cp.cuisineType,
          rating: cp.rating || "4.9",
          reviews: cp.reviews || 120,
          profileImage: cp.profileImage || "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&auto=format&fit=crop",
          stripeConnectId: cp.stripeConnectId,
          createdAt: cp.createdAt,
          user: {
            id: user?.id || cp.userId,
            email: user?.email || "chef@example.com",
            phone: user?.phone || "+1234567890",
          },
          menus: chefMenus,
        };
      }
      throw err;
    }
  },

  async upsertChefProfile(input: {
    userId: string;
    name?: string;
    bio?: string;
    cuisineType?: string;
    profileImage?: string;
    stripeConnectId?: string;
  }) {
    const defaultAvatar = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop";
    const profileImage = input.profileImage || defaultAvatar;

    try {
      const existing = await db
        .select()
        .from(chefProfiles)
        .where(eq(chefProfiles.userId, input.userId));

      if (existing.length > 0) {
        const [updated] = await db
          .update(chefProfiles)
          .set({ ...input, profileImage })
          .where(eq(chefProfiles.userId, input.userId))
          .returning();
        return updated;
      }

      const [newProfile] = await db
        .insert(chefProfiles)
        .values({ ...input, profileImage, userId: input.userId })
        .returning();
      return newProfile;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        let cp = memoryChefProfiles.find((c) => c.userId === input.userId);
        if (cp) {
          if (input.bio !== undefined) cp.bio = input.bio;
          if (input.cuisineType !== undefined) cp.cuisineType = input.cuisineType;
          if (input.profileImage !== undefined) cp.profileImage = input.profileImage;
          if (input.stripeConnectId !== undefined) cp.stripeConnectId = input.stripeConnectId;
          return cp;
        }
        const newCp: MemoryChefProfile = {
          id: globalThis.crypto?.randomUUID() || `c-${Date.now()}`,
          userId: input.userId,
          bio: input.bio,
          cuisineType: input.cuisineType,
          profileImage,
          stripeConnectId: input.stripeConnectId,
          createdAt: new Date(),
        };
        memoryChefProfiles.push(newCp);
        return newCp;
      }
      throw err;
    }
  },

  async getChefProfileByUserId(userId: string) {
    try {
      const [chef] = await db
        .select()
        .from(chefProfiles)
        .where(eq(chefProfiles.userId, userId));
      return chef || null;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        return (
          memoryChefProfiles.find((c) => c.userId === userId) || null
        );
      }
      throw err;
    }
  },

  async getAllMenus() {
    try {
      return await db.select().from(menus);
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        return memoryMenus;
      }
      throw err;
    }
  },

  async createMenu(input: {
    chefId: string;
    title: string;
    description?: string;
    price: number;
    subscriptionType: "one_time" | "weekly" | "monthly";
  }) {
    try {
      const [newMenu] = await db.insert(menus).values(input).returning();
      return newMenu;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        const newMenu: MemoryMenu = {
          id: globalThis.crypto?.randomUUID() || `m-${Date.now()}`,
          chefId: input.chefId,
          title: input.title,
          description: input.description,
          price: input.price,
          subscriptionType: input.subscriptionType,
          createdAt: new Date(),
        };
        memoryMenus.push(newMenu);
        return newMenu;
      }
      throw err;
    }
  },

  async deleteMenu(menuId: string, chefId: string) {
    try {
      const [existingMenu] = await db
        .select()
        .from(menus)
        .where(eq(menus.id, menuId));
      if (!existingMenu || existingMenu.chefId !== chefId) return false;

      await db.delete(menus).where(eq(menus.id, menuId));
      return true;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        const index = memoryMenus.findIndex(
          (m) => m.id === menuId && m.chefId === chefId
        );
        if (index === -1) return false;
        memoryMenus.splice(index, 1);
        return true;
      }
      throw err;
    }
  },

  async getMenuById(id: string): Promise<MemoryMenu | null> {
    try {
      const [menu] = await db.select().from(menus).where(eq(menus.id, id));
      return menu ? (menu as MemoryMenu) : null;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        return memoryMenus.find((m) => m.id === id) || null;
      }
      throw err;
    }
  },

  // --- Subscriptions ---
  async createSubscription(input: {
    userId: string;
    menuId: string;
    status?: "active" | "canceled";
    stripeSubscriptionId?: string;
  }): Promise<MemorySubscription> {
    try {
      const [newSub] = await db
        .insert(subscriptions)
        .values({
          userId: input.userId,
          menuId: input.menuId,
          status: input.status || "active",
          stripeSubscriptionId: input.stripeSubscriptionId,
        })
        .returning();
      return newSub as MemorySubscription;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        const newSub: MemorySubscription = {
          id: globalThis.crypto?.randomUUID() || `sub-${Date.now()}`,
          userId: input.userId,
          menuId: input.menuId,
          status: input.status || "active",
          stripeSubscriptionId: input.stripeSubscriptionId || `sub_mock_${Date.now()}`,
          createdAt: new Date(),
        };
        memorySubscriptions.push(newSub);
        return newSub;
      }
      throw err;
    }
  },

  async getSubscriptionsByUserId(userId: string) {
    try {
      const userSubs = await db
        .select({
          id: subscriptions.id,
          userId: subscriptions.userId,
          menuId: subscriptions.menuId,
          status: subscriptions.status,
          stripeSubscriptionId: subscriptions.stripeSubscriptionId,
        })
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId));

      const result = [];
      for (const sub of userSubs) {
        const menu = await this.getMenuById(sub.menuId);
        result.push({ ...sub, menu });
      }
      return result;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        return memorySubscriptions
          .filter((s) => s.userId === userId)
          .map((s) => {
            const menu = memoryMenus.find((m) => m.id === s.menuId);
            return { ...s, menu };
          });
      }
      throw err;
    }
  },

  // --- Menu Items (Set Menus & À La Carte) ---
  async getSetMenuItemsByChefId(chefId: string, dayOfWeek?: string): Promise<MemoryMenuItem[]> {
    try {
      let query;
      if (dayOfWeek && dayOfWeek !== "ALL") {
        query = db
          .select()
          .from(menuItems)
          .where(
            and(
              eq(menuItems.chefId, chefId),
              eq(menuItems.type, "SET_MENU"),
              eq(menuItems.dayOfWeek, dayOfWeek)
            )
          );
      } else {
        query = db
          .select()
          .from(menuItems)
          .where(and(eq(menuItems.chefId, chefId), eq(menuItems.type, "SET_MENU")));
      }
      let items = await query;
      if ((!items || items.length === 0) && dayOfWeek && dayOfWeek !== "ALL") {
        items = await db
          .select()
          .from(menuItems)
          .where(and(eq(menuItems.chefId, chefId), eq(menuItems.type, "SET_MENU")));
      }
      return items as MemoryMenuItem[];
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        let filtered = memoryMenuItems.filter((item) => {
          const matchChef = item.chefId === chefId;
          const matchType = item.type === "SET_MENU";
          const matchDay = !dayOfWeek || dayOfWeek === "ALL" || !item.dayOfWeek || item.dayOfWeek === dayOfWeek || item.dayOfWeek === "ALL_WEEK";
          return matchChef && matchType && matchDay;
        });
        if (filtered.length === 0 && dayOfWeek && dayOfWeek !== "ALL") {
          filtered = memoryMenuItems.filter((item) => item.chefId === chefId && item.type === "SET_MENU");
        }
        return filtered;
      }
      throw err;
    }
  },

  async getWeeklyScheduleByChefId(chefId: string, dayOfWeek?: string): Promise<MemoryMenuItem[]> {
    return this.getSetMenuItemsByChefId(chefId, dayOfWeek);
  },

  async getALaCarteItemsByChefId(chefId: string, category?: string): Promise<MemoryMenuItem[]> {
    try {
      let items: any[] = [];
      if (category && category !== "All") {
        items = await db
          .select()
          .from(menuItems)
          .where(
            and(
              eq(menuItems.chefId, chefId),
              eq(menuItems.type, "A_LA_CARTE"),
              eq(menuItems.category, category)
            )
          );
      }

      if (!items || items.length === 0) {
        items = await db
          .select()
          .from(menuItems)
          .where(
            and(
              eq(menuItems.chefId, chefId),
              eq(menuItems.type, "A_LA_CARTE")
            )
          );
      }

      if (!items || items.length === 0) {
        items = await db
          .select()
          .from(menuItems)
          .where(eq(menuItems.chefId, chefId));
      }

      return items as MemoryMenuItem[];
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        let items = memoryMenuItems.filter((item) => {
          const matchChef = item.chefId === chefId;
          const matchType = item.type === "A_LA_CARTE";
          const matchCategory = !category || category === "All" || item.category.toLowerCase() === category.toLowerCase();
          return matchChef && matchType && matchCategory;
        });

        if (items.length === 0) {
          items = memoryMenuItems.filter(item => item.chefId === chefId && item.type === "A_LA_CARTE");
        }

        if (items.length === 0) {
          items = memoryMenuItems.filter(item => item.chefId === chefId);
        }

        return items;
      }
      throw err;
    }
  },

  async getMenuItemsByChefId(chefId: string): Promise<MemoryMenuItem[]> {
    try {
      const items = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.chefId, chefId));
      return items as MemoryMenuItem[];
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        return memoryMenuItems.filter((item) => item.chefId === chefId);
      }
      throw err;
    }
  },

  async createMenuItem(input: {
    chefId: string;
    name: string;
    description?: string;
    category?: string;
    price: number;
    imageUrl?: string;
    isAvailable?: boolean;
    type?: "SET_MENU" | "A_LA_CARTE";
    dayOfWeek?: string;
    mealType?: string;
  }): Promise<MemoryMenuItem> {
    const category = input.category || "Mains";
    const type = input.type || "A_LA_CARTE";
    const isAvailable = input.isAvailable ?? true;
    const dayOfWeek = input.dayOfWeek || (type === "SET_MENU" ? "MONDAY" : undefined);
    const mealType = input.mealType || "LUNCH";

    try {
      const [newItem] = await db
        .insert(menuItems)
        .values({
          chefId: input.chefId,
          name: input.name,
          description: input.description,
          category,
          price: input.price,
          imageUrl: input.imageUrl,
          isAvailable,
          type,
          dayOfWeek,
          mealType,
        })
        .returning();
      return newItem as MemoryMenuItem;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        const newItem: MemoryMenuItem = {
          id: globalThis.crypto?.randomUUID() || `item-${Date.now()}`,
          chefId: input.chefId,
          name: input.name,
          description: input.description,
          category,
          price: input.price,
          imageUrl: input.imageUrl,
          isAvailable,
          type,
          dayOfWeek,
          mealType,
          createdAt: new Date(),
        };
        memoryMenuItems.push(newItem);
        return newItem;
      }
      throw err;
    }
  },

  async updateMenuItem(
    id: string,
    chefId: string,
    input: Partial<{
      name: string;
      description: string;
      category: string;
      price: number;
      imageUrl: string;
      isAvailable: boolean;
      type: "SET_MENU" | "A_LA_CARTE";
      dayOfWeek: string;
      mealType: string;
    }>
  ): Promise<MemoryMenuItem | null> {
    try {
      const [existing] = await db
        .select()
        .from(menuItems)
        .where(and(eq(menuItems.id, id), eq(menuItems.chefId, chefId)));
      if (!existing) return null;

      const [updated] = await db
        .update(menuItems)
        .set(input)
        .where(and(eq(menuItems.id, id), eq(menuItems.chefId, chefId)))
        .returning();
      return updated as MemoryMenuItem;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        const item = memoryMenuItems.find(
          (m) => m.id === id && m.chefId === chefId
        );
        if (!item) return null;
        if (input.name !== undefined) item.name = input.name;
        if (input.description !== undefined) item.description = input.description;
        if (input.category !== undefined) item.category = input.category;
        if (input.price !== undefined) item.price = input.price;
        if (input.imageUrl !== undefined) item.imageUrl = input.imageUrl;
        if (input.isAvailable !== undefined) item.isAvailable = input.isAvailable;
        if (input.type !== undefined) item.type = input.type;
        if (input.dayOfWeek !== undefined) item.dayOfWeek = input.dayOfWeek;
        if (input.mealType !== undefined) item.mealType = input.mealType;
        return item;
      }
      throw err;
    }
  },

  async deleteMenuItem(id: string, chefId: string): Promise<boolean> {
    try {
      const [existing] = await db
        .select()
        .from(menuItems)
        .where(and(eq(menuItems.id, id), eq(menuItems.chefId, chefId)));
      if (!existing) return false;

      await db.delete(menuItems).where(and(eq(menuItems.id, id), eq(menuItems.chefId, chefId)));
      return true;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        const index = memoryMenuItems.findIndex(
          (m) => m.id === id && m.chefId === chefId
        );
        if (index === -1) return false;
        memoryMenuItems.splice(index, 1);
        return true;
      }
      throw err;
    }
  },

  // --- Orders ---
  async createOrder(input: {
    userId: string;
    chefId?: string;
    dishName: string;
    category?: string;
    mealType?: string;
    price: number;
    status?: string;
    imageUrl?: string;
    orderNumber?: string;
  }): Promise<MemoryOrder> {
    const orderNum = input.orderNumber || `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const status = input.status || "confirmed";
    const category = input.category || "Main Dish";

    try {
      const [newOrder] = await db
        .insert(orders)
        .values({
          orderNumber: orderNum,
          userId: input.userId,
          chefId: input.chefId || null,
          dishName: input.dishName,
          category: category,
          mealType: input.mealType || null,
          price: input.price,
          status: status,
          imageUrl: input.imageUrl || null,
        })
        .returning();
      return newOrder as MemoryOrder;
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        const newOrder: MemoryOrder = {
          id: globalThis.crypto?.randomUUID() || `ord-${Date.now()}`,
          orderNumber: orderNum,
          userId: input.userId,
          chefId: input.chefId || null,
          dishName: input.dishName,
          category: category,
          mealType: input.mealType || null,
          price: input.price,
          status: status,
          imageUrl: input.imageUrl || null,
          createdAt: new Date(),
        };
        memoryOrders.unshift(newOrder);
        return newOrder;
      }
      throw err;
    }
  },

  async getOrdersByUserId(userId: string): Promise<MemoryOrder[]> {
    try {
      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));
      return userOrders as MemoryOrder[];
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        return memoryOrders
          .filter((o) => o.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      throw err;
    }
  },
};
