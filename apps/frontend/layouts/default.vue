<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import { Menu, X, ChefHat, User } from 'lucide-vue-next'
import { ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 font-sans text-neutral-900">
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="bg-orange-500 p-2 rounded-xl text-white">
              <ChefHat class="w-6 h-6" />
            </div>
            <span class="font-bold text-xl tracking-tight text-neutral-800">Chef Launcher</span>
          </NuxtLink>
          
          <nav class="hidden md:flex gap-8 items-center">
            <NuxtLink to="/chefs" class="text-sm font-medium text-neutral-600 hover:text-orange-500 transition-colors">Find Chefs</NuxtLink>
            
            <template v-if="!authStore.isAuthenticated">
              <NuxtLink to="/auth/login" class="text-sm font-medium text-neutral-600 hover:text-orange-500 transition-colors">Log in</NuxtLink>
              <NuxtLink to="/auth/signup" class="text-sm font-medium bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-all shadow-sm hover:shadow-md">Sign up</NuxtLink>
            </template>
            
            <template v-else>
              <NuxtLink :to="authStore.isChef ? '/dashboard/chef' : '/dashboard/user'" class="text-sm font-medium text-neutral-600 hover:text-orange-500 transition-colors">Dashboard</NuxtLink>
              <button @click="handleLogout" class="text-sm font-medium text-neutral-600 hover:text-red-500 transition-colors flex items-center gap-2">
                Log out
              </button>
            </template>
          </nav>
          
          <button class="md:hidden" @click="isMenuOpen = !isMenuOpen">
            <Menu v-if="!isMenuOpen" class="w-6 h-6 text-neutral-600" />
            <X v-else class="w-6 h-6 text-neutral-600" />
          </button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-neutral-100 p-4 absolute w-full left-0">
        <nav class="flex flex-col gap-4">
          <NuxtLink to="/chefs" class="font-medium text-neutral-600" @click="isMenuOpen = false">Find Chefs</NuxtLink>
          <template v-if="!authStore.isAuthenticated">
            <NuxtLink to="/auth/login" class="font-medium text-neutral-600" @click="isMenuOpen = false">Log in</NuxtLink>
            <NuxtLink to="/auth/signup" class="font-medium text-orange-500" @click="isMenuOpen = false">Sign up</NuxtLink>
          </template>
          <template v-else>
            <NuxtLink :to="authStore.isChef ? '/dashboard/chef' : '/dashboard/user'" class="font-medium text-neutral-600" @click="isMenuOpen = false">Dashboard</NuxtLink>
            <button @click="handleLogout(); isMenuOpen = false" class="text-left font-medium text-red-500">Log out</button>
          </template>
        </nav>
      </div>
    </header>

    <main>
      <slot />
    </main>
    
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
