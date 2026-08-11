<script setup lang="ts">
import { ArrowRight, Star, ChefHat, CalendarClock, TrendingUp } from 'lucide-vue-next'
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-neutral-900 text-white min-h-[90vh] flex items-center">
      <!-- Abstract gradient background -->
      <div class="absolute inset-0 z-0">
        <div class="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-orange-600/30 blur-[120px] mix-blend-screen"></div>
        <div class="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-rose-600/20 blur-[120px] mix-blend-screen"></div>
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <span class="flex h-2 w-2 rounded-full bg-orange-400"></span>
            <span class="text-sm font-medium text-orange-50">The future of private dining</span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
            World-class chefs.<br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
              Delivered weekly.
            </span>
          </h1>
          
          <p class="text-xl md:text-2xl text-neutral-300 mb-10 max-w-2xl leading-relaxed">
            Subscribe to exclusive menus crafted by top-tier culinary artists. Experience restaurant-quality meals in the comfort of your home.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink to="/chefs" class="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(249,115,22,0.6)] hover:shadow-[0_0_60px_-15px_rgba(249,115,22,0.8)] hover:-translate-y-1">
              Explore Menus
              <ArrowRight class="w-5 h-5" />
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
              Apply as a Chef
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">How Chef Launcher Works</h2>
          <p class="text-lg text-neutral-600 max-w-2xl mx-auto">A seamless platform connecting food lovers with independent culinary creators.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:shadow-xl hover:border-orange-100 transition-all group">
            <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white text-orange-600 transition-colors">
              <ChefHat class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-bold mb-3">Discover Chefs</h3>
            <p class="text-neutral-600">Browse profiles of vetted chefs specializing in various cuisines, from authentic Italian to modern fusion.</p>
          </div>

          <div class="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:shadow-xl hover:border-orange-100 transition-all group">
            <div class="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-500 group-hover:text-white text-rose-600 transition-colors">
              <CalendarClock class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-bold mb-3">Subscribe to Menus</h3>
            <p class="text-neutral-600">Choose one-time orders or set up a weekly subscription for your favorite dishes. Cancel or pause anytime.</p>
          </div>

          <div class="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:shadow-xl hover:border-orange-100 transition-all group">
            <div class="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white text-amber-600 transition-colors">
              <TrendingUp class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-bold mb-3">Support Creators</h3>
            <p class="text-neutral-600">Empower independent chefs to build their brand and earn directly through their passion for food.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Chefs -->
    <section class="py-24 bg-neutral-900 text-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Trending Chefs</h2>
            <p class="text-neutral-400">The most popular culinary creators this week.</p>
          </div>
          <NuxtLink to="/chefs" class="hidden md:flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium">
            View all chefs <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Placeholder Chefs -->
          <div v-for="i in 3" :key="i" class="bg-neutral-800 rounded-3xl overflow-hidden border border-neutral-700 hover:border-orange-500/50 transition-all hover:-translate-y-2 group">
            <div class="h-48 bg-neutral-700 relative">
              <img :src="`https://images.unsplash.com/photo-${1570197781342 + i}?w=800&auto=format&fit=crop`" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Chef food">
              <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full border-2 border-white bg-neutral-600 overflow-hidden">
                    <img :src="`https://i.pravatar.cc/150?u=${i}`" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <div class="font-bold">Chef Name {{i}}</div>
                    <div class="text-sm text-neutral-300">Italian Cuisine</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                  <Star class="w-4 h-4 fill-current" />
                  4.9 (120+ reviews)
                </div>
              </div>
              <button class="w-full py-3 rounded-xl bg-white/10 hover:bg-orange-500 text-white font-medium transition-colors">
                View Profile & Menus
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
