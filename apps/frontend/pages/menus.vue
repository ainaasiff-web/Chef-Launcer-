<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { Search, ShoppingBag, Star, Utensils, Coffee, Sun, Moon, Sparkles, CheckCircle, ChefHat, ArrowRight } from 'lucide-vue-next'

const { fetchApi } = useApi()
const toast = useToast()

const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedDishNotice = ref<string | null>(null)
const loading = ref(true)

const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages', 'Weekly Packages']

const defaultDishImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target && target.src !== defaultDishImage) {
    target.src = defaultDishImage
  }
}

const formatPrice = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '0'
  const num = Number(val)
  if (isNaN(num)) return '0'
  const finalVal = num > 100000 ? Math.round(num / 100) : num
  return finalVal.toLocaleString('en-PK')
}

// Master list of chef menus & dishes with realistic PKR prices
const initialDishes = [
  // Starters
  {
    id: 'menu-alc-1',
    name: 'Bruschetta al Pomodoro',
    description: 'Toasted artisanal sourdough with ripe vine tomatoes, fresh basil, and extra virgin olive oil.',
    category: 'Starters',
    price: 1500,
    chefId: 'demo-1',
    chefName: 'Marco Rossi',
    chefCuisine: 'Italian',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-5',
    name: 'Edamame with Sea Salt',
    description: 'Steamed young soybeans sprinkled with coarse Maldon sea salt.',
    category: 'Starters',
    price: 1200,
    chefId: 'demo-2',
    chefName: 'Kenji Tanaka',
    chefCuisine: 'Japanese',
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-10',
    name: 'French Onion Soup',
    description: 'Slow-caramelized onion soup topped with melted Gruyère cheese and toasted baguette.',
    category: 'Starters',
    price: 1800,
    chefId: 'demo-3',
    chefName: 'Sophie Dubois',
    chefCuisine: 'French',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-11',
    name: 'Chicken Tikka Skewers',
    description: 'Tender chicken marinated in spiced yogurt and grilled over hot coals.',
    category: 'Starters',
    price: 2400,
    chefId: 'demo-5',
    chefName: 'Priya Sharma',
    chefCuisine: 'Indian',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-12',
    name: 'Truffle Arancini Balls',
    description: 'Crispy fried risottos balls filled with wild mushrooms and melted mozzarella.',
    category: 'Starters',
    price: 2200,
    chefId: 'demo-1',
    chefName: 'Marco Rossi',
    chefCuisine: 'Italian',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&auto=format&fit=crop',
    isAvailable: true,
  },

  // Mains
  {
    id: 'menu-alc-2',
    name: 'Classic Spaghetti Carbonara',
    description: 'Guanciale, Pecorino Romano, fresh egg yolks, and freshly cracked black pepper.',
    category: 'Mains',
    price: 3200,
    chefId: 'demo-1',
    chefName: 'Marco Rossi',
    chefCuisine: 'Italian',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-6',
    name: 'Salmon & Tuna Nigiri Combo',
    description: '4 pieces of wild salmon and 4 pieces of bluefin tuna nigiri with fresh wasabi.',
    category: 'Mains',
    price: 4800,
    chefId: 'demo-2',
    chefName: 'Kenji Tanaka',
    chefCuisine: 'Japanese',
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-13',
    name: 'Slow-Cooked Ossobuco alla Milanese',
    description: 'Tender braised veal shanks served over saffron-infused Carnaroli risotto.',
    category: 'Mains',
    price: 7800,
    chefId: 'demo-1',
    chefName: 'Marco Rossi',
    chefCuisine: 'Italian',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-14',
    name: 'Wagyu Beef Sukiyaki Bowl',
    description: 'Thinly sliced A5 Wagyu beef simmered with tofu and shiitake mushrooms in sweet dashi.',
    category: 'Mains',
    price: 9800,
    chefId: 'demo-2',
    chefName: 'Kenji Tanaka',
    chefCuisine: 'Japanese',
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-15',
    name: 'Butter Chicken & Garlic Naan',
    description: 'Rich, creamy tomato gravy with tender tandoori chicken, served with hot garlic butter naan.',
    category: 'Mains',
    price: 3800,
    chefId: 'demo-5',
    chefName: 'Priya Sharma',
    chefCuisine: 'Indian',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-16',
    name: 'Tonkotsu Ramen Bowl',
    description: 'Rich 12-hour pork broth with handmade ramen noodles, chashu pork, and soft-boiled egg.',
    category: 'Mains',
    price: 3800,
    chefId: 'demo-2',
    chefName: 'Kenji Tanaka',
    chefCuisine: 'Japanese',
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-17',
    name: 'Duck Confit with Herb Potatoes',
    description: 'Crispy skin duck leg cooked in its own fat, served with garlic roasted potatoes.',
    category: 'Mains',
    price: 7500,
    chefId: 'demo-3',
    chefName: 'Sophie Dubois',
    chefCuisine: 'French',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?w=800&auto=format&fit=crop',
    isAvailable: true,
  },

  // Desserts
  {
    id: 'menu-alc-3',
    name: 'Traditional Tiramisu',
    description: 'Savoiardi ladyfingers dipped in espresso with mascarpone cream and cocoa powder.',
    category: 'Desserts',
    price: 1800,
    chefId: 'demo-1',
    chefName: 'Marco Rossi',
    chefCuisine: 'Italian',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-7',
    name: 'Matcha Green Tea Ice Cream',
    description: 'Artisanal Japanese green tea gelato served with sweet red bean paste.',
    category: 'Desserts',
    price: 1500,
    chefId: 'demo-2',
    chefName: 'Kenji Tanaka',
    chefCuisine: 'Japanese',
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-18',
    name: 'Classic Crème Brûlée',
    description: 'Rich vanilla bean custard topped with a contrasting layer of hard caramelized sugar.',
    category: 'Desserts',
    price: 2200,
    chefId: 'demo-3',
    chefName: 'Sophie Dubois',
    chefCuisine: 'French',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-19',
    name: 'Fluffy Japanese Soufflé Pancakes',
    description: 'Ultra-fluffy soufflé pancakes topped with whip cream and kuromitsu syrup.',
    category: 'Desserts',
    price: 2500,
    chefId: 'demo-2',
    chefName: 'Kenji Tanaka',
    chefCuisine: 'Japanese',
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800&auto=format&fit=crop',
    isAvailable: true,
  },

  // Beverages
  {
    id: 'menu-alc-4',
    name: 'San Pellegrino Mineral Water',
    description: 'Chilled 750ml glass bottle.',
    category: 'Beverages',
    price: 800,
    chefId: 'demo-1',
    chefName: 'Marco Rossi',
    chefCuisine: 'Italian',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-20',
    name: 'Fresh Mango Lassi',
    description: 'Chilled yogurt smoothie blended with ripe Alphonso mangoes and cardamom.',
    category: 'Beverages',
    price: 900,
    chefId: 'demo-5',
    chefName: 'Priya Sharma',
    chefCuisine: 'Indian',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-alc-21',
    name: 'Artisanal Double Espresso',
    description: 'Freshly pulled Italian espresso shot crafted from 100% Arabica beans.',
    category: 'Beverages',
    price: 700,
    chefId: 'demo-1',
    chefName: 'Marco Rossi',
    chefCuisine: 'Italian',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop',
    isAvailable: true,
  },

  // Weekly Packages
  {
    id: 'menu-pkg-1',
    name: 'Grand Roman 4-Course Dinner',
    description: 'Complete feast featuring Bruschetta, Carbonara, Slow-Cooked Ossobuco, and Tiramisu.',
    category: 'Weekly Packages',
    price: 9500,
    chefId: 'demo-1',
    chefName: 'Marco Rossi',
    chefCuisine: 'Italian',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-pkg-2',
    name: 'Friday Master Omakase Package',
    description: '10-piece luxury Omakase sushi selection prepared by Master Kenji.',
    category: 'Weekly Packages',
    price: 12500,
    chefId: 'demo-2',
    chefName: 'Kenji Tanaka',
    chefCuisine: 'Japanese',
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'menu-pkg-3',
    name: 'Parisian 3-Course Gourmet Dinner',
    description: 'French Onion Soup, Crispy Duck Confit, and finished with Vanilla Crème Brûlée.',
    category: 'Weekly Packages',
    price: 10500,
    chefId: 'demo-3',
    chefName: 'Sophie Dubois',
    chefCuisine: 'French',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop',
    isAvailable: true,
  },
]

