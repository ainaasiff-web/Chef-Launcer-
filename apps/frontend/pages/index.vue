<script setup lang="ts">
import { ArrowRight, Star, ChefHat, CalendarClock, TrendingUp, Sparkles } from 'lucide-vue-next'

const featuredChefs = [
  {
    id: 'demo-1',
    name: 'Marco Rossi',
    cuisine: 'Italian',
    rating: 4.9,
    reviews: 142,
    profileImage: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop',
    tagline: 'Handmade pasta & Roman classics'
  },
  {
    id: 'demo-2',
    name: 'Kenji Tanaka',
    cuisine: 'Japanese',
    rating: 5.0,
    reviews: 98,
    profileImage: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop',
    tagline: 'Omakase sushi & seasonal bento'
  },
  {
    id: 'demo-5',
    name: 'Priya Sharma',
    cuisine: 'Indian',
    rating: 4.9,
    reviews: 118,
    profileImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
    tagline: 'Aromatic curries & fresh thalis'
  },
]

const stats = [
  { value: '200+', label: 'Vetted Chefs' },
  { value: '50K+', label: 'Meals Delivered' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '30+', label: 'Cuisines' },
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-neutral-950 text-white min-h-[92vh] flex items-center">
      <!-- Gradient orbs -->
      <div class="absolute inset-0 z-0 overflow-hidden">
        <div class="absolute -top-[20%] right-[5%] w-[55%] h-[65%] rounded-full bg-orange-600/25 blur-[130px]"></div>
        <div class="absolute top-[40%] -left-[10%] w-[45%] h-[50%] rounded-full bg-rose-700/20 blur-[130px]"></div>
        <div class="absolute bottom-0 right-[20%] w-[35%] h-[40%] rounded-full bg-amber-600/15 blur-[120px]"></div>
        <!-- Food image overlay -->
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=2000&auto=format&fit=crop"
          class="absolute inset-0 w-full h-full object-cover opacity-10"
          alt="food background"
        >
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-28 w-full">
        <div class="max-w-3xl">
          <!-- Pill badge -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-8">
            <Sparkles class="w-4 h-4 text-orange-400" />
            <span class="text-sm font-medium text-orange-100">The future of private dining is here</span>
          </div>

          <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            World-class chefs.<br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400">
              Delivered to you.
            </span>
          </h1>

          <p class="text-xl text-neutral-300 mb-10 max-w-xl leading-relaxed">
            Subscribe to exclusive menus crafted by top culinary artists.
            Restaurant-quality meals, at home, on your schedule.
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink
              to="/chefs"
              class="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_50px_-10px_rgba(249,115,22,0.7)] hover:shadow-[0_0_70px_-15px_rgba(249,115,22,0.9)] hover:-translate-y-1"
            >
              Explore Chefs
              <ArrowRight class="w-5 h-5" />
            </NuxtLink>
            <NuxtLink
              to="/auth/signup"
              class="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
            >
              Apply as a Chef
            </NuxtLink>
          </div>

          <!-- Stats row -->
          <div class="flex flex-wrap gap-8 mt-14 pt-10 border-t border-white/10">
            <div v-for="stat in stats" :key="stat.label">
              <div class="text-2xl font-extrabold text-white">{{ stat.value }}</div>
              <div class="text-sm text-neutral-400 mt-0.5">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <p class="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">How It Works</p>
          <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Three steps to gourmet dining</h2>
          <p class="text-lg text-neutral-500 max-w-xl mx-auto">A seamless platform connecting food lovers with independent culinary creators.</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(step, i) in [
              { icon: ChefHat, badgeBg: 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white', title: 'Discover Chefs', desc: 'Browse profiles of vetted chefs specializing in cuisines from around the world.' },
              { icon: CalendarClock, badgeBg: 'bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white', title: 'Subscribe to Menus', desc: 'Choose one-time orders or weekly/monthly subscriptions. Pause or cancel anytime.' },
              { icon: TrendingUp, badgeBg: 'bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white', title: 'Support Creators', desc: 'Chefs earn directly from their passion and build their brand on the platform.' },
            ]"
            :key="i"
            class="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors', step.badgeBg]">
              <component :is="step.icon" class="w-7 h-7" />
            </div>
            <div class="text-4xl font-black text-neutral-100 mb-2">0{{ i + 1 }}</div>
            <h3 class="text-xl font-bold mb-3 text-neutral-900">{{ step.title }}</h3>
            <p class="text-neutral-500 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Chefs -->
    <section class="py-24 bg-neutral-950 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <p class="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">Top Picks</p>
            <h2 class="text-3xl md:text-4xl font-bold">Trending This Week</h2>
          </div>
          <NuxtLink to="/chefs" class="hidden md:flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors">
            View all <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <NuxtLink
            v-for="chef in featuredChefs"
            :key="chef.id"
            :to="`/chefs/${chef.id}`"
            class="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 hover:border-orange-500/40 transition-all hover:-translate-y-2 group"
          >
            <div class="h-52 relative overflow-hidden">
              <img :src="chef.coverImage" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" :alt="chef.name">
              <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div class="flex items-center gap-3">
                  <img :src="chef.profileImage" class="w-11 h-11 rounded-full border-2 border-white/30 object-cover">
                  <div>
                    <div class="font-bold text-sm">{{ chef.name }}</div>
                    <div class="text-xs text-neutral-300">{{ chef.cuisine }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-1 text-xs font-bold text-yellow-400 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <Star class="w-3 h-3 fill-current" />
                  {{ chef.rating }}
                </div>
              </div>
            </div>
            <div class="p-5">
              <p class="text-neutral-400 text-sm mb-4">{{ chef.tagline }}</p>
              <div class="w-full py-2.5 rounded-xl bg-white/10 hover:bg-orange-500 text-white text-sm font-semibold transition-colors text-center">
                View Menus →
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-10 text-center md:hidden">
          <NuxtLink to="/chefs" class="inline-flex items-center gap-2 text-orange-400 font-semibold">
            View all chefs <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-gradient-to-br from-orange-500 to-rose-600 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Ready to eat like royalty?
        </h2>
        <p class="text-xl text-orange-100 mb-10 max-w-xl mx-auto">
          Join thousands of food lovers subscribing to handcrafted menus from the world's finest independent chefs.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/signup" class="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all shadow-xl">
            Get Started — It's Free
            <ArrowRight class="w-5 h-5" />
          </NuxtLink>
          <NuxtLink to="/chefs" class="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
            Browse Chefs
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
