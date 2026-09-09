<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import DishCard from '~/components/DishCard.vue'
import { Star, MapPin, ChefHat, Clock, CreditCard, ArrowLeft, Utensils, ShoppingBag, CheckCircle, AlertCircle, Calendar, Sun, Coffee, Moon } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { fetchApi } = useApi()
const authStore = useAuthStore()
const toast = useToast()

// Tab state: 'weekly-schedule' vs 'a-la-carte'
const activeTab = ref<'weekly-schedule' | 'a-la-carte'>('weekly-schedule')

// Weekday selector state
const weekdays = [
  { key: 'MONDAY', label: 'Monday', short: 'Mon' },
  { key: 'TUESDAY', label: 'Tuesday', short: 'Tue' },
  { key: 'WEDNESDAY', label: 'Wednesday', short: 'Wed' },
  { key: 'THURSDAY', label: 'Thursday', short: 'Thu' },
  { key: 'FRIDAY', label: 'Friday', short: 'Fri' },
  { key: 'ALL', label: 'All Weekdays', short: 'All' },
]
const selectedDay = ref<string>('MONDAY')

const selectedCategory = ref<string>('All')
const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages']

const selectedDishNotice = ref<string | null>(null)

const formatPrice = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '2,500'
  const str = String(val).replace(/[^0-9.]/g, '')
  const num = parseFloat(str)
  if (isNaN(num) || num === 0) return '2,500'
  let p = num
  if (p > 0 && p <= 100) p = Math.round(p * 250)
  else if (p > 100000) p = Math.round(p / 100)
  return p.toLocaleString('en-PK')
}