const dishesList = ref<any[]>(initialDishes)

onMounted(async () => {
  try {
    const { data: menuItemsRes } = await fetchApi<any>('/menu-items')
    const fetchedItems = menuItemsRes?.data || menuItemsRes
    if (Array.isArray(fetchedItems) && fetchedItems.length > 0) {
      const formatted = fetchedItems.map(item => ({
        id: item.id,
        name: item.name || item.title,
        description: item.description || 'Delicately prepared menu item.',
        category: item.category || (item.type === 'SET_MENU' ? 'Weekly Packages' : 'Mains'),
        price: item.price,
        chefId: item.chefId || 'demo-1',
        chefName: item.chef?.name || 'Chef Partner',
        chefCuisine: item.chef?.cuisineType || 'International',
        rating: item.chef?.rating || 4.9,
        imageUrl: item.imageUrl || item.image_url || defaultDishImage,
        isAvailable: item.isAvailable !== false,
      }))

      // Merge fetched items into list avoiding duplicate IDs
      formatted.forEach(item => {
        if (!dishesList.value.some(d => d.id === item.id)) {
          dishesList.value.unshift(item)
        }
      })
    }
  } catch (err) {
    console.warn('Using default demo menu items:', err)
  } finally {
    loading.value = false
  }
})

const filteredDishes = computed(() => {
  let list = dishesList.value

  if (selectedCategory.value !== 'All') {
    list = list.filter(d => d.category?.toLowerCase() === selectedCategory.value.toLowerCase())
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.chefName?.toLowerCase().includes(q) ||
      d.category?.toLowerCase().includes(q)
    )
  }

  return list
})

