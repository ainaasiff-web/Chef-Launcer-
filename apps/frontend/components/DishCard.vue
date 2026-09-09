<script setup lang="ts">
import { ShoppingBag } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  description?: string
  price: number | string
  imageUrl?: string
  mealCategory?: string
  buttonBgClass?: string
}>()

const emit = defineEmits(['order'])

const defaultDishImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target && target.src !== defaultDishImage) {
    target.src = defaultDishImage
  }
}

const formatPrice = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '$15.00'
  const str = String(val).replace(/[^0-9.]/g, '')
  const num = parseFloat(str)
  if (isNaN(num) || num === 0) return '$15.00'
  let p = num
  if (p > 500) p = p / 100
  return '$' + p.toFixed(2)
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between">
    <div>
      <div class="h-44 bg-neutral-100 relative overflow-hidden">
        <img
          :src="imageUrl || defaultDishImage"
          @error="handleImageError"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          :alt="title"
        >
        <div class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl font-bold text-neutral-900 text-base shadow-sm">
          {{ formatPrice(price) }}
        </div>
      </div>

      <div class="p-5">
        <h4 class="text-lg font-bold text-neutral-900 mb-1.5">{{ title }}</h4>
        <p class="text-neutral-500 text-xs leading-relaxed mb-4 line-clamp-3">{{ description || 'Freshly prepared meal.' }}</p>
      </div>
    </div>

    <div class="px-5 pb-5">
      <button
        @click="emit('order')"
        :class="['w-full py-3 rounded-xl text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm', buttonBgClass || 'bg-orange-600 hover:bg-orange-700']"
      >
        <ShoppingBag class="w-4 h-4" />
        <span>Order {{ mealCategory || 'Meal' }} · {{ formatPrice(price) }}</span>
      </button>
    </div>
  </div>
</template>
