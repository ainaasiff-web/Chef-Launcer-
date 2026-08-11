<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth']
})

const authStore = useAuthStore()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900">Diner Dashboard</h1>
          <p class="text-neutral-500 mt-1">Welcome back, {{ authStore.user?.email }}</p>
        </div>
        <NuxtLink to="/chefs" class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
          Find New Menus
        </NuxtLink>
      </div>

      <div class="grid md:grid-cols-2 gap-6 mb-12">
        <div class="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
          <div class="text-sm font-medium text-neutral-500 mb-2">Active Subscriptions</div>
          <div class="text-3xl font-bold text-neutral-900">0</div>
        </div>
        <div class="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
          <div class="text-sm font-medium text-neutral-500 mb-2">Total Orders</div>
          <div class="text-3xl font-bold text-neutral-900">0</div>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-bold text-neutral-900 mb-6">Your Subscriptions</h2>
        <div class="bg-neutral-50 rounded-2xl border border-neutral-100 p-12 text-center text-neutral-500">
          You don't have any active subscriptions. Explore our talented chefs to get started!
        </div>
      </div>
    </div>
  </div>
</template>