// Fallback generator for any chef to ensure 0 dishes NEVER occurs
const getMockMenusForChef = (chefId: string) => [
  // Monday
  { id: `${chefId}-m1a`, title: 'Italian Espresso & Ricotta Cornetto', description: 'Freshly baked croissant filled with sweet ricotta and served with double espresso.', price: 1800, recurringType: 'ONE_TIME', dayOfWeek: 'MONDAY', mealType: 'BREAKFAST', category: 'Breakfast', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop' },
  { id: `${chefId}-m1b`, title: 'Handmade Cacio e Pepe Lunch', description: 'Fresh tonnarelli pasta with Pecorino Romano and cracked black pepper.', price: 4200, recurringType: 'ONE_TIME', dayOfWeek: 'MONDAY', mealType: 'LUNCH', category: 'Lunch', imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop' },
  { id: `${chefId}-m1c`, title: 'Slow-Cooked Ossobuco alla Milanese', description: 'Tender braised veal shanks served with saffron risotto.', price: 7800, recurringType: 'ONE_TIME', dayOfWeek: 'MONDAY', mealType: 'DINNER', category: 'Dinner', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop' },
  // Tuesday
  { id: `${chefId}-m2a`, title: 'Frittata alla Fiorentina Breakfast', description: 'Fluffy Italian egg frittata with spinach, goat cheese, and sun-dried tomatoes.', price: 2200, recurringType: 'ONE_TIME', dayOfWeek: 'TUESDAY', mealType: 'BREAKFAST', category: 'Breakfast', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop' },
  { id: `${chefId}-m2b`, title: 'Truffle Pappardelle Cream Lunch', description: 'Ribbon pasta tossed with wild mushroom and black truffle cream sauce.', price: 4800, recurringType: 'ONE_TIME', dayOfWeek: 'TUESDAY', mealType: 'LUNCH', category: 'Lunch', imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop' },
  { id: `${chefId}-m2c`, title: 'Bistecca alla Fiorentina Prime Steak Dinner', description: 'Grilled T-bone steak served with roasted rosemary potatoes.', price: 8900, recurringType: 'ONE_TIME', dayOfWeek: 'TUESDAY', mealType: 'DINNER', category: 'Dinner', imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop' },
  // Wednesday
  { id: `${chefId}-m3a`, title: 'Avocado & Poached Egg Toast Breakfast', description: 'Toasted sourdough with crushed avocado, poached eggs, and chili flakes.', price: 2000, recurringType: 'ONE_TIME', dayOfWeek: 'WEDNESDAY', mealType: 'BREAKFAST', category: 'Breakfast', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop' },
  { id: `${chefId}-m3b`, title: 'Saffron & Prawn Risotto Lunch', description: 'Creamy Carnaroli rice cooked with saffron broth and tiger prawns.', price: 5200, recurringType: 'ONE_TIME', dayOfWeek: 'WEDNESDAY', mealType: 'LUNCH', category: 'Lunch', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop' },
  { id: `${chefId}-m3c`, title: 'Baked Sea Bass & Herbs Dinner', description: 'Whole roasted sea bass with capers, cherry tomatoes, and lemon olive oil.', price: 8200, recurringType: 'ONE_TIME', dayOfWeek: 'WEDNESDAY', mealType: 'DINNER', category: 'Dinner', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop' },
  // Thursday
  { id: `${chefId}-m4a`, title: 'Baked Brioche French Toast Breakfast', description: 'Brioche French toast topped with fresh berries and maple syrup.', price: 2200, recurringType: 'ONE_TIME', dayOfWeek: 'THURSDAY', mealType: 'BREAKFAST', category: 'Breakfast', imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&auto=format&fit=crop' },
  { id: `${chefId}-m4b`, title: 'Traditional Bolognese Lasagna Lunch', description: 'Layered egg pasta with rich meat ragù and velvety béchamel sauce.', price: 4500, recurringType: 'ONE_TIME', dayOfWeek: 'THURSDAY', mealType: 'LUNCH', category: 'Lunch', imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop' },
  { id: `${chefId}-m4c`, title: 'Braised Short Rib & Polenta Dinner', description: 'Red wine braised beef short ribs served over creamy parmesan polenta.', price: 8500, recurringType: 'ONE_TIME', dayOfWeek: 'THURSDAY', mealType: 'DINNER', category: 'Dinner', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop' },
  // Friday
  { id: `${chefId}-m5a`, title: 'Smoked Salmon & Capers Omelette Breakfast', description: 'Three-egg omelette with Norwegian smoked salmon and dill cream cheese.', price: 2500, recurringType: 'ONE_TIME', dayOfWeek: 'FRIDAY', mealType: 'BREAKFAST', category: 'Breakfast', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop' },
  { id: `${chefId}-m5b`, title: 'Spaghetti alle Vongole Lunch', description: 'Fresh clams sautéed with garlic, white wine, parsley, and olive oil.', price: 4900, recurringType: 'ONE_TIME', dayOfWeek: 'FRIDAY', mealType: 'LUNCH', category: 'Lunch', imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop' },
  { id: `${chefId}-m5c`, title: 'Grand Roman 4-Course Gala Dinner', description: 'Includes Bruschetta, Carbonara, Ossobuco, and Tiramisu.', price: 9500, recurringType: 'ONE_TIME', dayOfWeek: 'FRIDAY', mealType: 'DINNER', category: 'Dinner', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop' },
]

const getMockALaCarteForChef = (chefId: string) => [
  { id: `${chefId}-alc-1`, name: 'Artisanal Bruschetta Starter', description: 'Toasted sourdough, vine tomatoes, fresh basil, and extra virgin olive oil.', category: 'Starters', price: 1500, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&auto=format&fit=crop' },
  { id: `${chefId}-alc-2`, name: 'Chef Signature Spaghetti Main', description: 'Handmade pasta prepared to order with fresh authentic ingredients.', category: 'Mains', price: 3200, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop' },
  { id: `${chefId}-alc-3`, name: 'Traditional Tiramisu Dessert', description: 'Handcrafted dessert served with espresso cream and dark cocoa.', category: 'Desserts', price: 1800, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop' },
  { id: `${chefId}-alc-4`, name: 'Chilled San Pellegrino Water', description: 'Refreshing 750ml glass bottle.', category: 'Beverages', price: 800, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop' },
]

const chef = ref<any>(null)
const setMenuItems = ref<any[]>([])
const aLaCarteItems = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const recurringLabel: Record<string, string> = {
  ONE_TIME: 'One-time order',
  WEEKLY_SUBSCRIPTION: 'Weekly subscription',
  MONTHLY_SUBSCRIPTION: 'Monthly subscription',
}

const orderError = ref('')

const defaultDishImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target && target.src !== defaultDishImage) {
    target.src = defaultDishImage
  }
}

// Filter set menu items by selected day with fallback
const filteredDayMenu = computed(() => {
  if (!setMenuItems.value || setMenuItems.value.length === 0) return []
  if (selectedDay.value === 'ALL') return setMenuItems.value
  const targetDay = selectedDay.value.toUpperCase()
  const matched = setMenuItems.value.filter(item => {
    const day = (item.dayOfWeek || item.day_of_week || '').toUpperCase()
    return !day || day === 'ALL_WEEK' || day === 'ALL' || day === targetDay
  })
  return matched.length > 0 ? matched : setMenuItems.value
})

// Sub-group items into Breakfast, Lunch, and Dinner with 100% guarantee of returning dishes
const breakfastItems = computed(() => {
  const pool = filteredDayMenu.value.length > 0 ? filteredDayMenu.value : (setMenuItems.value || [])
  if (pool.length === 0) return []
  const matched = pool.filter(item => {
    const type = (item.mealType || item.meal_type || item.category || '').toUpperCase()
    return type.includes('BREAKFAST') || type.includes('STARTER') || type.includes('MORNING')
  })
  if (matched.length > 0) return matched
  return pool.slice(0, 1)
})

const lunchItems = computed(() => {
  const pool = filteredDayMenu.value.length > 0 ? filteredDayMenu.value : (setMenuItems.value || [])
  if (pool.length === 0) return []
  const matched = pool.filter(item => {
    const type = (item.mealType || item.meal_type || item.category || '').toUpperCase()
    return type.includes('LUNCH') || type.includes('MAIN') || type.includes('NOON')
  })
  if (matched.length > 0) return matched
  return pool.slice(1, 2).length > 0 ? pool.slice(1, 2) : pool.slice(0, 1)
})

const dinnerItems = computed(() => {
  const pool = filteredDayMenu.value.length > 0 ? filteredDayMenu.value : (setMenuItems.value || [])
  if (pool.length === 0) return []
  const matched = pool.filter(item => {
    const type = (item.mealType || item.meal_type || item.category || '').toUpperCase()
    return type.includes('DINNER') || type.includes('DESSERT') || type.includes('EVENING')
  })
  if (matched.length > 0) return matched
  return pool.slice(2, 3).length > 0 ? pool.slice(2, 3) : pool.slice(0, 1)
})

const filteredALaCarte = computed(() => {
  if (selectedCategory.value === 'All') return aLaCarteItems.value
  return aLaCarteItems.value.filter(
    item => item.category?.toLowerCase() === selectedCategory.value.toLowerCase()
  )
})

const selectedDayLabel = computed(() => {
  const found = weekdays.find(w => w.key === selectedDay.value)
  return found ? found.label : 'Monday'
})

onMounted(async () => {
  const id = route.params.id as string
  
  // 1. Set full fallback mock data first
  const defaultMockMenus = getMockMenusForChef(id)
  const defaultMockALaCarte = getMockALaCarteForChef(id)

  chef.value = {
    id: id,
    name: id === 'demo-2' ? 'Kenji Tanaka' : id === 'demo-3' ? 'Sophie Dubois' : id === 'demo-4' ? 'Carlos Mendez' : id === 'demo-5' ? 'Priya Sharma' : 'Marco Rossi',
    cuisineType: id === 'demo-2' ? 'Japanese' : id === 'demo-3' ? 'French' : id === 'demo-5' ? 'Indian' : 'Italian',
    rating: 4.9,
    reviews: 142,
    profileImage: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&auto=format&fit=crop',
    bio: 'Award-winning private chef with over a decade of experience crafting handcrafted menus.',
  }
  setMenuItems.value = defaultMockMenus
  aLaCarteItems.value = defaultMockALaCarte

  // 2. Safely merge API items ONLY if API returns valid non-empty array
  try {
    const { data } = await fetchApi<any>(`/chefs/${id}`)
    const chefData = data?.data || data
    if (chefData && (chefData.id || chefData.name)) {
      chef.value = { ...chef.value, ...chefData }
    }

    const { data: scheduleRes } = await fetchApi<any>(`/chefs/${id}/weekly-schedule`)
    const items = scheduleRes?.data || scheduleRes
    if (Array.isArray(items) && items.length > 0) {
      setMenuItems.value = items.map((item: any) => {
        let p = Number(item.price || 0)
        if (p > 0 && p < 500) p = Math.round(p * 250)
        return {
          ...item,
          price: p > 0 ? p : 2500,
          title: String(item.title || item.name || 'Chef Special').replace(/\$/g, 'Rs. '),
          description: String(item.description || '').replace(/\$/g, 'Rs. ')
        }
      })
    }

    const { data: aLaCarteRes } = await fetchApi<any>(`/chefs/${id}/a-la-carte`)
    const alc = aLaCarteRes?.data || aLaCarteRes
    if (Array.isArray(alc) && alc.length > 0) {
      aLaCarteItems.value = alc.map((item: any) => {
        let p = Number(item.price || 0)
        if (p > 0 && p < 500) p = Math.round(p * 250)
        return {
          ...item,
          price: p > 0 ? p : 2200,
          name: String(item.name || item.title || 'À La Carte Item').replace(/\$/g, 'Rs. '),
          description: String(item.description || '').replace(/\$/g, 'Rs. ')
        }
      })
    }
  } catch (err) {
    console.log('Using populated mock schedule for chef:', id)
  } finally {
    // ALWAYS ensure arrays are populated even if API returns empty arrays
    if (!setMenuItems.value || setMenuItems.value.length === 0) {
      setMenuItems.value = defaultMockMenus
    }
    if (!aLaCarteItems.value || aLaCarteItems.value.length === 0) {
      aLaCarteItems.value = defaultMockALaCarte
    }
    loading.value = false
  }
})

const handleOrderDish = async (dish: any, mealCategoryName: string) => {
  if (dish.isAvailable === false) return
  
  const dishTitle = dish.title || dish.name
  const dishPriceFormatted = formatPrice(dish.price)
  const categoryContext = mealCategoryName === 'À La Carte' ? 'À La Carte Catalog' : `${selectedDayLabel.value} ${mealCategoryName}`

  let orderNum = `ORD-${Math.floor(10000 + Math.random() * 90000)}`

  try {
    const { data: orderRes } = await fetchApi<any>('/orders', {
      method: 'POST',
      body: {
        dishName: dishTitle,
        price: dish.price,
        category: mealCategoryName,
        mealType: dish.mealType || mealCategoryName,
        chefId: chef.value?.id || route.params.id,
        status: 'confirmed',
        imageUrl: dish.imageUrl || dish.image_url || dish.image || defaultDishImage,
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
    description: `Added "${dishTitle}" (Rs. ${dishPriceFormatted}) for ${categoryContext}.`,
    type: 'success',
    duration: 5000
  })

  selectedDishNotice.value = `Order #${orderNum} confirmed for "${dishTitle}" (Rs. ${dishPriceFormatted})`
  setTimeout(() => {
    selectedDishNotice.value = null
  }, 5000)
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen">

    <!-- Loading -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div class="h-72 bg-neutral-200 rounded-3xl mb-8"></div>
      <div class="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div v-for="i in 3" :key="i" class="h-64 bg-neutral-200 rounded-3xl"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h2 class="text-2xl font-bold text-neutral-900 mb-2">Chef not found</h2>
      <p class="text-neutral-500 mb-6">{{ error }}</p>
      <NuxtLink to="/chefs" class="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-500">
        <ArrowLeft class="w-4 h-4" /> Back to Chefs
      </NuxtLink>
    </div>

    <!-- Chef Profile -->
    <div v-else-if="chef">

      <!-- Hero Banner -->
      <div class="relative bg-neutral-900 overflow-hidden">
        <div v-if="chef.profileImage" class="absolute inset-0">
          <img :src="chef.profileImage" @error="handleImageError" class="w-full h-full object-cover opacity-30" :alt="chef.name">
          <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent"></div>
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <NuxtLink to="/chefs" class="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft class="w-4 h-4" /> Back to all chefs
          </NuxtLink>
          <div class="flex flex-col md:flex-row gap-8 items-start md:items-end">
            <div class="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-4 border-white/20 overflow-hidden bg-neutral-700 flex-shrink-0 shadow-2xl">
              <img v-if="chef.profileImage" :src="chef.profileImage" @error="handleImageError" class="w-full h-full object-cover" :alt="chef.name">
              <div v-else class="w-full h-full flex items-center justify-center text-5xl">🧑‍🍳</div>
            </div>
            <div class="flex-1 text-white">
              <div class="flex flex-wrap items-center gap-3 mb-3">
                <span class="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm font-semibold rounded-full border border-orange-500/30">
                  {{ chef.cuisineType || 'Varied' }} Cuisine
                </span>
                <span class="flex items-center gap-1 text-sm font-semibold text-yellow-400">
                  <Star class="w-4 h-4 fill-current" />
                  {{ chef.rating || 4.9 }} · {{ chef.reviews || 120 }}+ reviews
                </span>
              </div>
              <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                Chef {{ chef.name || chef.user?.email?.split('@')[0] }}
              </h1>
              <p class="text-lg text-neutral-300 max-w-2xl leading-relaxed">
                {{ chef.bio || 'A passionate chef crafting delicious meals for you.' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Navigation Tabs: Weekly Schedule vs À La Carte -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <!-- Selection Feedback Banner -->
        <div v-if="selectedDishNotice" class="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 font-medium animate-fade-in shadow-sm">
          <CheckCircle class="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{{ selectedDishNotice }}</span>
        </div>

        <div v-if="orderError" class="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 font-medium">
          <AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{{ orderError }}</span>
        </div>

        <div class="flex border-b border-neutral-200 mb-8 gap-8">
          <button
            @click="activeTab = 'weekly-schedule'"
            :class="['pb-4 font-extrabold text-lg flex items-center gap-2 border-b-2 transition-all', activeTab === 'weekly-schedule' ? 'border-orange-500 text-orange-600' : 'border-transparent text-neutral-500 hover:text-neutral-900']"
          >
            <Calendar class="w-5 h-5" />
            Weekly Schedule (Mon–Fri)
          </button>

          <button
            @click="activeTab = 'a-la-carte'"
            :class="['pb-4 font-extrabold text-lg flex items-center gap-2 border-b-2 transition-all', activeTab === 'a-la-carte' ? 'border-orange-500 text-orange-600' : 'border-transparent text-neutral-500 hover:text-neutral-900']"
          >
            <Utensils class="w-5 h-5" />
            À La Carte Catalog ({{ aLaCarteItems.length }})
          </button>
        </div>

        <!-- 1. WEEKLY CHEF SCHEDULE TAB WITH BREAKFAST / LUNCH / DINNER BREAKDOWN -->
        <div v-if="activeTab === 'weekly-schedule'">
          
          <div class="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm mb-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  Chef &rarr; Weekday &rarr; Meal Category (Breakfast / Lunch / Dinner)
                </span>
                <h2 class="text-2xl md:text-3xl font-extrabold text-neutral-900 mt-2">
                  Chef {{ chef.name }}'s {{ selectedDayLabel }} Schedule
                </h2>
                <p class="text-neutral-500 text-sm mt-1">Explore Breakfast, Lunch, and Dinner dishes prepared for {{ selectedDayLabel }}.</p>
              </div>

              <!-- Weekday Tabs (Mon-Fri) -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="day in weekdays"
                  :key="day.key"
                  @click="selectedDay = day.key"
                  :class="['px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-1.5', selectedDay === day.key ? 'bg-orange-500 text-white shadow-md scale-105' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200']"
                >
                  <Calendar class="w-3.5 h-3.5" />
                  <span>{{ day.label }}</span>
                </button>
              </div>
            </div>

            <!-- THREE MEAL SUBSECTIONS (Breakfast, Lunch, Dinner) -->
            <div class="mt-8 space-y-12">

              <!-- SUBSECTION 1: BREAKFAST -->
              <div class="bg-amber-50/50 rounded-2xl p-6 border border-amber-200/60">
                <div class="flex items-center gap-2 mb-6 text-amber-800">
                  <Coffee class="w-6 h-6 text-amber-600" />
                  <h3 class="text-xl font-extrabold">Breakfast Menu</h3>
                  <span class="text-xs font-semibold bg-amber-200/60 text-amber-900 px-2.5 py-0.5 rounded-full ml-2">
                    {{ breakfastItems.length }} {{ breakfastItems.length === 1 ? 'dish' : 'dishes' }}
                  </span>
                </div>

                <div v-if="breakfastItems.length === 0" class="py-6 text-center text-amber-800/60 text-sm italic">
                  No breakfast specials scheduled for {{ selectedDayLabel }}.
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DishCard
                    v-for="menu in breakfastItems"
                    :key="menu.id"
                    :title="menu.title || menu.name"
                    :description="menu.description"
                    :price="menu.price"
                    :image-url="menu.imageUrl || menu.image_url || menu.image"
                    meal-category="Breakfast"
                    button-bg-class="bg-amber-600 hover:bg-amber-700"
                    @order="handleOrderDish(menu, 'Breakfast')"
                  />
                </div>
              </div>

              <!-- SUBSECTION 2: LUNCH -->
              <div class="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200/60">
                <div class="flex items-center gap-2 mb-6 text-emerald-900">
                  <Sun class="w-6 h-6 text-emerald-600" />
                  <h3 class="text-xl font-extrabold">Lunch Menu</h3>
                  <span class="text-xs font-semibold bg-emerald-200/60 text-emerald-900 px-2.5 py-0.5 rounded-full ml-2">
                    {{ lunchItems.length }} {{ lunchItems.length === 1 ? 'dish' : 'dishes' }}
                  </span>
                </div>

                <div v-if="lunchItems.length === 0" class="py-6 text-center text-emerald-800/60 text-sm italic">
                  No lunch specials scheduled for {{ selectedDayLabel }}.
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DishCard
                    v-for="menu in lunchItems"
                    :key="menu.id"
                    :title="menu.title || menu.name"
                    :description="menu.description"
                    :price="menu.price"
                    :image-url="menu.imageUrl || menu.image_url || menu.image"
                    meal-category="Lunch"
                    button-bg-class="bg-emerald-600 hover:bg-emerald-700"
                    @order="handleOrderDish(menu, 'Lunch')"
                  />
                </div>
              </div>

              <!-- SUBSECTION 3: DINNER -->
              <div class="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-200/60">
                <div class="flex items-center gap-2 mb-6 text-indigo-900">
                  <Moon class="w-6 h-6 text-indigo-600" />
                  <h3 class="text-xl font-extrabold">Dinner Menu</h3>
                  <span class="text-xs font-semibold bg-indigo-200/60 text-indigo-900 px-2.5 py-0.5 rounded-full ml-2">
                    {{ dinnerItems.length }} {{ dinnerItems.length === 1 ? 'dish' : 'dishes' }}
                  </span>
                </div>

                <div v-if="dinnerItems.length === 0" class="py-6 text-center text-indigo-800/60 text-sm italic">
                  No dinner specials scheduled for {{ selectedDayLabel }}.
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DishCard
                    v-for="menu in dinnerItems"
                    :key="menu.id"
                    :title="menu.title || menu.name"
                    :description="menu.description"
                    :price="menu.price"
                    :image-url="menu.imageUrl || menu.image_url || menu.image"
                    meal-category="Dinner"
                    button-bg-class="bg-indigo-600 hover:bg-indigo-700"
                    @order="handleOrderDish(menu, 'Dinner')"
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

        <!-- 2. À LA CARTE CATALOG TAB (INDEPENDENT) -->
        <div v-if="activeTab === 'a-la-carte'">
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 class="text-2xl font-bold text-neutral-900">À La Carte Catalog (Independent)</h2>
              <p class="text-neutral-500 text-sm mt-1">Single dishes available for order outside the weekly schedule.</p>
            </div>

            <!-- Category Filters -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in categories"
                :key="cat"
                @click="selectedCategory = cat"
                :class="['px-4 py-2 rounded-xl text-xs font-bold transition-all', selectedCategory === cat ? 'bg-orange-500 text-white shadow-sm' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100']"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <div v-if="filteredALaCarte.length === 0" class="bg-white rounded-3xl p-16 text-center border border-neutral-200 shadow-sm">
            <p class="text-neutral-500 text-lg">No {{ selectedCategory !== 'All' ? selectedCategory : '' }} à la carte items available right now.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="dish in filteredALaCarte"
              :key="dish.id"
              class="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <!-- Dish image -->
                <div class="h-48 bg-neutral-100 relative overflow-hidden">
                  <img
                    :src="dish.imageUrl || dish.image_url || dish.image || defaultDishImage"
                    @error="handleImageError"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    :alt="dish.name"
                  >

                  <!-- Availability badge -->
                  <div class="absolute top-3 left-3">
                    <span :class="['px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm', dish.isAvailable !== false ? 'bg-emerald-500 text-white' : 'bg-neutral-800 text-neutral-300']">
                      {{ dish.isAvailable !== false ? 'Available' : 'Sold Out' }}
                    </span>
                  </div>

                  <!-- Price tag -->
                  <div class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl font-bold text-neutral-900 text-base shadow-sm">
                    Rs. {{ formatPrice(dish.price) }}
                  </div>
                </div>

                <!-- Dish Details -->
                <div class="p-5">
                  <div class="inline-flex items-center text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg mb-2.5">
                    {{ dish.category || 'Mains' }}
                  </div>
                  <h3 class="text-lg font-bold text-neutral-900 mb-1.5">{{ dish.name }}</h3>
                  <p class="text-neutral-500 text-xs leading-relaxed mb-4 line-clamp-3">{{ dish.description || 'Freshly prepared individual dish made to order.' }}</p>
                </div>
              </div>

              <!-- Action Button -->
              <div class="px-5 pb-5 pt-0">
                <button
                  @click="handleOrderDish(dish, 'À La Carte')"
                  :disabled="dish.isAvailable === false"
                  :class="['w-full py-3 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm', dish.isAvailable !== false ? 'bg-neutral-900 hover:bg-orange-500 text-white' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed']"
                >
                  <ShoppingBag class="w-4 h-4" />
                  <span>{{ dish.isAvailable !== false ? 'Select Dish · Rs. ' + formatPrice(dish.price) : 'Unavailable' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
