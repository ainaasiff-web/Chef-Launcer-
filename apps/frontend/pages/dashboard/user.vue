<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ShoppingBag, CalendarCheck, ChefHat, ArrowRight, CheckCircle2, Clock } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const authStore = useAuthStore()
const { fetchApi } = useApi()

const tabs = ref<'subscriptions' | 'orders'>('subscriptions')
const subscriptionsList = ref<any[]>([])
const ordersList = ref<any[]>([])
const loading = ref(true)
const showSuccessBanner = ref(route.query.success === 'true')

onMounted(async () => {
  try {
    const { data: subData } = await fetchApi<any>('/subscriptions')
    if (subData?.data && Array.isArray(subData.data)) {
      subscriptionsList.value = subData.data
    }

    const { data: orderData } = await fetchApi<any>('/orders/me')
    if (orderData?.data && Array.isArray(orderData.data)) {
      ordersList.value = orderData.data
    }
  } catch (err) {
    console.error('Failed to load user dashboard data:', err)
  } finally {
    loading.value = false
  }
})

const defaultDishImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop'

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target && target.src !== defaultDishImage) {
    target.src = defaultDishImage
  }
}

const activeSubscriptions = computed(() =>
  subscriptionsList.value.filter(s => s.status === 'active' && s.menu?.subscriptionType !== 'one_time')
)

