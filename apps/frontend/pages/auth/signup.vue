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
const role = ref<'USER' | 'CHEF'>('USER')
const loading = ref(false)
const error = ref('')

const handleSignup = async () => {
  loading.value = true
  error.value = ''
  
  const { data, error: apiError } = await fetchApi<{ token: string, user: any }>('/auth/signup', {
    method: 'POST',
    body: { email: email.value, password: password.value, role: role.value }
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
          Create an account
        </h2>
        <p class="mt-2 text-center text-sm text-neutral-600">
          Already have an account?
          <NuxtLink to="/auth/login" class="font-medium text-orange-600 hover:text-orange-500 transition-colors">
            Log in here
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div class="flex p-1 space-x-1 bg-neutral-100 rounded-xl">
          <button type="button" @click="role = 'USER'" :class="['w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all', role === 'USER' ? 'bg-white shadow text-orange-600' : 'text-neutral-500 hover:bg-neutral-200']">
            Diner
          </button>
          <button type="button" @click="role = 'CHEF'" :class="['w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all', role === 'CHEF' ? 'bg-white shadow text-orange-600' : 'text-neutral-500 hover:bg-neutral-200']">
            Chef
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-neutral-700 mb-1">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email" class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all" placeholder="you@example.com">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <input id="password" name="password" type="password" required v-model="password" class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all" placeholder="••••••••">
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
          {{ error }}
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70">
            <span v-if="loading">Creating account...</span>
            <span v-else>Sign up as {{ role === 'CHEF' ? 'Chef' : 'Diner' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
