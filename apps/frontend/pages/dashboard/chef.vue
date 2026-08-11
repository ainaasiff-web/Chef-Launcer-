<script setup lang="ts">
import { ref } from 'vue'
import { LayoutDashboard, UtensilsCrossed, Users, DollarSign, Plus, Pencil, Trash2, ExternalLink } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: ['auth', 'chef'] })

const authStore = useAuthStore()
const showAddMenu = ref(false)

const stats = [
  { label: 'Total Earnings', value: '$0.00', icon: DollarSign, color: 'green' },
  { label: 'Active Subscribers', value: '0', icon: Users, color: 'blue' },
  { label: 'Active Menus', value: '0', icon: UtensilsCrossed, color: 'orange' },
  { label: 'Total Orders', value: '0', icon: LayoutDashboard, color: 'purple' },
]

const tabs = ref('menus')
</script>

<template>
  <div class="bg-neutral-100 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <p class="text-sm font-medium text-neutral-500 mb-1">Welcome back, Chef 👋</p>
          <h1 class="text-3xl font-extrabold text-neutral-900">Chef Dashboard</h1>
          <p class="text-neutral-500 mt-1">{{ authStore.user?.email }}</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="showAddMenu = true"
            class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
          >
            <Plus class="w-5 h-5" />
            Add Menu
          </button>
          <button class="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
            <ExternalLink class="w-4 h-4" />
            View Profile
          </button>
        </div>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm"
        >
          <div :class="`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-${stat.color}-100 text-${stat.color}-600`">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
          <div class="text-2xl font-extrabold text-neutral-900 mb-1">{{ stat.value }}</div>
          <div class="text-sm text-neutral-500">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Stripe Connect Banner -->
      <div class="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-white">
          <div class="font-bold text-lg mb-1">Connect your Stripe account to get paid</div>
          <div class="text-violet-200 text-sm">Set up payouts so your subscribers can pay you directly.</div>
        </div>
        <button class="flex-shrink-0 bg-white text-violet-700 px-6 py-2.5 rounded-xl font-bold hover:bg-violet-50 transition-colors shadow-sm">
          Connect Stripe →
        </button>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div class="flex border-b border-neutral-100">
          <button
            @click="tabs = 'menus'"
            :class="['px-6 py-4 text-sm font-semibold transition-colors', tabs === 'menus' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-neutral-500 hover:text-neutral-700']"
          >
            My Menus
          </button>
          <button
            @click="tabs = 'subscribers'"
            :class="['px-6 py-4 text-sm font-semibold transition-colors', tabs === 'subscribers' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-neutral-500 hover:text-neutral-700']"
          >
            Subscribers
          </button>
        </div>

        <div class="p-8">
          <div v-if="tabs === 'menus'" class="text-center py-12">
            <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed class="w-8 h-8 text-orange-400" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 mb-2">No menus yet</h3>
            <p class="text-neutral-500 mb-6 max-w-sm mx-auto">Start by adding your first menu — it can be a one-time order or a subscription plan.</p>
            <button
              @click="showAddMenu = true"
              class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <Plus class="w-5 h-5" /> Add Your First Menu
            </button>
          </div>

          <div v-if="tabs === 'subscribers'" class="text-center py-12">
            <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users class="w-8 h-8 text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 mb-2">No subscribers yet</h3>
            <p class="text-neutral-500 max-w-sm mx-auto">Once you publish your menus and connect Stripe, subscribers will appear here.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
