<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { Search, Star, MapPin, ChefHat } from 'lucide-vue-next'

const { fetchApi } = useApi()
const chefs = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')

const defaultAvatars = [
  'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop',
]

// Fallback demo chefs matching database seed
const demoChefs = [
  {
    id: 'demo-1',
    name: 'Marco Rossi',
    bio: 'Award-winning Italian chef with 15 years of experience in Michelin-starred restaurants across Rome and Milan.',
    cuisineType: 'Italian',
    rating: '4.9',
    reviews: 142,
    profileImage: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&auto=format&fit=crop',
    user: { id: 'u1', email: 'marco@cheflaunch.com' },
  },
  {
    id: 'demo-2',
    name: 'Kenji Tanaka',
    bio: 'Passionate sushi master trained in Tokyo for over a decade. Specializing in omakase and seasonal Japanese cuisine.',
    cuisineType: 'Japanese',
    rating: '5.0',
    reviews: 98,
    profileImage: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop',
    user: { id: 'u2', email: 'kenji@cheflaunch.com' },
  },
  {
    id: 'demo-3',
    name: 'Sophie Dubois',
    bio: 'Farm-to-table French cuisine. Trained at Le Cordon Bleu Paris, sourcing the finest local ingredients for classic dishes.',
    cuisineType: 'French',
    rating: '4.8',
    reviews: 76,
    profileImage: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&auto=format&fit=crop',
    user: { id: 'u3', email: 'sophie@cheflaunch.com' },
  },
  {
    id: 'demo-4',
    name: 'Carlos Mendez',
    bio: 'Authentic Mexican street food elevated to fine dining. Third-generation chef bringing family recipes to your table.',
    cuisineType: 'Mexican',
    rating: '4.7',
    reviews: 203,
    profileImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
    user: { id: 'u4', email: 'carlos@cheflaunch.com' },
  },
  {
    id: 'demo-5',
    name: 'Priya Sharma',
    bio: 'Modern Indian cuisine blending aromatic spices and traditional regional techniques with contemporary presentation.',
    cuisineType: 'Indian',
    rating: '4.9',
    reviews: 118,
    profileImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop',
    user: { id: 'u5', email: 'priya@cheflaunch.com' },
  },
  {
    id: 'demo-6',
    name: 'Alex Papadopoulos',
    bio: 'Mediterranean fusion expert. From Greek moussaka to Lebanese mezze, a journey through the sea in every bite.',
    cuisineType: 'Mediterranean',
    rating: '4.6',
    reviews: 89,
    profileImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop',
    user: { id: 'u6', email: 'alex@cheflaunch.com' },
  },
  {
    id: 'demo-7',
    name: 'Maya Lin',
    bio: 'Plant-based Asian Fusion chef crafting vibrant, nutrient-dense bowls, dumplings, and ramen with 100% organic vegan ingredients.',
    cuisineType: 'Vegan & Asian Fusion',
    rating: '4.9',
    reviews: 165,
    profileImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop',
    user: { id: 'u7', email: 'maya@cheflaunch.com' },
  },
  {
    id: 'demo-8',
    name: 'Pierre Laurent',
    bio: 'Master Pastry Chef from Lyon. Specializing in artisanal sourdough, decadent chocolate tarts, and French breakfast spreads.',
    cuisineType: 'French Bakery & Desserts',
    rating: '4.8',
    reviews: 134,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    user: { id: 'u8', email: 'pierre@cheflaunch.com' },
  },
  {
    id: 'demo-9',
    name: 'Isabella Santos',
    bio: 'Brazilian & Latin BBQ Specialist. Slow-cooked picanha, feijoada stew, and traditional churrasco sides full of rich flavor.',
    cuisineType: 'Brazilian & Latin BBQ',
    rating: '4.7',
    reviews: 95,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
    user: { id: 'u9', email: 'isabella@cheflaunch.com' },
  },
  {
    id: 'demo-10',
    name: 'Marcus Vance',
    bio: 'New Orleans native bringing authentic Cajun, Creole, and Southern Soul Food. Famous for gumbo, jambalaya, and smoked brisket.',
    cuisineType: 'Cajun & Southern Soul',
    rating: '4.9',
    reviews: 210,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop',
    user: { id: 'u10', email: 'marcus@cheflaunch.com' },
  },
]

