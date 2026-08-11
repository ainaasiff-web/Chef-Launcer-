<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { Search, Star, MapPin } from 'lucide-vue-next'

const { fetchApi } = useApi()
const chefs = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')

// Demo chefs shown when backend is not connected
const demoChefs = [
  {
    id: 'demo-1',
    bio: 'Award-winning Italian chef with 15 years of experience in Michelin-starred restaurants across Rome and Milan.',
    cuisineType: 'Italian',
    profileImage: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&auto=format&fit=crop',
    user: { id: 'u1', email: 'marco@cheflaunch.com' },
    name: 'Marco Rossi',
    rating: 4.9,
    reviews: 142,
  },
  {
    id: 'demo-2',
    bio: 'Passionate sushi master trained in Tokyo for over a decade. Specializing in omakase and seasonal Japanese cuisine.',
    cuisineType: 'Japanese',
    profileImage: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop',
    user: { id: 'u2', email: 'kenji@cheflaunch.com' },
    name: 'Kenji Tanaka',
    rating: 5.0,
    reviews: 98,
  },
  {
    id: 'demo-3',
    bio: 'Farm-to-table French cuisine. I source only the finest local ingredients to craft classic French dishes with a modern twist.',
    cuisineType: 'French',
    profileImage: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&auto=format&fit=crop',
    user: { id: 'u3', email: 'sophie@cheflaunch.com' },
    name: 'Sophie Dubois',
    rating: 4.8,
    reviews: 76,
  },
  {
    id: 'demo-4',
    bio: 'Authentic Mexican street food elevated to fine dining. Third-generation chef bringing family recipes to your table.',
    cuisineType: 'Mexican',
    profileImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
    user: { id: 'u4', email: 'carlos@cheflaunch.com' },
    name: 'Carlos Mendez',
    rating: 4.7,
    reviews: 203,
  },
  {
    id: 'demo-5',
    bio: 'Modern Indian cuisine blending aromatic spices and traditional techniques with contemporary presentation.',
    cuisineType: 'Indian',
    profileImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop',
    user: { id: 'u5', email: 'priya@cheflaunch.com' },
    name: 'Priya Sharma',
    rating: 4.9,
    reviews: 118,
  },
  {
    id: 'demo-6',
    bio: 'Mediterranean fusion expert. From Greek moussaka to Lebanese mezze, a journey through the sea in every bite.',
    cuisineType: 'Mediterranean',
    profileImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop',
    user: { id: 'u6', email: 'alex@cheflaunch.com' },
    name: 'Alex Papadopoulos',
    rating: 4.6,
    reviews: 89,
  },
]

const displayedChefs = computed(() => {
  const source = chefs.value.length > 0 ? chefs.value : demoChefs
  if (!searchQuery.value) return source
  return source.filter(c =>
    c.cuisineType?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (c.name || c.user?.email)?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(async () => {
  const { data } = await fetchApi<any[]>('/chefs')
  if (data && data.length > 0) {
    chefs.value = data
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
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 animate-pulse">
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
        <p class="text-neutral-500">Try a different search term.</p>
      </div>

      <!-- Chef Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink
          v-for="chef in displayedChefs"
          :key="chef.id"
          :to="`/chefs/${chef.id}`"
          class="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all group"
        >
          <div class="h-56 bg-neutral-200 relative overflow-hidden">
            <img
              v-if="chef.profileImage"
              :src="chef.profileImage"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              :alt="chef.name || 'Chef'"
            >
            <div v-else class="w-full h-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center">
              <span class="text-5xl">🧑‍🍳</span>
            </div>

            <!-- Rating badge -->
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-xl flex items-center gap-1 text-sm font-bold text-neutral-900 shadow-sm">
              <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {{ chef.rating || '4.9' }}
            </div>
          </div>

          <div class="p-6">
            <!-- Cuisine tag -->
            <div class="inline-flex items-center text-sm font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg mb-3">
              {{ chef.cuisineType || 'Varied' }} Cuisine
            </div>

            <h3 class="text-xl font-bold text-neutral-900 mb-2 truncate">
              {{ chef.name || 'Chef ' + (chef.user?.email?.split('@')[0]) }}
            </h3>
            <p class="text-neutral-500 text-sm line-clamp-2 mb-4">
              {{ chef.bio || 'A passionate chef crafting delicious meals for you.' }}
            </p>

            <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div class="flex items-center gap-1.5 text-sm text-neutral-500">
                <MapPin class="w-4 h-4 text-neutral-400" />
                Local Delivery
              </div>
              <div class="flex items-center gap-1 text-sm text-neutral-400">
                <Star class="w-3.5 h-3.5 fill-neutral-300 text-neutral-300" />
                {{ chef.reviews || '120' }}+ reviews
              </div>
            </div>

            <div class="mt-4 w-full text-center py-2.5 rounded-xl bg-neutral-900 group-hover:bg-orange-500 text-white text-sm font-semibold transition-colors">
              View Profile & Menus &rarr;
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
