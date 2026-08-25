<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const phone = ref('')
const dob = ref('')
const password = ref('')
const role = ref<'diner' | 'chef'>('diner')
const loading = ref(false)
const error = ref('')

onMounted(() => {
  if (route.query.email && typeof route.query.email === 'string') {
    email.value = route.query.email
  }
})

const handleSignup = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill out all required fields.'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long.'
    return
  }

  loading.value = true
  error.value = ''
  
  const result = await authStore.signup({
    name: name.value,
    email: email.value,
    phone: phone.value,
    dob: dob.value,
    password: password.value,
    role: role.value,
  })
  
  loading.value = false
  
  if (!result.success) {
    error.value = result.error || 'Failed to create account.'
    return
  }
  
  const userRole = (result.user?.role || '').toLowerCase()
  const targetPath = userRole === 'chef' ? '/dashboard/chef' : '/dashboard/user'
  await navigateTo(targetPath)
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
          <button type="button" @click="role = 'diner'" :class="['w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all', role === 'diner' ? 'bg-white shadow text-orange-600 font-bold' : 'text-neutral-500 hover:bg-neutral-200']">
            Diner
          </button>
          <button type="button" @click="role = 'chef'" :class="['w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all', role === 'chef' ? 'bg-white shadow text-orange-600 font-bold' : 'text-neutral-500 hover:bg-neutral-200']">
            Chef
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label for="full-name" class="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
            <input id="full-name" name="name" type="text" autocomplete="name" required v-model="name" class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all" placeholder="John Doe">
          </div>
          <div>
            <label for="email-address" class="block text-sm font-medium text-neutral-700 mb-1">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email" class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all" placeholder="you@example.com">
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="phone-number" class="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
              <input id="phone-number" name="phone" type="tel" autocomplete="tel" v-model="phone" class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all" placeholder="+1 555-0199">
            </div>
            <div>
              <label for="date-of-birth" class="block text-sm font-medium text-neutral-700 mb-1">Date of Birth</label>
              <input id="date-of-birth" name="dob" type="date" v-model="dob" class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all">
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <input id="password" name="password" type="password" required v-model="password" class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all" placeholder="•••••••• (min 6 characters)">
          </div>
        </div>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-red-700 text-sm">
          <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70">
            <span v-if="loading">Creating account...</span>
            <span v-else>Sign up as {{ role === 'chef' ? 'Chef' : 'Diner' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
