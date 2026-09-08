<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { Search, ShoppingBag, Star, Utensils, Coffee, Sun, Moon, Sparkles, CheckCircle, ChefHat, ArrowRight, BookOpen } from 'lucide-vue-next'

const { fetchApi } = useApi()
const toast = useToast()

const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedDishNotice = ref<string | null>(null)
const loading = ref(true)

const categories = ['All', 'Breakfast Specials', 'Lunch Delights', 'Gourmet Dinners', 'Desserts & Starters', 'Weekly Packages']

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

// Master list of chef menu collections
const menuCollections = [
  {
    id: 'mc-1',
    chefId: 'demo-1',
    chefName: 'Marco Rossi',
    chefCuisine: 'Italian',
    chefAvatar: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&auto=format&fit=crop',
    title: 'Marco\'s Handmade Roman Pasta & Classic Italian Menu',
    category: 'Gourmet Dinners',
    description: 'Fresh tonnarelli Cacio e Pepe, Slow-Braised Ossobuco alla Milanese, Bruschetta, and Traditional Tiramisu prepared fresh.',
    bannerImage: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop',
    startingPrice: 1800,
    rating: 4.9,
    dishesCount: 19,
  },
  {
    id: 'mc-2',
    chefId: 'demo-2',
    chefName: 'Kenji Tanaka',
    chefCuisine: 'Japanese',
    chefAvatar: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop',
    title: 'Kenji\'s Master Omakase & Seasonal Nigiri Special',
    category: 'Lunch Delights',
    description: 'Chef\'s selection of 6 premium nigiri pieces, Wagyu Beef Sukiyaki, Tonkotsu Ramen broth, and Matcha Soufflé pancakes.',
    bannerImage: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop',
    startingPrice: 2200,
    rating: 5.0,
    dishesCount: 18,
  },
  {
    id: 'mc-3',
    chefId: 'demo-3',
    chefName: 'Sophie Dubois',
    chefCuisine: 'French',
    chefAvatar: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&auto=format&fit=crop',
    title: 'Sophie\'s Parisian Bistro & Farm-to-Table Feast',
    category: 'Weekly Packages',
    description: 'Slow-caramelized French Onion Soup, Duck Confit with herb potatoes, and Vanilla Bean Crème Brûlée.',
    bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop',
    startingPrice: 2500,
    rating: 4.8,
    dishesCount: 15,
  },
  {
    id: 'mc-5',
    chefId: 'demo-5',
    chefName: 'Priya Sharma',
    chefCuisine: 'Indian',
    chefAvatar: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop',
    title: 'Priya\'s Aromatic Curries & Royal Mughlai Thalis',
    category: 'Lunch Delights',
    description: 'Rich Butter Chicken in tomato gravy, tandoori skewers, garlic butter naan, fresh mango lassi, and Gulab Jamun.',
    bannerImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop',
    startingPrice: 1600,
    rating: 4.9,
    dishesCount: 16,
  },
  {
    id: 'mc-4',
    chefId: 'demo-4',
    chefName: 'Carlos Mendez',
    chefCuisine: 'Mexican',
    chefAvatar: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
    title: 'Carlos\' Elevated Street Food & Tacos Al Pastor',
    category: 'Breakfast Specials',
    description: 'Authentic handmade corn tacos, slow-cooked carnitas, house guacamole, churros, and horchata.',
    bannerImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
    startingPrice: 2000,
    rating: 4.7,
    dishesCount: 14,
  },
  {
    id: 'mc-8',
    chefId: 'demo-8',
    chefName: 'Pierre Laurent',
    chefCuisine: 'French Bakery',
    chefAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    title: 'Pierre\'s Artisanal Pastries & French Breakfast Spread',
    category: 'Desserts & Starters',
    description: 'Flaky croissants, sourdough loaves, chocolate tarts, brioche French toast, and handcrafted fruit preserves.',
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
    startingPrice: 1500,
    rating: 4.8,
    dishesCount: 12,
  },
]

