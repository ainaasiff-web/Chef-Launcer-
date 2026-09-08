<script setup lang="ts">
import Header from '~/components/Header.vue'
import { ChefHat } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-neutral-50 font-sans text-neutral-900">
    <Header />

    <main>
      <slot />
    </main>
    
    <ToastContainer />

    <footer class="bg-white border-t border-neutral-200 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2 text-neutral-800 font-bold">
          <ChefHat class="w-5 h-5 text-orange-500" />
          Chef Launcher
        </div>
        <div class="text-neutral-500 text-sm">
          &copy; {{ new Date().getFullYear() }} Chef Launcher. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>