const handleSelectDish = async (dish: any) => {
  if (dish.isAvailable === false) return

  const dishTitle = dish.name || dish.title
  const priceFormatted = formatPrice(dish.price)
  let orderNum = `ORD-${Math.floor(10000 + Math.random() * 90000)}`

  // Send order creation to API
  try {
    const { data: orderRes } = await fetchApi<any>('/orders', {
      method: 'POST',
      body: {
        dishName: dishTitle,
        price: dish.price,
        category: dish.category,
        chefId: dish.chefId,
        status: 'confirmed',
        imageUrl: dish.imageUrl || defaultDishImage,
      }
    })
    if (orderRes?.order?.orderNumber || orderRes?.order?.order_number) {
      orderNum = orderRes.order.orderNumber || orderRes.order.order_number
    }
  } catch (err) {
    console.log('Processed order locally:', err)
  }

  toast.addToast({
    title: `Order #${orderNum} added successfully! 🎉`,
    description: `Added "${dishTitle}" (Rs. ${priceFormatted}) to your order.`,
    type: 'success',
    duration: 5000,
  })

  selectedDishNotice.value = `Order #${orderNum} confirmed for "${dishTitle}" (Rs. ${priceFormatted})`
  setTimeout(() => {
    selectedDishNotice.value = null
  }, 5000)
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Hero Header -->
      <div class="relative bg-neutral-900 rounded-3xl overflow-hidden p-8 md:p-12 mb-12 text-white shadow-2xl">
        <div class="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop"
            class="w-full h-full object-cover"
            alt="Chef launcher menus"
          >
          <div class="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-semibold text-orange-300 mb-6">
            <Sparkles class="w-4 h-4 text-orange-400" />
            Curated Culinary Catalog
          </div>

          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Explore Chef Menus & <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Signature Dishes</span>
          </h1>

          <p class="text-neutral-300 text-lg mb-8 leading-relaxed max-w-2xl">
            Browse handcrafted starter courses, main entrees, artisanal desserts, and full multi-course weekly packages prepared fresh by top private chefs.
          </p>

          <!-- Search Bar -->
          <div class="relative max-w-xl">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
              <Search class="w-5 h-5" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="block w-full pl-11 pr-4 py-4 rounded-2xl bg-white/95 text-neutral-900 placeholder-neutral-400 font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-all shadow-lg text-sm"
              placeholder="Search by dish name, category, or chef..."
            >
          </div>
        </div>
      </div>

      <!-- Feedback Banner -->
      <div v-if="selectedDishNotice" class="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 font-medium animate-fade-in shadow-sm">
        <CheckCircle class="w-5 h-5 text-emerald-600 shrink-0" />
        <span>{{ selectedDishNotice }}</span>
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex flex-wrap items-center gap-2 mb-10 pb-2 overflow-x-auto">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap',
            selectedCategory === cat
              ? 'bg-orange-500 text-white shadow-md scale-105'
              : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Dish Catalog Grid -->
      <div v-if="filteredDishes.length === 0" class="text-center py-20 bg-white rounded-3xl border border-neutral-100 shadow-sm">
        <Utensils class="w-12 h-12 text-neutral-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-neutral-900 mb-1">No dishes match your search</h3>
        <p class="text-neutral-500 text-sm">Try selecting a different category or refining your search term.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="dish in filteredDishes"
          :key="dish.id"
          class="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
        >
          <div>
            <!-- Image & Badges -->
            <div class="h-56 bg-neutral-100 relative overflow-hidden">
              <img
                :src="dish.imageUrl || defaultDishImage"
                @error="handleImageError"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                :alt="dish.name"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent"></div>

              <!-- Category Badge -->
              <div class="absolute top-3 left-3">
                <span class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-xl text-xs font-bold text-neutral-900 shadow-xs">
                  {{ dish.category }}
                </span>
              </div>

              <!-- Price Tag in PKR -->
              <div class="absolute top-3 right-3 bg-neutral-950/90 text-white backdrop-blur-sm px-3.5 py-1.5 rounded-xl font-extrabold text-sm shadow-md">
                Rs. {{ formatPrice(dish.price) }}
              </div>

              <!-- Chef link on bottom left -->
              <NuxtLink
                :to="`/chefs/${dish.chefId}`"
                class="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl text-white hover:bg-orange-500 transition-colors"
              >
                <ChefHat class="w-3.5 h-3.5 text-orange-400" />
                <span class="text-xs font-semibold">{{ dish.chefName }}</span>
              </NuxtLink>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div class="flex items-center justify-between gap-2 mb-2">
                <h3 class="text-xl font-bold text-neutral-900 leading-snug">{{ dish.name }}</h3>
              </div>
              <p class="text-neutral-500 text-xs leading-relaxed mb-4 line-clamp-3">
                {{ dish.description }}
              </p>
            </div>
          </div>

          <!-- Select Dish Button -->
          <div class="px-6 pb-6 pt-0">
            <button
              @click="handleSelectDish(dish)"
              :disabled="dish.isAvailable === false"
              :class="[
                'w-full py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm',
                dish.isAvailable !== false
                  ? 'bg-neutral-900 hover:bg-orange-500 text-white hover:shadow-orange-500/25'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              ]"
            >
              <ShoppingBag class="w-4 h-4" />
              <span>Select Dish · Rs. {{ formatPrice(dish.price) }}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