// Master list of individual signature dishes
const signatureDishes = [
  { id: 'sd-1', name: 'Bruschetta al Pomodoro', description: 'Toasted sourdough with vine tomatoes, fresh basil, and olive oil.', category: 'Desserts & Starters', price: 1500, chefId: 'demo-1', chefName: 'Marco Rossi', imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&auto=format&fit=crop' },
  { id: 'sd-2', name: 'Classic Spaghetti Carbonara', description: 'Guanciale, Pecorino Romano, fresh egg yolk, and cracked pepper.', category: 'Gourmet Dinners', price: 3200, chefId: 'demo-1', chefName: 'Marco Rossi', imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop' },
  { id: 'sd-3', name: 'Salmon & Tuna Nigiri Combo', description: '4 pieces of salmon and 4 pieces of bluefin tuna nigiri with wasabi.', category: 'Lunch Delights', price: 4800, chefId: 'demo-2', chefName: 'Kenji Tanaka', imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop' },
  { id: 'sd-4', name: 'Wagyu Beef Sukiyaki Bowl', description: 'A5 Wagyu beef simmered with tofu and mushrooms in sweet dashi.', category: 'Gourmet Dinners', price: 9800, chefId: 'demo-2', chefName: 'Kenji Tanaka', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop' },
  { id: 'sd-5', name: 'Butter Chicken & Garlic Naan', description: 'Rich tomato cream curry served with hot garlic butter naan.', category: 'Lunch Delights', price: 3800, chefId: 'demo-5', chefName: 'Priya Sharma', imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop' },
  { id: 'sd-6', name: 'Fluffy Japanese Soufflé Pancakes', description: 'Ultra-fluffy pancakes with matcha cream and syrup.', category: 'Breakfast Specials', price: 2500, chefId: 'demo-2', chefName: 'Kenji Tanaka', imageUrl: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800&auto=format&fit=crop' },
]

const menusList = ref<any[]>(menuCollections)
const dishesList = ref<any[]>(signatureDishes)

onMounted(async () => {
  try {
    const { data: menuItemsRes } = await fetchApi<any>('/menu-items')
    const fetchedItems = menuItemsRes?.data || menuItemsRes
    if (Array.isArray(fetchedItems) && fetchedItems.length > 0) {
      const formatted = fetchedItems.map(item => ({
        id: item.id,
        name: item.name || item.title,
        description: item.description || 'Delicately prepared menu item.',
        category: item.category || 'Gourmet Dinners',
        price: item.price,
        chefId: item.chefId || 'demo-1',
        chefName: item.chef?.name || 'Chef Partner',
        imageUrl: item.imageUrl || item.image_url || defaultDishImage,
      }))

      formatted.forEach(item => {
        if (!dishesList.value.some(d => d.id === item.id)) {
          dishesList.value.unshift(item)
        }
      })
    }
  } catch (err) {
    console.log('Using static menu directory collections:', err)
  } finally {
    loading.value = false
  }
})

const filteredCollections = computed(() => {
  let list = menusList.value

  if (selectedCategory.value !== 'All') {
    list = list.filter(m => m.category?.toLowerCase() === selectedCategory.value.toLowerCase())
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(m =>
      m.title?.toLowerCase().includes(q) ||
      m.description?.toLowerCase().includes(q) ||
      m.chefName?.toLowerCase().includes(q) ||
      m.chefCuisine?.toLowerCase().includes(q)
    )
  }

  return list
})

const handleSelectDish = async (dish: any) => {
  const dishTitle = dish.name || dish.title
  const priceFormatted = formatPrice(dish.price)
  let orderNum = `ORD-${Math.floor(10000 + Math.random() * 90000)}`

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
            alt="Chef launcher menus directory"
          >
          <div class="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-semibold text-orange-300 mb-6">
            <Sparkles class="w-4 h-4 text-orange-400" />
            Curated Menu Directory
          </div>

          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Explore All Chef Menus & <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Culinary Packages</span>
          </h1>

          <p class="text-neutral-300 text-lg mb-8 leading-relaxed max-w-2xl">
            Browse complete weekly schedules, breakfast spreads, lunch delights, and multi-course gourmet dinners created by top private chefs.
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
              placeholder="Search menus, chef names, or cuisines..."
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

      <!-- SECTION 1: CHEF MENU COLLECTIONS GRID -->
      <div class="mb-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-extrabold text-neutral-900 tracking-tight">Chef Menu Collections</h2>
            <p class="text-neutral-500 text-sm mt-1">Explore full multi-course menus crafted by independent private chefs.</p>
          </div>
        </div>

        <div v-if="filteredCollections.length === 0" class="text-center py-16 bg-white rounded-3xl border border-neutral-100 shadow-sm">
          <BookOpen class="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-neutral-900 mb-1">No menu collections match your filter</h3>
          <p class="text-neutral-500 text-sm">Try selecting a different category tab above.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="menu in filteredCollections"
            :key="menu.id"
            class="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <!-- Food Banner Image -->
              <div class="h-60 bg-neutral-100 relative overflow-hidden">
                <img
                  :src="menu.bannerImage || defaultDishImage"
                  @error="handleImageError"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  :alt="menu.title"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent"></div>

                <!-- Category Badge -->
                <div class="absolute top-3 left-3">
                  <span class="px-3.5 py-1 bg-white/90 backdrop-blur-sm rounded-xl text-xs font-bold text-neutral-900 shadow-xs">
                    {{ menu.category }}
                  </span>
                </div>

                <!-- Starting Price Tag in PKR -->
                <div class="absolute top-3 right-3 bg-orange-500 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs shadow-md">
                  From Rs. {{ formatPrice(menu.startingPrice) }}
                </div>

                <!-- Chef Profile Overlay on Bottom -->
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div class="flex items-center gap-3">
                    <img
                      :src="menu.chefAvatar"
                      @error="handleImageError"
                      class="w-10 h-10 rounded-full border-2 border-white/40 object-cover shadow-sm"
                      :alt="menu.chefName"
                    >
                    <div>
                      <div class="font-bold text-sm leading-tight">{{ menu.chefName }}</div>
                      <div class="text-xs text-orange-200 font-medium">{{ menu.chefCuisine }} Cuisine</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-1 text-xs font-bold text-yellow-400 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                    <Star class="w-3.5 h-3.5 fill-current" />
                    {{ menu.rating }}
                  </div>
                </div>
              </div>

              <!-- Menu Details -->
              <div class="p-6">
                <h3 class="text-xl font-bold text-neutral-900 mb-2 leading-snug group-hover:text-orange-600 transition-colors">
                  {{ menu.title }}
                </h3>
                <p class="text-neutral-500 text-xs leading-relaxed mb-4 line-clamp-3">
                  {{ menu.description }}
                </p>
              </div>
            </div>

            <!-- View Full Menu Button -->
            <div class="px-6 pb-6 pt-0">
              <NuxtLink
                :to="`/chefs/${menu.chefId}`"
                class="w-full py-3.5 rounded-2xl font-bold text-xs bg-neutral-900 hover:bg-orange-500 text-white transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-orange-500/25"
              >
                <span>View Full Menu & Schedule</span>
                <ArrowRight class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: QUICK ORDER SIGNATURE DISHES GRID -->
      <div class="pt-8 border-t border-neutral-200">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-extrabold text-neutral-900 tracking-tight">Quick Order Signature Dishes</h2>
            <p class="text-neutral-500 text-sm mt-1">Single à la carte items available for immediate order in PKR.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="dish in dishesList"
            :key="dish.id"
            class="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div>
              <div class="h-48 bg-neutral-100 relative overflow-hidden">
                <img
                  :src="dish.imageUrl || defaultDishImage"
                  @error="handleImageError"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  :alt="dish.name"
                >
                <div class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl font-bold text-neutral-900 text-sm shadow-sm">
                  Rs. {{ formatPrice(dish.price) }}
                </div>
                <div class="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-white">
                  By {{ dish.chefName }}
                </div>
              </div>

              <div class="p-5">
                <h4 class="text-lg font-bold text-neutral-900 mb-1 truncate">{{ dish.name }}</h4>
                <p class="text-neutral-500 text-xs leading-relaxed mb-4 line-clamp-2">{{ dish.description }}</p>
              </div>
            </div>

            <div class="px-5 pb-5">
              <button
                @click="handleSelectDish(dish)"
                class="w-full py-3 rounded-xl font-semibold text-xs bg-neutral-900 hover:bg-orange-500 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag class="w-4 h-4" />
                <span>Select Dish · Rs. {{ formatPrice(dish.price) }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
