<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto w-full p-4 rounded-2xl shadow-xl border flex items-start gap-3 bg-white border-neutral-200 backdrop-blur-md"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 mt-0.5">
          <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-500" />
          <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-500" />
          <Info v-else class="w-5 h-5 text-blue-500" />
        </div>

        <!-- Text content -->
        <div class="flex-1">
          <h4 class="text-sm font-bold text-neutral-900">{{ toast.title }}</h4>
          <p v-if="toast.description" class="text-xs text-neutral-500 mt-0.5 leading-relaxed">{{ toast.description }}</p>
        </div>

        <!-- Close button -->
        <button
          @click="removeToast(toast.id)"
          class="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-lg hover:bg-neutral-100"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
