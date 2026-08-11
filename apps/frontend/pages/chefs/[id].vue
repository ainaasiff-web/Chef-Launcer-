<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { Star, MapPin, ChefHat, Clock, CreditCard } from 'lucide-vue-next'

const route = useRoute()
const { fetchApi } = useApi()
const authStore = useAuthStore()

const chef = ref<any>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const { data, error: apiError } = await fetchApi<any>(`/chefs/${route.params.id}`)
  if (data) {
    chef.value = data
  }
  if (apiError) {
    error.value = apiError
  }
  loading.value = false
})

const handleSubscribe = async (menuId: string) => {
  if (!authStore.isAuthenticated) {
    // Redirect to login or show modal
    return
  }

  const { data } = await fetchApi<any>('/checkout/create-session', {
    method: 'POST',
    body: { menuId }
  })

  if (data?.url) {
    window.location.href = data.url
  }
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen">
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div class="h-64 bg-neutral-200 rounded-3xl mb-8"></div>
      <div class="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
      <div class="h-4 bg-neutral-200 rounded w-2/3 mb-12"></div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="h-48 bg-neutral-200 rounded-3xl"></div>
        <div class="h-48 bg-neutral-200 rounded-3xl"></div>
      </div>
    </div>

    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h2 class="text-2xl font-bold text-neutral-900 mb-2">Oops!</h2>
      <p class="text-neutral-500">{{ error }}</p>
    </div>

    <div v-else-if="chef">
      <!-- Chef Header -->
      <div class="bg-white border-b border-neutral-200 pt-12 pb-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div class="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg overflow-hidden bg-neutral-100 flex-shrink-0">
              <img v-if="chef.profileImage" :src="chef.profileImage" class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center text-6xl">🧑‍🍳</div>
            </div>
            
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">
                  {{ chef.cuisineType || 'Varied' }}
                </span>
                <span class="flex items-center gap-1 text-sm font-bold text-yellow-500">
                  <Star class="w-4 h-4 fill-current" /> 4.9 (120 reviews)
                </span>
              </div>
              <h1 class="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4">
                Chef {{ chef.user?.email?.split('@')[0] }}
              </h1>
              <p class="text-lg text-neutral-600 max-w-2xl leading-relaxed">
                {{ chef.bio || 'A passionate chef crafting delicious meals for you.' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Menus Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 class="text-3xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
          <ChefHat class="w-8 h-8 text-orange-500" />
          Available Menus
        </h2>

        <div v-if="!chef.menus || chef.menus.length === 0" class="bg-white rounded-3xl p-12 text-center border border-neutral-200">
          <p class="text-neutral-500 text-lg">This chef hasn't added any menus yet.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="menu in chef.menus" :key="menu.id" class="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
            <div class="h-48 bg-neutral-100 relative overflow-hidden">
              <img v-if="menu.imageUrl" :src="menu.imageUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div v-else class="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center text-neutral-400">
                <ChefHat class="w-12 h-12" />
              </div>
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl font-bold text-neutral-900 shadow-sm flex items-center gap-1">
                ${{ (menu.price / 100).toFixed(2) }}
              </div>
            </div>
            
            <div class="p-6 flex-1 flex flex-col">
              <h3 class="text-2xl font-bold text-neutral-900 mb-2">{{ menu.title }}</h3>
              <p class="text-neutral-600 mb-6 flex-1">{{ menu.description }}</p>
              
              <div class="flex items-center gap-2 text-sm font-medium text-neutral-500 mb-6 bg-neutral-50 px-3 py-2 rounded-lg">
                <Clock class="w-4 h-4 text-orange-500" />
                {{ menu.recurringType.replace('_', ' ') }}
              </div>
              
              <button @click="handleSubscribe(menu.id)" class="w-full py-4 rounded-xl bg-neutral-900 hover:bg-orange-600 text-white font-bold transition-colors flex items-center justify-center gap-2">
                <CreditCard class="w-5 h-5" />
                {{ menu.recurringType === 'ONE_TIME' ? 'Order Now' : 'Subscribe' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
