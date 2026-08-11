<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

const router = useRouter()
const authStore = useAuthStore()
const { fetchApi } = useApi()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const { data, error: apiError } = await fetchApi<{ token: string, user: any }>('/auth/login', {
    method: 'POST',
    body: { email: email.value, password: password.value }
  })
  
  loading.value = false
  
  if (apiError) {
    error.value = apiError
    return
  }
  
  if (data) {
    authStore.setAuth(data.token, data.user)
    router.push(data.user.role === 'CHEF' ? '/dashboard/chef' : '/dashboard/user')
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-neutral-100">
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-neutral-900">
          Welcome back
        </h2>
        <p class="mt-2 text-center text-sm text-neutral-600">
          Or
          <NuxtLink to="/auth/signup" class="font-medium text-orange-600 hover:text-orange-500 transition-colors">
            create a new account
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-neutral-700 mb-1">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email" class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all" placeholder="you@example.com">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password" class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all" placeholder="••••••••">
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
          {{ error }}
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70">
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
