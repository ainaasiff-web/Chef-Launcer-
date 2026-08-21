import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { users, chefProfiles, menus, menuItems } from "./schema.js";
export const seedChefsData = [
    {
        id: "demo-1",
        userId: "u1111111-1111-1111-1111-111111111111",
        name: "Marco Rossi",
        email: "marco@cheflaunch.com",
        phone: "+1 555-0101",
        bio: "Award-winning Italian chef with 15 years of experience in Michelin-starred restaurants across Rome and Milan. Specializing in handmade pasta and classic Roman delicacies.",
        cuisineType: "Italian",
        rating: "4.9",
        reviews: 142,
        profileImage: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&auto=format&fit=crop",
        menus: [
            { id: "m1", title: "Classic Roman Pasta Box", description: "Handmade Cacio e Pepe, Carbonara & Amatriciana. Serves 2 with fresh ingredients.", price: 4500, subscriptionType: "one_time", imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop" },
            { id: "m2", title: "Weekly Italian Feast", description: "A new 3-course Italian meal every week. Primo, Secondo, and Dolce delivered fresh.", price: 8900, subscriptionType: "weekly", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop" },
            { id: "m3", title: "Monthly Gourmet Collection", description: "Premium monthly box with 4 signature Italian dishes & wine pairing notes.", price: 14900, subscriptionType: "monthly", imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop" }
        ],
        menuItems: [
            // Monday
            { id: "item-101a", name: "Italian Espresso & Ricotta Cornetto", description: "Freshly baked croissant filled with sweet ricotta and served with double espresso.", category: "Starters", price: 1500, imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "MONDAY", mealType: "BREAKFAST" },
            { id: "item-101b", name: "Handmade Cacio e Pepe Lunch", description: "Fresh tonnarelli pasta with Pecorino Romano and cracked black pepper.", category: "Mains", price: 3200, imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "MONDAY", mealType: "LUNCH" },
            { id: "item-101c", name: "Slow-Cooked Ossobuco alla Milanese", description: "Tender braised veal shanks served with saffron risotto.", category: "Mains", price: 4800, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "MONDAY", mealType: "DINNER" },
            // Tuesday
            { id: "item-102a", name: "Frittata alla Fiorentina", description: "Fluffy Italian egg frittata with spinach, goat cheese, and sun-dried tomatoes.", category: "Starters", price: 1800, imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "TUESDAY", mealType: "BREAKFAST" },
            { id: "item-102b", name: "Truffle Pappardelle Lunch", description: "Ribbon pasta tossed with wild mushroom and black truffle cream sauce.", category: "Mains", price: 3800, imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "TUESDAY", mealType: "LUNCH" },
            { id: "item-102c", name: "Bistecca alla Fiorentina Dinner", description: "Grilled T-bone steak served with roasted rosemary potatoes.", category: "Mains", price: 5600, imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "TUESDAY", mealType: "DINNER" },
            // Wednesday
            { id: "item-103a", name: "Avocado & Poached Egg Toast", description: "Toasted sourdough with crushed avocado, poached eggs, and chili flakes.", category: "Starters", price: 1600, imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "WEDNESDAY", mealType: "BREAKFAST" },
            { id: "item-103b", name: "Saffron & Prawn Risotto Lunch", description: "Creamy Carnaroli rice cooked with saffron broth and tiger prawns.", category: "Mains", price: 4200, imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "WEDNESDAY", mealType: "LUNCH" },
            { id: "item-103c", name: "Baked Sea Bass & Mediterranean Herbs", description: "Whole roasted sea bass with capers, cherry tomatoes, and lemon olive oil.", category: "Mains", price: 5200, imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "WEDNESDAY", mealType: "DINNER" },
            // Thursday
            { id: "item-104a", name: "Baked Brioche French Toast", description: "Brioche French toast topped with fresh berries and maple syrup.", category: "Starters", price: 1700, imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "THURSDAY", mealType: "BREAKFAST" },
            { id: "item-104b", name: "Traditional Bolognese Lasagna Lunch", description: "Layered egg pasta with rich meat ragù and velvety béchamel sauce.", category: "Mains", price: 3500, imageUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "THURSDAY", mealType: "LUNCH" },
            { id: "item-104c", name: "Braised Short Rib & Polenta Dinner", description: "Red wine braised beef short ribs served over creamy parmesan polenta.", category: "Mains", price: 5400, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "THURSDAY", mealType: "DINNER" },
            // Friday
            { id: "item-105a", name: "Smoked Salmon & Capers Omelette", description: "Three-egg omelette with Norwegian smoked salmon and dill cream cheese.", category: "Starters", price: 1900, imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "FRIDAY", mealType: "BREAKFAST" },
            { id: "item-105b", name: "Spaghetti alle Vongole Lunch", description: "Fresh clams sautéed with garlic, white wine, parsley, and olive oil.", category: "Mains", price: 3900, imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "FRIDAY", mealType: "LUNCH" },
            { id: "item-105c", name: "Grand Roman 4-Course Dinner", description: "Includes Bruschetta, Carbonara, Ossobuco, and Tiramisu.", category: "Mains", price: 6500, imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "FRIDAY", mealType: "DINNER" },
            // À la carte items
            { id: "item-1", name: "Bruschetta al Pomodoro", description: "Toasted artisanal sourdough with ripe vine tomatoes, fresh basil, and extra virgin olive oil.", category: "Starters", price: 1200, imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-2", name: "Classic Spaghetti Carbonara", description: "Guanciale, pecorino romano, egg yolk, and freshly cracked black pepper.", category: "Mains", price: 2400, imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-3", name: "Traditional Tiramisu", description: "Savoiardi ladyfingers dipped in espresso with mascarpone cream and dark cocoa powder.", category: "Desserts", price: 1000, imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-4", name: "San Pellegrino Sparkling Mineral Water", description: "Chilled 750ml glass bottle.", category: "Beverages", price: 500, imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" }
        ]
    },
    {
        id: "demo-2",
        userId: "u2222222-2222-2222-2222-222222222222",
        name: "Kenji Tanaka",
        email: "kenji@cheflaunch.com",
        phone: "+1 555-0102",
        bio: "Passionate sushi master trained in Tokyo for over a decade. Specializing in omakase sushi, fresh sashimi, and seasonal Japanese cuisine.",
        cuisineType: "Japanese",
        rating: "5.0",
        reviews: 98,
        profileImage: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop",
        menus: [
            { id: "m4", title: "Sushi Omakase Box (8 pcs)", description: "Chef's selection of 8 premium nigiri pieces with seasonal fish, soy & wasabi.", price: 6500, subscriptionType: "one_time", imageUrl: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop" },
            { id: "m5", title: "Weekly Bento Subscription", description: "Curated weekly bento box with sushi, tempura, miso soup & seasonal sides.", price: 9500, subscriptionType: "weekly", imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop" },
            { id: "m5b", title: "Monthly Kaiseki Tasting", description: "Traditional multi-course Japanese tasting menu box prepared monthly.", price: 16500, subscriptionType: "monthly", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop" }
        ],
        menuItems: [
            // Monday
            { id: "item-201a", name: "Matcha Pancake & Fruit Bowl", description: "Japanese fluffy soufflé pancakes with matcha cream and fresh fruits.", category: "Starters", price: 1800, imageUrl: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "MONDAY", mealType: "BREAKFAST" },
            { id: "item-201b", name: "Monday Nigiri Special Lunch", description: "Chef's selection of 6 premium nigiri pieces with fresh wasabi.", category: "Mains", price: 3500, imageUrl: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "MONDAY", mealType: "LUNCH" },
            { id: "item-201c", name: "Wagyu Beef Sukiyaki Dinner", description: "Thinly sliced A5 Wagyu beef simmered with tofu and mushrooms in sweet dashi.", category: "Mains", price: 6800, imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "MONDAY", mealType: "DINNER" },
            // Tuesday
            { id: "item-202a", name: "Japanese Tamagoyaki & Miso Soup", description: "Rolled Japanese omelette with dashi broth, served with hot miso soup and steamed rice.", category: "Starters", price: 1600, imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "TUESDAY", mealType: "BREAKFAST" },
            { id: "item-202b", name: "Tuesday Sashimi Deluxe Lunch", description: "Wild salmon, yellowtail & bluefin tuna sashimi platter with pickled ginger.", category: "Mains", price: 4200, imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "TUESDAY", mealType: "LUNCH" },
            { id: "item-202c", name: "Tonkatsu Pork Chop & Curry Dinner", description: "Crispy panko-crusted pork cutlet served with rich Japanese curry and rice.", category: "Mains", price: 4500, imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "TUESDAY", mealType: "DINNER" },
            // Wednesday
            { id: "item-203a", name: "Salmon & Avocado Rice Ball (Onigiri)", description: "Hand-shaped seasoned rice balls filled with grilled salmon and wrapped in nori.", category: "Starters", price: 1400, imageUrl: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "WEDNESDAY", mealType: "BREAKFAST" },
            { id: "item-203b", name: "Wednesday Tempura Bento Lunch", description: "Crispy shrimp & vegetable tempura with steamed rice and miso soup.", category: "Mains", price: 2900, imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "WEDNESDAY", mealType: "LUNCH" },
            { id: "item-203c", name: "Chicken Teriyaki & Yakisoba Dinner", description: "Glazed teriyaki chicken thigh served alongside stir-fried yakisoba noodles.", category: "Mains", price: 4600, imageUrl: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "WEDNESDAY", mealType: "DINNER" },
            // Thursday
            { id: "item-204a", name: "Steamed Pork Buns & Green Tea", description: "Fluffy steamed nikuman buns filled with seasoned pork, served with hot sencha green tea.", category: "Starters", price: 1500, imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "THURSDAY", mealType: "BREAKFAST" },
            { id: "item-204b", name: "Pork Bone Tonkotsu Ramen Lunch", description: "Rich 12-hour pork broth with handmade ramen noodles, chashu pork, and soft-boiled egg.", category: "Mains", price: 2800, imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "THURSDAY", mealType: "LUNCH" },
            { id: "item-204c", name: "Thursday Eel Unagi Bowl Dinner", description: "Grilled freshwater eel over seasoned rice with sweet unagi glaze.", category: "Mains", price: 3900, imageUrl: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "THURSDAY", mealType: "DINNER" },
            // Friday
            { id: "item-205a", name: "Fluffy Japanese Soufflé Pancakes", description: "Ultra-fluffy soufflé pancakes topped with whip cream and kuromitsu syrup.", category: "Starters", price: 1900, imageUrl: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "FRIDAY", mealType: "BREAKFAST" },
            { id: "item-205b", name: "Chirashi Seafood Bowl Lunch", description: "Assorted fresh sashimi over sushi rice with ikura (salmon roe) and shiso leaf.", category: "Mains", price: 4800, imageUrl: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "FRIDAY", mealType: "LUNCH" },
            { id: "item-205c", name: "Friday Master Omakase Dinner", description: "10-piece luxury Omakase selection prepared by Master Kenji.", category: "Mains", price: 7500, imageUrl: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "FRIDAY", mealType: "DINNER" },
            // À la carte
            { id: "item-5", name: "Edamame with Sea Salt", description: "Steamed young soybeans sprinkled with coarse sea salt.", category: "Starters", price: 800, imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-6", name: "Salmon & Tuna Nigiri Combo", description: "4 pieces of wild salmon and 4 pieces of bluefin tuna nigiri.", category: "Mains", price: 2800, imageUrl: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-7", name: "Matcha Green Tea Ice Cream", description: "Artisanal Japanese green tea gelato served with red bean paste.", category: "Desserts", price: 900, imageUrl: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" }
        ]
    },
    {
        id: "demo-3",
        userId: "u3333333-3333-3333-3333-333333333333",
        name: "Sophie Dubois",
        email: "sophie@cheflaunch.com",
        phone: "+1 555-0103",
        bio: "Farm-to-table French cuisine. Trained at Le Cordon Bleu Paris, bringing classic French techniques and local organic ingredients to your kitchen.",
        cuisineType: "French",
        rating: "4.8",
        reviews: 76,
        profileImage: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&auto=format&fit=crop",
        menus: [
            { id: "m6", title: "Classic French Bistro Box", description: "Beef Bourguignon, Ratatouille & Crème Brûlée. Ready to heat and serve.", price: 5500, subscriptionType: "one_time", imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&auto=format&fit=crop" },
            { id: "m7", title: "Monthly Pâtisserie Box", description: "Monthly delivery of 12 freshly baked French pastries — croissants, éclairs & macarons.", price: 12900, subscriptionType: "monthly", imageUrl: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop" },
            { id: "m7b", title: "Weekly Gourmet Dinner Prep", description: "Weekly 3-course French dinner kits with step-by-step plating guide.", price: 9900, subscriptionType: "weekly", imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop" }
        ],
        menuItems: [
            { id: "item-301a", name: "Butter Croissant & Café au Lait", description: "Flaky butter croissant baked daily, served with hot French roast coffee.", category: "Starters", price: 1400, imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "MONDAY", mealType: "BREAKFAST" },
            { id: "item-301b", name: "Classic Quiche Lorraine Lunch", description: "Savory pastry crust filled with smoked bacon, gruyère cheese, and rich custard.", category: "Mains", price: 2900, imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "MONDAY", mealType: "LUNCH" },
            { id: "item-301c", name: "Traditional Beef Bourguignon Dinner", description: "Slow-braised beef shanks in red wine broth with pearl onions and lardons.", category: "Mains", price: 5500, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "MONDAY", mealType: "DINNER" },
            { id: "item-302a", name: "Brioche French Toast with Berries", description: "Gold brioche soaked in vanilla custard and topped with fresh raspberries.", category: "Starters", price: 1600, imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "TUESDAY", mealType: "BREAKFAST" },
            { id: "item-302b", name: "Salade Niçoise Deluxe Lunch", description: "Seared ahi tuna over haricots verts, fingerling potatoes, olives, and soft-boiled egg.", category: "Mains", price: 3400, imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "TUESDAY", mealType: "LUNCH" },
            { id: "item-302c", name: "Duck Confit & Potato Sarladaise Dinner", description: "Crispy duck leg confit served with garlic duck-fat potatoes.", category: "Mains", price: 5800, imageUrl: "https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "TUESDAY", mealType: "DINNER" },
            { id: "item-303a", name: "Pain au Chocolat & Milk", description: "Flaky puff pastry filled with dark Belgian chocolate bars.", category: "Starters", price: 1500, imageUrl: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "WEDNESDAY", mealType: "BREAKFAST" },
            { id: "item-303b", name: "Croque Monsieur & Fries Lunch", description: "Toasted brioche sandwich with Paris ham, béchamel, and melted Gruyère.", category: "Mains", price: 2800, imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "WEDNESDAY", mealType: "LUNCH" },
            { id: "item-303c", name: "Coq au Vin & Herb Rice Dinner", description: "Chicken braised in Burgundy wine with mushrooms and bacon.", category: "Mains", price: 5200, imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "WEDNESDAY", mealType: "DINNER" },
            { id: "item-304a", name: "Omelette aux Fines Herbes", description: "Soft French rolled omelette with tarragon, chervil, parsley, and chives.", category: "Starters", price: 1700, imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "THURSDAY", mealType: "BREAKFAST" },
            { id: "item-304b", name: "French Onion Soup & Crusty Baguette Lunch", description: "Caramelized onion broth topped with toasted baguette and melted Gruyère.", category: "Mains", price: 2600, imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "THURSDAY", mealType: "LUNCH" },
            { id: "item-304c", name: "Bouillabaisse Seafood Stew Dinner", description: "Provençal fish stew with prawns, mussels, snapper, and saffron rouille.", category: "Mains", price: 6200, imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "THURSDAY", mealType: "DINNER" },
            { id: "item-305a", name: "Crêpes Suzette & Orange Syrup", description: "Thin French crêpes flambéed with Grand Marnier and fresh orange butter.", category: "Starters", price: 1800, imageUrl: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "FRIDAY", mealType: "BREAKFAST" },
            { id: "item-305b", name: "Ratatouille & Herb Roasted Chicken Lunch", description: "Provençal stewed vegetables served alongside roasted organic chicken breast.", category: "Mains", price: 3200, imageUrl: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "FRIDAY", mealType: "LUNCH" },
            { id: "item-305c", name: "Steak Frites with Béarnaise Dinner", description: "Seared ribeye steak served with crispy hand-cut fries and tarragon béarnaise.", category: "Mains", price: 6400, imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop", isAvailable: true, type: "SET_MENU", dayOfWeek: "FRIDAY", mealType: "DINNER" },
            { id: "item-31", name: "Escargots de Bourgogne", description: "Six wild Burgundy snails baked in garlic herb butter.", category: "Starters", price: 1800, imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-32", name: "Traditional Crème Brûlée", description: "Rich vanilla bean custard with caramelized sugar crust.", category: "Desserts", price: 1200, imageUrl: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-33", name: "Parisian Macaron Selection (6 pcs)", description: "Assorted French macarons: pistachio, salted caramel, raspberry & chocolate.", category: "Desserts", price: 1600, imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" }
        ]
    },
    {
        id: "demo-4",
        userId: "u4444444-4444-4444-4444-444444444444",
        name: "Carlos Mendez",
        email: "carlos@cheflaunch.com",
        phone: "+1 555-0104",
        bio: "Authentic Mexican street food elevated to fine dining. Third-generation chef bringing family recipes, artisanal salsas, and bold flavors to life.",
        cuisineType: "Mexican",
        rating: "4.7",
        reviews: 203,
        profileImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop",
        menus: [
            { id: "m8", title: "Taco Fiesta Pack (12 pcs)", description: "Handmade corn tortillas with 3 fillings: carnitas, pollo verde & roasted veggie.", price: 3500, subscriptionType: "one_time", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop" },
            { id: "m9", title: "Weekly Mexican Feast", description: "Rotating weekly menu of authentic Mexican dishes, feeding up to 4 people.", price: 7900, subscriptionType: "weekly", imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&auto=format&fit=crop" },
            { id: "m9b", title: "Monthly Oaxaca Tasting Box", description: "Artisanal moles, tamales, and hand-pressed tortillas delivered monthly.", price: 11500, subscriptionType: "monthly", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop" }
        ],
        menuItems: [
            { id: "item-401", name: "Fresh Guacamole & Tortilla Chips", description: "Hass avocado, lime juice, cilantro, red onion, served with warm house-made tortilla chips.", category: "Starters", price: 1100, imageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-402", name: "Slow-Cooked Carnitas Tacos (3 pcs)", description: "Braised pork shoulder, white onion, cilantro, and roasted salsa verde on corn tortillas.", category: "Mains", price: 2200, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-403", name: "Cinnamon Sugar Churros", description: "Crispy fried dough pastry coated in cinnamon sugar, served with warm dulce de leche dip.", category: "Desserts", price: 900, imageUrl: "https://images.unsplash.com/photo-1624371414361-e670ef488916?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-404", name: "Fresh Agua de Horchata", description: "Traditional sweet rice milk flavored with cinnamon and real vanilla bean.", category: "Beverages", price: 600, imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" }
        ]
    },
    {
        id: "demo-5",
        userId: "u5555555-5555-5555-5555-555555555555",
        name: "Priya Sharma",
        email: "priya@cheflaunch.com",
        phone: "+1 555-0105",
        bio: "Modern Indian chef blending aromatic spices and traditional regional techniques with contemporary, health-conscious presentation.",
        cuisineType: "Indian",
        rating: "4.9",
        reviews: 118,
        profileImage: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop",
        menus: [
            { id: "m10", title: "Indian Thali Experience", description: "Full vegetarian thali: 2 curries, dal, basmati rice, garlic naan & dessert.", price: 4200, subscriptionType: "one_time", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop" },
            { id: "m11", title: "Spice Box Subscription", description: "Weekly curated Indian meals with fresh organic spices and chutneys.", price: 8500, subscriptionType: "weekly", imageUrl: "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&auto=format&fit=crop" },
            { id: "m11b", title: "Monthly Curry Club", description: "Explore regional curries from Punjab to Kerala in a monthly 4-dish box.", price: 12500, subscriptionType: "monthly", imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop" }
        ],
        menuItems: [
            { id: "item-501", name: "Crispy Vegetable Samosas (4 pcs)", description: "Flaky pastry stuffed with spiced potatoes and green peas, served with mint & tamarind chutney.", category: "Starters", price: 1000, imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-502", name: "Butter Chicken Curry & Garlic Naan", description: "Tender chicken simmered in rich tomato butter cream sauce, served with freshly baked garlic naan.", category: "Mains", price: 2600, imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-503", name: "Gulab Jamun in Cardamom Syrup", description: "Warm milk-solid dumplings soaked in rose and cardamom aromatic syrup.", category: "Desserts", price: 800, imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-504", name: "Mango Lassi Smoothie", description: "Cool yogurt drink blended with Alphonso mango pulp and cardamom.", category: "Beverages", price: 600, imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" }
        ]
    },
    {
        id: "demo-6",
        userId: "u6666666-6666-6666-6666-666666666666",
        name: "Alex Papadopoulos",
        email: "alex@cheflaunch.com",
        phone: "+1 555-0106",
        bio: "Mediterranean fusion expert. From Greek moussaka to Lebanese mezze, taking food lovers on a coastal journey in every bite.",
        cuisineType: "Mediterranean",
        rating: "4.6",
        reviews: 89,
        profileImage: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop",
        menus: [
            { id: "m12", title: "Mediterranean Mezze Platter", description: "Hummus, baba ghanoush, falafel, warm pita & stuffed grape leaves.", price: 3800, subscriptionType: "one_time", imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop" },
            { id: "m13", title: "Monthly Med Box", description: "Monthly delivery of a rotating Mediterranean coastal feast.", price: 11900, subscriptionType: "monthly", imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop" },
            { id: "m13b", title: "Weekly Greek Island Prep", description: "Fresh grilled souvlaki, Greek salads & tzatziki meal plan delivered weekly.", price: 8200, subscriptionType: "weekly", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop" }
        ],
        menuItems: [
            { id: "item-601", name: "Traditional Greek Hummus & Warm Pita", description: "Creamy chickpea hummus drizzled with olive oil and paprika, served with toasted pita points.", category: "Starters", price: 1100, imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-602", name: "Grilled Chicken Souvlaki Skewers", description: "Marinated chicken skewers cooked over open flame, served with tzatziki and oregano fries.", category: "Mains", price: 2500, imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-603", name: "Honey Pistachio Baklava (3 pcs)", description: "Crispy phyllo dough layered with crushed pistachios and orange blossom honey syrup.", category: "Desserts", price: 950, imageUrl: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-604", name: "Greek Iced Frappé Coffee", description: "Whipped Greek coffee iced to perfection with creamy foam.", category: "Beverages", price: 550, imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" }
        ]
    },
    {
        id: "demo-7",
        userId: "u7777777-7777-7777-7777-777777777777",
        name: "Maya Lin",
        email: "maya@cheflaunch.com",
        phone: "+1 555-0107",
        bio: "Plant-based Asian Fusion chef crafting vibrant, nutrient-dense bowls, dumplings, and ramen using 100% organic vegan ingredients.",
        cuisineType: "Vegan & Asian Fusion",
        rating: "4.9",
        reviews: 165,
        profileImage: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop",
        menus: [
            { id: "m14", title: "Organic Vegan Dumpling Sampler", description: "24 handcrafted dumplings (shitake, edamame & kimchi) with dipping sauces.", price: 3900, subscriptionType: "one_time", imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop" },
            { id: "m15", title: "Weekly Plant-Power Meal Plan", description: "5 chef-crafted plant-based lunches & dinners delivered every Monday.", price: 9200, subscriptionType: "weekly", imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop" },
            { id: "m15b", title: "Monthly Wellness Soup & Noodle Box", description: "Nourishing artisanal broths, hand-pulled noodles & fermented toppings.", price: 11000, subscriptionType: "monthly", imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop" }
        ],
        menuItems: [
            { id: "item-701", name: "Organic Edamame Dumplings (6 pcs)", description: "Steamed green edamame and shiitake mushroom dumplings with sesame soy sauce.", category: "Starters", price: 1300, imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-702", name: "Plant-Power Teriyaki Tofu Bowl", description: "Pan-seared organic tofu, avocado, purple cabbage, edamame, and brown rice in glaze.", category: "Mains", price: 2300, imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-703", name: "Coconut Mango Sticky Rice", description: "Sweet sticky rice infused with coconut cream and served with ripe mango slices.", category: "Desserts", price: 900, imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-704", name: "Organic Iced Matcha Latte", description: "Japanese ceremonial grade matcha whisked with oat milk and agave nectar.", category: "Beverages", price: 650, imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" }
        ]
    },
    {
        id: "demo-8",
        userId: "u8888888-8888-8888-8888-888888888888",
        name: "Pierre Laurent",
        email: "pierre@cheflaunch.com",
        phone: "+1 555-0108",
        bio: "Master Pastry Chef from Lyon. Specializing in artisanal sourdough, decadent chocolate tarts, and delicate French breakfast spreads.",
        cuisineType: "French Bakery & Desserts",
        rating: "4.8",
        reviews: 134,
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
        menus: [
            { id: "m16", title: "Weekend Bakery Basket", description: "4 butter croissants, 2 pain au chocolat, sourdough loaf & house jam.", price: 3200, subscriptionType: "one_time", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop" },
            { id: "m17", title: "Weekly Artisan Bread Club", description: "Freshly baked specialty sourdough and brioche delivered twice a week.", price: 6800, subscriptionType: "weekly", imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&auto=format&fit=crop" }
        ],
        menuItems: [
            { id: "item-801", name: "Artisanal Butter Croissant Basket", description: "Two freshly baked French butter croissants served with strawberry compote.", category: "Starters", price: 1000, imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-802", name: "Savory Ham & Gruyère Sandwich", description: "French Paris ham, melted aged Gruyère, and dijonnaise on freshly baked sourdough.", category: "Mains", price: 2100, imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-803", name: "Decadent Belgian Chocolate Tart", description: "Rich dark chocolate ganache in a crisp sablé pastry shell.", category: "Desserts", price: 1200, imageUrl: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-804", name: "Fresh French Press Coffee", description: "Dark roast French press coffee with notes of cocoa and toasted hazelnut.", category: "Beverages", price: 500, imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" }
        ]
    },
    {
        id: "demo-9",
        userId: "u9999999-9999-9999-9999-999999999999",
        name: "Isabella Santos",
        email: "isabella@cheflaunch.com",
        phone: "+1 555-0109",
        bio: "Brazilian & Latin BBQ Specialist. Slow-cooked picanha, feijoada stew, and traditional churrasco sides full of rich flavor.",
        cuisineType: "Brazilian & Latin BBQ",
        rating: "4.7",
        reviews: 95,
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop",
        menus: [
            { id: "m18", title: "Churrasco Grill Box", description: "Flame-grilled Picanha, garlic yucca, cheese bread & chimichurri sauce.", price: 5800, subscriptionType: "one_time", imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop" },
            { id: "m19", title: "Weekly Latin Comfort Box", description: "Feijoada, cassava chips, farofa & guarana treats for the family.", price: 8800, subscriptionType: "weekly", imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop" }
        ],
        menuItems: [
            { id: "item-901", name: "Pão de Queijo (Cheese Bread 6 pcs)", description: "Golden Brazilian cassava flour cheese rolls baked fresh.", category: "Starters", price: 1100, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-902", name: "Flame-Grilled Picanha Steak Plate", description: "Sliced top sirloin cap grilled over open flames, served with farofa and chimichurri.", category: "Mains", price: 2900, imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-903", name: "Brazilian Brigadeiro Truffles", description: "Rich chocolate condensed milk truffles rolled in dark chocolate sprinkles.", category: "Desserts", price: 850, imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-904", name: "Guaraná Passionfruit Cooler", description: "Tropical sparkling Guaraná juice infused with fresh passionfruit pulp.", category: "Beverages", price: 600, imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" }
        ]
    },
    {
        id: "demo-10",
        userId: "u1010101-1010-1010-1010-101010101010",
        name: "Marcus Vance",
        email: "marcus@cheflaunch.com",
        phone: "+1 555-0110",
        bio: "New Orleans native bringing authentic Cajun, Creole, and Southern Soul Food. Famous for gumbo, jambalaya, and smoked brisket.",
        cuisineType: "Cajun & Southern Soul",
        rating: "4.9",
        reviews: 210,
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop",
        menus: [
            { id: "m20", title: "New Orleans Seafood Gumbo Kit", description: "Slow-simmered dark roux gumbo with shrimp, crab, and andouille sausage.", price: 4800, subscriptionType: "one_time", imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop" },
            { id: "m21", title: "Weekly Soul Food Sunday Box", description: "Smoked ribs, mac & cheese, collard greens, and cornbread for 4.", price: 9600, subscriptionType: "weekly", imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop" }
        ],
        menuItems: [
            { id: "item-1001", name: "Southern Buttermilk Fried Green Tomatoes", description: "Crispy cornmeal crusted green tomato slices served with cajun remoulade.", category: "Starters", price: 1200, imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-1002", name: "New Orleans Seafood Gumbo Bowl", description: "Dark roux gumbo loaded with gulf shrimp, lump crabmeat, and andouille sausage over rice.", category: "Mains", price: 2800, imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-1003", name: "Warm Pecan Pie with Vanilla Ice Cream", description: "Classic Southern pecan pie slice served with a scoop of Madagascar vanilla bean ice cream.", category: "Desserts", price: 1000, imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" },
            { id: "item-1004", name: "New Orleans Sweet Peach Tea", description: "Freshly brewed black tea infused with sweet Georgia peach nectar.", category: "Beverages", price: 500, imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop", isAvailable: true, type: "A_LA_CARTE" }
        ]
    }
];
export async function seedDatabase() {
    const connectionString = process.env.DATABASE_URL ||
        "postgresql://postgres:postgres@localhost:5432/chef_launcher";
    console.log("Starting database seeding script...");
    const sql = postgres(connectionString, { max: 1, connect_timeout: 3 });
    const db = drizzle(sql, { schema });
    try {
        console.log("Seeding users, chef profiles, and menus into PostgreSQL...");
        for (const chef of seedChefsData) {
            // 1. Upsert User
            const [insertedUser] = await db
                .insert(users)
                .values({
                email: chef.email,
                phone: chef.phone,
                passwordHash: "$2a$10$wE47mQ2B1K/S0HjK7Z5mU.f40lDk9eK3T7B4K8e9m0B1C2D3E4F5G",
                role: "chef",
            })
                .onConflictDoNothing()
                .returning();
            const userId = insertedUser?.id || chef.userId;
            // 2. Upsert Chef Profile
            const [insertedProfile] = await db
                .insert(chefProfiles)
                .values({
                userId: userId,
                name: chef.name,
                bio: chef.bio,
                cuisineType: chef.cuisineType,
                rating: chef.rating,
                profileImage: chef.profileImage,
            })
                .onConflictDoNothing()
                .returning();
            const chefProfileId = insertedProfile?.id || chef.id;
            // 3. Insert Menus
            for (const m of chef.menus) {
                await db
                    .insert(menus)
                    .values({
                    chefId: chefProfileId,
                    title: m.title,
                    description: m.description,
                    price: m.price,
                    subscriptionType: m.subscriptionType,
                })
                    .onConflictDoNothing();
            }
            // 4. Insert Menu Items
            if (chef.menuItems) {
                for (const mi of chef.menuItems) {
                    await db
                        .insert(menuItems)
                        .values({
                        chefId: chefProfileId,
                        name: mi.name,
                        description: mi.description,
                        category: mi.category,
                        price: mi.price,
                        imageUrl: mi.imageUrl,
                        isAvailable: mi.isAvailable ?? true,
                        type: mi.type,
                        dayOfWeek: mi.dayOfWeek,
                        mealType: mi.mealType,
                    })
                        .onConflictDoNothing();
                }
            }
        }
        console.log(`Successfully seeded ${seedChefsData.length} chefs and menus!`);
    }
    catch (err) {
        console.warn("[Seed Script Warning]: Could not reach live PostgreSQL database, skipping direct DB write.");
        console.warn("Reason:", err?.message || err);
    }
    finally {
        await sql.end();
    }
}
// Execute if run directly
if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`) {
    seedDatabase();
}
