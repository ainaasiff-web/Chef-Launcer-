<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { Star, MapPin, ChefHat, Clock, CreditCard, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { fetchApi } = useApi()
const authStore = useAuthStore()

const demoChefs: Record<string, any> = {
  'demo-1': {
    id: 'demo-1', name: 'Marco Rossi', bio: 'Award-winning Italian chef with 15 years of experience in Michelin-starred restaurants across Rome and Milan. I specialize in handmade pasta, wood-fired pizzas, and classic Italian desserts.',
    cuisineType: 'Italian', rating: 4.9, reviews: 142,
    profileImage: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&auto=format&fit=crop',
    user: { id: 'u1', email: 'marco@cheflaunch.com' },
    menus: [
      { id: 'm1', title: 'Classic Roman Pasta Box', description: 'Handmade Cacio e Pepe, Carbonara & Amatriciana. Serves 2, with fresh ingredients included.', price: 4500, recurringType: 'ONE_TIME', imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop' },
      { id: 'm2', title: 'Weekly Italian Feast', description: 'A new 3-course Italian meal every week. Primo, Secondo, and Dolce delivered fresh.', price: 8900, recurringType: 'WEEKLY_SUBSCRIPTION', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop' },
      { id: 'm3', title: 'Monthly Gourmet Collection', description: 'Premium monthly box with 4 signature Italian dishes, wine pairing notes & recipes.', price: 14900, recurringType: 'MONTHLY_SUBSCRIPTION', imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop' },
    ]
  },
  'demo-2': {
    id: 'demo-2', name: 'Kenji Tanaka', bio: 'Passionate sushi master trained in Tokyo for over a decade. Specializing in omakase and seasonal Japanese cuisine. Every dish is a work of art.',
    cuisineType: 'Japanese', rating: 5.0, reviews: 98,
    profileImage: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop',
    user: { id: 'u2', email: 'kenji@cheflaunch.com' },
    menus: [
      { id: 'm4', title: 'Sushi Omakase Box (8 pcs)', description: 'Chef\'s selection of 8 premium nigiri pieces with seasonal fish. Includes soy, wasabi & gari.', price: 6500, recurringType: 'ONE_TIME', imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop' },
      { id: 'm5', title: 'Weekly Bento Subscription', description: 'A curated weekly bento box with sushi, tempura, miso soup and seasonal sides.', price: 9500, recurringType: 'WEEKLY_SUBSCRIPTION', imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop' },
    ]
  },
  'demo-3': {
    id: 'demo-3', name: 'Sophie Dubois', bio: 'Farm-to-table French cuisine. I source only the finest local ingredients to craft classic French dishes with a modern twist. Trained at Le Cordon Bleu Paris.',
    cuisineType: 'French', rating: 4.8, reviews: 76,
    profileImage: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&auto=format&fit=crop',
    user: { id: 'u3', email: 'sophie@cheflaunch.com' },
    menus: [
      { id: 'm6', title: 'Classic French Bistro Box', description: 'Beef Bourguignon, Ratatouille & Crème Brûlée. Ready to heat and serve in 15 minutes.', price: 5500, recurringType: 'ONE_TIME', imageUrl: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&auto=format&fit=crop' },
      { id: 'm7', title: 'Monthly Pâtisserie Box', description: 'Monthly delivery of 12 freshly baked French pastries — croissants, éclairs, macarons & more.', price: 12900, recurringType: 'MONTHLY_SUBSCRIPTION', imageUrl: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop' },
    ]
  },
  'demo-4': {
    id: 'demo-4', name: 'Carlos Mendez', bio: 'Authentic Mexican street food elevated to fine dining. Third-generation chef bringing family recipes to your table with bold flavors and fresh, vibrant ingredients.',
    cuisineType: 'Mexican', rating: 4.7, reviews: 203,
    profileImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
    user: { id: 'u4', email: 'carlos@cheflaunch.com' },
    menus: [
      { id: 'm8', title: 'Taco Fiesta Pack (12 pcs)', description: 'Handmade corn tortillas with 3 fillings: carnitas, pollo verde & veggie. Includes all salsas.', price: 3500, recurringType: 'ONE_TIME', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop' },
      { id: 'm9', title: 'Weekly Mexican Feast', description: 'A rotating weekly menu of authentic Mexican dishes. Enough to feed a family of 4.', price: 7900, recurringType: 'WEEKLY_SUBSCRIPTION', imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&auto=format&fit=crop' },
    ]
  },
  'demo-5': {
    id: 'demo-5', name: 'Priya Sharma', bio: 'Modern Indian cuisine blending aromatic spices and traditional techniques with contemporary presentation. Vegetarian-friendly specialist with expertise in regional Indian cooking.',
    cuisineType: 'Indian', rating: 4.9, reviews: 118,
    profileImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop',
    user: { id: 'u5', email: 'priya@cheflaunch.com' },
    menus: [
      { id: 'm10', title: 'Indian Thali Experience', description: 'A full vegetarian thali: 2 curries, dal, rice, roti, raita & dessert. Serves 2.', price: 4200, recurringType: 'ONE_TIME', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop' },
      { id: 'm11', title: 'Spice Box Subscription', description: 'Weekly curated Indian meals with fresh spices, chutneys, and detailed recipe cards.', price: 8500, recurringType: 'WEEKLY_SUBSCRIPTION', imageUrl: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&auto=format&fit=crop' },
    ]
  },
  'demo-6': {
    id: 'demo-6', name: 'Alex Papadopoulos', bio: 'Mediterranean fusion expert. From Greek moussaka to Lebanese mezze, I take you on a journey across the Mediterranean coast in every bite.',
    cuisineType: 'Mediterranean', rating: 4.6, reviews: 89,
    profileImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop',
    user: { id: 'u6', email: 'alex@cheflaunch.com' },
    menus: [
      { id: 'm12', title: 'Mediterranean Mezze Platter', description: 'Hummus, baba ghanoush, falafel, pita, olives & stuffed grape leaves for 4 people.', price: 3800, recurringType: 'ONE_TIME', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop' },
      { id: 'm13', title: 'Monthly Med Box', description: 'Monthly delivery of a rotating Mediterranean feast — from Greek islands to the Levant coast.', price: 11900, recurringType: 'MONTHLY_SUBSCRIPTION', imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop' },
    ]
  },
}

const chef = ref<any>(null)
const loading = ref(true)
const error = ref('')
const subscribing = ref<string | null>(null)

const recurringLabel: Record<string, string> = {
  ONE_TIME: 'One-time order',
  WEEKLY_SUBSCRIPTION: 'Weekly subscription',
  MONTHLY_SUBSCRIPTION: 'Monthly subscription',
}

const recurringColor: Record<string, string> = {
  ONE_TIME: 'bg-blue-50 text-blue-700',
  WEEKLY_SUBSCRIPTION: 'bg-green-50 text-green-700',
  MONTHLY_SUBSCRIPTION: 'bg-purple-50 text-purple-700',
}

onMounted(async () => {
  const id = route.params.id as string
  // Check demo data first
  if (demoChefs[id]) {
    chef.value = demoChefs[id]
    loading.value = false
    return
  }
  // Fallback to API
  const { data, error: apiError } = await fetchApi<any>(`/chefs/${id}`)
  if (data) chef.value = data
  if (apiError) error.value = apiError
  loading.value = false
})

const handleSubscribe = async (menuId: string) => {
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }
  subscribing.value = menuId
  const { data } = await fetchApi<any>('/checkout/create-session', {
    method: 'POST',
    body: { menuId }
  })
  subscribing.value = null
  if (data?.url) window.location.href = data.url
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
          <img :src="chef.profileImage" class="w-full h-full object-cover opacity-30" :alt="chef.name">
          <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent"></div>
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <NuxtLink to="/chefs" class="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft class="w-4 h-4" /> Back to all chefs
          </NuxtLink>
          <div class="flex flex-col md:flex-row gap-8 items-start md:items-end">
            <div class="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-4 border-white/20 overflow-hidden bg-neutral-700 flex-shrink-0 shadow-2xl">
              <img v-if="chef.profileImage" :src="chef.profileImage" class="w-full h-full object-cover" :alt="chef.name">
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

      <!-- Menus Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 class="text-3xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
          <ChefHat class="w-8 h-8 text-orange-500" />
          Available Menus
        </h2>
        <p class="text-neutral-500 mb-10">Choose a one-time order or subscribe for recurring meals.</p>

        <div v-if="!chef.menus || chef.menus.length === 0" class="bg-white rounded-3xl p-16 text-center border border-neutral-200">
          <p class="text-neutral-500 text-lg">This chef hasn't added any menus yet. Check back soon!</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="menu in chef.menus"
            :key="menu.id"
            class="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
          >
            <!-- Menu image -->
            <div class="h-52 bg-neutral-100 relative overflow-hidden">
              <img
                v-if="menu.imageUrl"
                :src="menu.imageUrl"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                :alt="menu.title"
              >
              <div v-else class="w-full h-full flex items-center justify-center text-neutral-300">
                <ChefHat class="w-12 h-12" />
              </div>
              <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl font-bold text-neutral-900 text-lg shadow-sm">
                ${{ (menu.price / 100).toFixed(2) }}
              </div>
            </div>

            <!-- Menu details -->
            <div class="p-6 flex-1 flex flex-col">
              <div :class="['inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg w-fit mb-3', recurringColor[menu.recurringType] || 'bg-neutral-100 text-neutral-600']">
                <Clock class="w-3.5 h-3.5" />
                {{ recurringLabel[menu.recurringType] || menu.recurringType }}
              </div>

              <h3 class="text-xl font-bold text-neutral-900 mb-2">{{ menu.title }}</h3>
              <p class="text-neutral-500 text-sm flex-1 mb-6 leading-relaxed">{{ menu.description }}</p>

              <button
                @click="handleSubscribe(menu.id)"
                :disabled="subscribing === menu.id"
                class="w-full py-3.5 rounded-xl bg-neutral-900 hover:bg-orange-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <CreditCard class="w-5 h-5" />
                <span v-if="subscribing === menu.id">Processing...</span>
                <span v-else-if="menu.recurringType === 'ONE_TIME'">Order Now</span>
                <span v-else>Subscribe · ${{ (menu.price / 100).toFixed(2) }}/{{ menu.recurringType === 'WEEKLY_SUBSCRIPTION' ? 'wk' : 'mo' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