const displayedChefs = computed(() => {
  const source = chefs.value.length > 0 ? chefs.value : demoChefs
  if (!searchQuery.value) return source
  const query = searchQuery.value.toLowerCase().trim()
  return source.filter(c =>
    c.cuisineType?.toLowerCase().includes(query) ||
    c.name?.toLowerCase().includes(query) ||
    c.bio?.toLowerCase().includes(query) ||
    c.user?.email?.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  const { data } = await fetchApi<any>('/chefs')
  const apiChefs = data?.data || data
  if (Array.isArray(apiChefs) && apiChefs.length > 0) {
    chefs.value = apiChefs
  }
  loading.value = false
})
</script>

<template>
  <div class="bg-neutral-50 min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
        <div>
          <h1 class="text-4xl font-extrabold text-neutral-900 tracking-tight">Discover Chefs</h1>
          <p class="text-neutral-500 mt-2 text-lg">Find the perfect culinary artist for your next meal.</p>
        </div>
        
        <div class="relative w-full md:w-96">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-neutral-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all sm:text-sm shadow-sm"
            placeholder="Search by cuisine or chef name..."
          >
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 animate-pulse">
          <div class="h-48 bg-neutral-200"></div>
          <div class="p-6">
            <div class="h-6 bg-neutral-200 rounded w-1/2 mb-4"></div>
            <div class="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-neutral-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div v-else-if="displayedChefs.length === 0" class="text-center py-20 bg-white rounded-3xl border border-neutral-100">
        <div class="text-neutral-400 mb-4">
          <Search class="w-12 h-12 mx-auto opacity-50" />
        </div>
        <h3 class="text-xl font-medium text-neutral-900 mb-2">No chefs found</h3>
        <p class="text-neutral-500">Try searching for a different cuisine or chef name.</p>
      </div>

      <!-- Chef Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="(chef, index) in displayedChefs"
          :key="chef.id"
          :to="`/chefs/${chef.id}`"
          class="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all group flex flex-col justify-between"
        >
          <div>
            <div class="h-52 bg-neutral-200 relative overflow-hidden">
              <img
                :src="chef.profileImage || defaultAvatars[index % defaultAvatars.length]"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                :alt="chef.name || 'Chef'"
              >

              <!-- Rating badge -->
              <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1 text-xs font-bold text-neutral-900 shadow-sm">
                <Star class="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {{ chef.rating || '4.9' }}
              </div>
            </div>

            <div class="p-5">
              <!-- Cuisine tag -->
              <div class="inline-flex items-center text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg mb-3">
                {{ chef.cuisineType || 'International' }}
              </div>

              <h3 class="text-lg font-bold text-neutral-900 mb-1.5 truncate">
                {{ chef.name || (chef.user?.email ? 'Chef ' + chef.user.email.split('@')[0] : 'Chef Partner') }}
              </h3>
              <p class="text-neutral-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                {{ chef.bio || 'Crafting handcrafted culinary experiences for your table.' }}
              </p>
            </div>
          </div>

          <div class="px-5 pb-5 pt-0">
            <div class="flex items-center justify-between py-3 border-t border-neutral-100">
              <div class="flex items-center gap-1 text-xs text-neutral-500">
                <MapPin class="w-3.5 h-3.5 text-neutral-400" />
                Local Delivery
              </div>
              <div class="flex items-center gap-1 text-xs text-neutral-400">
                <Star class="w-3 h-3 fill-neutral-300 text-neutral-300" />
                {{ chef.reviews || '120' }}+ reviews
              </div>
            </div>

            <div class="mt-2 w-full text-center py-2.5 rounded-xl bg-neutral-900 group-hover:bg-orange-500 text-white text-xs font-semibold transition-colors">
              View Profile & Menus &rarr;
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