const ordersHistory = computed(() => {
  const subOrders = subscriptionsList.value
    .filter(s => s.menu?.subscriptionType === 'one_time' || s.status === 'canceled')
    .map(s => ({
      id: s.id,
      orderNumber: `ORD-${s.id.slice(0, 5).toUpperCase()}`,
      dishName: s.menu?.title || 'One-time Order',
      category: s.menu?.subscriptionType || 'Subscription',
      price: s.menu?.price || 0,
      status: s.status || 'completed',
      imageUrl: s.menu?.imageUrl || s.menu?.image_url || s.menu?.image || defaultDishImage,
      createdAt: s.createdAt || new Date(),
    }))

  const apiOrders = ordersList.value.map(o => ({
    id: o.id,
    orderNumber: o.orderNumber || o.order_number || `ORD-${o.id.slice(0, 5).toUpperCase()}`,
    dishName: o.dishName || 'Dish Order',
    category: o.category || o.mealType || 'Main Dish',
    price: o.price || 0,
    status: o.status || 'confirmed',
    imageUrl: o.imageUrl || o.image_url || o.image || defaultDishImage,
    createdAt: o.createdAt || new Date(),
  }))

  return [...apiOrders, ...subOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const stats = computed(() => [
  { label: 'Active Subscriptions', value: activeSubscriptions.value.length.toString(), icon: CalendarCheck, color: 'orange' },
  { label: 'Total Orders & Subscriptions', value: (subscriptionsList.value.length + ordersList.value.length).toString(), icon: ShoppingBag, color: 'blue' },
])
</script>

<template>
  <div class="bg-neutral-100 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Success Notification Banner -->
      <div v-if="showSuccessBanner" class="mb-8 p-5 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-fade-in">
        <div class="flex items-center gap-3">
          <CheckCircle2 class="w-7 h-7 text-emerald-100 shrink-0" />
          <div>
            <div class="font-bold text-lg">Order Confirmed!</div>
            <div class="text-emerald-100 text-sm">Your order / subscription was processed successfully and added to your account.</div>
          </div>
        </div>
        <button @click="showSuccessBanner = false" class="text-emerald-200 hover:text-white font-bold text-sm px-3 py-1 bg-emerald-600 rounded-lg transition-colors">
          Dismiss
        </button>
      </div>

      <!-- Header & Profile Card -->
      <div class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm font-medium text-neutral-500">Welcome back 👋</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 uppercase">{{ authStore.user?.role || 'diner' }}</span>
          </div>
          <h1 class="text-3xl font-extrabold text-neutral-900">{{ authStore.user?.name || authStore.user?.email }}</h1>
          <div class="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mt-2">
            <span><strong>Email:</strong> {{ authStore.user?.email }}</span>
            <span v-if="authStore.user?.phone"><strong>Phone:</strong> {{ authStore.user?.phone }}</span>
            <span v-if="authStore.user?.dob"><strong>DOB:</strong> {{ authStore.user?.dob }}</span>
          </div>
        </div>
        <NuxtLink
          to="/chefs"
          class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm shrink-0"
        >
          <ChefHat class="w-5 h-5" />
          Find New Menus
        </NuxtLink>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4"
        >
          <div :class="`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-600`">
            <component :is="stat.icon" class="w-6 h-6" />
          </div>
          <div>
            <div class="text-2xl font-extrabold text-neutral-900">{{ stat.value }}</div>
            <div class="text-sm text-neutral-500">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Promo Banner -->
      <div class="bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-white">
          <div class="font-bold text-lg mb-1">Explore 6 world-class chefs</div>
          <div class="text-orange-100 text-sm">Subscribe to handcrafted menus from Italian, Japanese, French, and more.</div>
        </div>
        <NuxtLink to="/chefs" class="flex-shrink-0 bg-white text-orange-600 px-6 py-2.5 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-sm inline-flex items-center gap-2">
          Browse Chefs <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div class="flex border-b border-neutral-100">
          <button
            @click="tabs = 'subscriptions'"
            :class="['px-6 py-4 text-sm font-semibold transition-colors', tabs === 'subscriptions' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-neutral-500 hover:text-neutral-700']"
          >
            My Subscriptions ({{ activeSubscriptions.length }})
          </button>
          <button
            @click="tabs = 'orders'"
            :class="['px-6 py-4 text-sm font-semibold transition-colors', tabs === 'orders' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-neutral-500 hover:text-neutral-700']"
          >
            Order History ({{ ordersHistory.length }})
          </button>
        </div>

        <!-- Subscriptions Tab -->
        <div v-if="tabs === 'subscriptions'" class="p-6">
          <div v-if="loading" class="py-12 text-center text-neutral-400">Loading subscriptions...</div>
          <div v-else-if="activeSubscriptions.length === 0" class="p-8 text-center py-12">
            <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarCheck class="w-8 h-8 text-orange-400" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 mb-2">No active subscriptions</h3>
            <p class="text-neutral-500 mb-6 max-w-sm mx-auto">
              Find a chef you love and subscribe to their weekly or monthly menu.
            </p>
            <NuxtLink
              to="/chefs"
              class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <ChefHat class="w-5 h-5" /> Explore Chefs
            </NuxtLink>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="sub in activeSubscriptions"
              :key="sub.id"
              class="p-6 rounded-2xl border border-neutral-200 bg-neutral-50 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <div class="h-36 bg-neutral-100 relative overflow-hidden rounded-xl mb-4">
                  <img
                    :src="sub.menu?.imageUrl || sub.menu?.image_url || sub.menu?.image || defaultDishImage"
                    @error="handleImageError"
                    class="w-full h-full object-cover"
                    :alt="sub.menu?.title || 'Subscription'"
                  >
                </div>
                <div class="flex items-center justify-between mb-3">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700 uppercase">
                    {{ sub.status }}
                  </span>
                  <span class="text-xs text-neutral-500 flex items-center gap-1">
                    <Clock class="w-3.5 h-3.5" /> {{ sub.menu?.subscriptionType || 'recurring' }}
                  </span>
                </div>
                <h4 class="text-xl font-bold text-neutral-900 mb-1">{{ sub.menu?.title || 'Subscription Plan' }}</h4>
                <p class="text-neutral-500 text-sm mb-4">{{ sub.menu?.description }}</p>
              </div>
              <div class="pt-4 border-t border-neutral-200 flex items-center justify-between">
                <span class="text-lg font-bold text-neutral-900">
                  ${{ (sub.menu?.price ? sub.menu.price / 100 : 0).toFixed(2) }}
                </span>
                <span class="text-xs text-neutral-400 font-mono">ID: {{ sub.id.slice(0, 8) }}...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders History Tab -->
        <div v-if="tabs === 'orders'" class="p-6">
          <div v-if="loading" class="py-12 text-center text-neutral-400">Loading orders...</div>
          <div v-else-if="ordersHistory.length === 0" class="p-8 text-center py-12">
            <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag class="w-8 h-8 text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 mb-2">No past orders yet</h3>
            <p class="text-neutral-500 mb-6 max-w-sm mx-auto">
              Your one-time orders will appear here after checkout.
            </p>
            <NuxtLink
              to="/chefs"
              class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <ChefHat class="w-5 h-5" /> Explore Chefs
            </NuxtLink>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="order in ordersHistory"
              :key="order.id"
              class="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                  <img
                    :src="order.imageUrl || defaultDishImage"
                    @error="handleImageError"
                    class="w-full h-full object-cover"
                    :alt="order.dishName"
                  >
                </div>
                <div>
                  <div class="flex items-center gap-2.5 mb-1.5">
                    <span class="px-3 py-1 rounded-lg text-xs font-extrabold bg-orange-500 text-white tracking-wide font-mono shadow-xs">
                      #{{ order.orderNumber }}
                    </span>
                    <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                      {{ order.category }}
                    </span>
                  </div>
                  <h4 class="font-bold text-neutral-900 text-base">{{ order.dishName }}</h4>
                  <p v-if="order.createdAt" class="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                    <Clock class="w-3.5 h-3.5" />
                    {{ new Date(order.createdAt).toLocaleString() }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="font-extrabold text-neutral-900 text-lg">
                  ${{ (order.price / 100).toFixed(2) }}
                </div>
                <span class="inline-block text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase mt-1">
                  {{ order.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
