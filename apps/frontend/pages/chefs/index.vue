<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { Search, Star, MapPin } from 'lucide-vue-next'

const { fetchApi } = useApi()
const chefs = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await fetchApi<any[]>('/chefs')
  if (data) {
    chefs.value = data
  }
  loading.value = false
})
</script>

<template>
  <div class="bg-neutral-50 min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
        <div>
          <h1 class="text-4xl font-extrabold text-neutral-900 tracking-tight">Discover Chefs</h1>
          <p class="text-neutral-500 mt-2 text-lg">Find the perfect culinary artist for your next meal.</p>
        </div>
        
        <div class="relative w-full md:w-96">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-neutral-400" />
          </div>
          <input type="text" class="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all sm:text-sm shadow-sm" placeholder="Search by cuisine or chef name...">
        </div>
      </div>

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

      <div v-else-if="chefs.length === 0" class="text-center py-20 bg-white rounded-3xl border border-neutral-100">
        <div class="text-neutral-400 mb-4">
          <Search class="w-12 h-12 mx-auto opacity-50" />
        </div>
        <h3 class="text-xl font-medium text-neutral-900 mb-2">No chefs found</h3>
        <p class="text-neutral-500">Check back later for new additions to our platform.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink v-for="chef in chefs" :key="chef.id" :to="`/chefs/${chef.id}`" class="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all group">
          <div class="h-48 bg-neutral-200 relative overflow-hidden">
            <img v-if="chef.profileImage" :src="chef.profileImage" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div v-else class="w-full h-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center">
              <span class="text-4xl">🧑‍🍳</span>
            </div>
            
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-neutral-900 shadow-sm">
              <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
              4.9
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md w-fit mb-3">
              {{ chef.cuisineType || 'Varied' }} Cuisine
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2 truncate">Chef {{ chef.user?.email?.split('@')[0] }}</h3>
            <p class="text-neutral-500 text-sm line-clamp-2 mb-4">{{ chef.bio || 'A passionate chef crafting delicious meals for you.' }}</p>
            
            <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div class="flex items-center gap-1 text-sm text-neutral-500">
                <MapPin class="w-4 h-4" /> Local Delivery
              </div>
              <div class="font-medium text-orange-600 group-hover:text-orange-500 transition-colors">
                View Menus &rarr;
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
