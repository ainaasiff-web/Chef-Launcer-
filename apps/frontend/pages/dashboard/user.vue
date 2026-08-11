<script setup lang="ts">
import { ref } from 'vue'
import { ShoppingBag, CalendarCheck, ChefHat, ArrowRight } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: ['auth'] })

const authStore = useAuthStore()
const tabs = ref('subscriptions')

const stats = [
  { label: 'Active Subscriptions', value: '0', icon: CalendarCheck, color: 'orange' },
  { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'blue' },
]
</script>

<template>
  <div class="bg-neutral-100 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <p class="text-sm font-medium text-neutral-500 mb-1">Welcome back 👋</p>
          <h1 class="text-3xl font-extrabold text-neutral-900">My Dashboard</h1>
          <p class="text-neutral-500 mt-1">{{ authStore.user?.email }}</p>
        </div>
        <NuxtLink
          to="/chefs"
          class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
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
            My Subscriptions
          </button>
          <button
            @click="tabs = 'orders'"
            :class="['px-6 py-4 text-sm font-semibold transition-colors', tabs === 'orders' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-neutral-500 hover:text-neutral-700']"
          >
            Order History
          </button>
        </div>

        <div class="p-8 text-center py-12">
          <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <component :is="tabs === 'subscriptions' ? CalendarCheck : ShoppingBag" class="w-8 h-8 text-orange-400" />
          </div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-2">
            {{ tabs === 'subscriptions' ? 'No active subscriptions' : 'No orders yet' }}
          </h3>
          <p class="text-neutral-500 mb-6 max-w-sm mx-auto">
            {{ tabs === 'subscriptions'
              ? 'Find a chef you love and subscribe to their weekly or monthly menu.'
              : 'Your one-time orders will appear here after checkout.' }}
          </p>
          <NuxtLink
            to="/chefs"
            class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <ChefHat class="w-5 h-5" /> Explore Chefs
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>
