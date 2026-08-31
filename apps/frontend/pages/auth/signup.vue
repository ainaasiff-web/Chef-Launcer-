<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Form & Stepped State
const step = ref<1 | 2>(1)
const name = ref('')
const email = ref('')
const phone = ref('')
const dob = ref('')
const password = ref('')
const role = ref<'diner' | 'chef'>('diner')
const otpDigits = ref(['', '', '', '', '', ''])

const loading = ref(false)
const error = ref('')
const infoMessage = ref('')
const mockOtpCode = ref('')

// Resend Cooldown Timer
const cooldownSeconds = ref(0)
let cooldownTimer: any = null

const startCooldown = (seconds = 60) => {
  cooldownSeconds.value = seconds
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    if (cooldownSeconds.value > 0) {
      cooldownSeconds.value--
    } else {
      clearInterval(cooldownTimer)
    }
  }, 1000)
}

onMounted(() => {
  if (route.query.email && typeof route.query.email === 'string') {
    email.value = route.query.email
  }
})

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})

// Focus management for 6-digit OTP inputs
const handleOtpInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const val = target.value.replace(/[^0-9]/g, '')
  otpDigits.value[index] = val.slice(-1)

  if (val && index < 5) {
    const nextInput = document.getElementById(`signup-otp-digit-${index + 1}`) as HTMLInputElement
    if (nextInput) nextInput.focus()
  }
}

const handleOtpKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    const prevInput = document.getElementById(`signup-otp-digit-${index - 1}`) as HTMLInputElement
    if (prevInput) {
      prevInput.focus()
      otpDigits.value[index - 1] = ''
    }
  }
}

const handleOtpPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text') || ''
  const digits = pasted.replace(/[^0-9]/g, '').slice(0, 6).split('')
  
  digits.forEach((d, idx) => {
    if (idx < 6) {
      otpDigits.value[idx] = d
    }
  })
  
  const targetIdx = Math.min(digits.length, 5)
  const targetInput = document.getElementById(`signup-otp-digit-${targetIdx}`) as HTMLInputElement
  if (targetInput) targetInput.focus()
}

// Step 1: Send OTP for Signup
const handleSendCode = async () => {
  if (!name.value || !email.value || !password.value) {
    error.value = 'Please fill out all required fields.'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long.'
    return
  }

  loading.value = true
  error.value = ''
  infoMessage.value = ''

  const result = await authStore.sendOtp(email.value)
  loading.value = false

  if (!result.success) {
    error.value = result.error || 'Failed to send verification code.'
    return
  }

  infoMessage.value = result.message || `Verification code sent to ${email.value}`
  const otpCode = result.debugOtp || result.mockCode
  if (otpCode) {
    mockOtpCode.value = otpCode
  }

  // Reset OTP digits to empty so the user is forced to enter the code manually
  otpDigits.value = ['', '', '', '', '', '']
  step.value = 2
  startCooldown(60)

  setTimeout(() => {
    const firstInput = document.getElementById('signup-otp-digit-0') as HTMLInputElement
    if (firstInput) firstInput.focus()
  }, 100)
}

// Resend OTP Code
const handleResendOtp = async () => {
  if (cooldownSeconds.value > 0 || loading.value) return

  loading.value = true
  error.value = ''
  infoMessage.value = ''

  const result = await authStore.sendOtp(email.value)
  loading.value = false

  if (!result.success) {
    error.value = result.error || 'Failed to resend code.'
    return
  }

  infoMessage.value = 'New code sent successfully!'
  const otpCode = result.debugOtp || result.mockCode
  if (otpCode) {
    mockOtpCode.value = otpCode
  }
  otpDigits.value = ['', '', '', '', '', '']
  startCooldown(60)
}


// Step 2: Verify OTP & Finish Signup
const handleVerifyAndSignup = async () => {
  const fullOtp = otpDigits.value.join('')

  if (fullOtp.length !== 6) {
    error.value = 'Please enter the full 6-digit verification code.'
    return
  }

  loading.value = true
  error.value = ''

  const result = await authStore.verifyOtp({
    email: email.value,
    otp: fullOtp,
    userData: {
      name: name.value,
      phone: phone.value,
      dob: dob.value,
      role: role.value,
      password: password.value,
    },
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
      
      <!-- Header -->
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-neutral-900">
          {{ step === 1 ? 'Create an account' : 'Verify Email' }}
        </h2>
        <p class="mt-2 text-center text-sm text-neutral-600">
          <template v-if="step === 1">
            Already have an account?
            <NuxtLink to="/auth/login" class="font-medium text-orange-600 hover:text-orange-500 transition-colors">
              Log in here
            </NuxtLink>
          </template>
          <template v-else>
            Enter the 6-digit verification code sent to <br>
            <span class="font-bold text-neutral-900">{{ email }}</span>
          </template>
        </p>
      </div>

      <!-- Progress Pill -->
      <div class="flex items-center justify-center gap-2">
        <span :class="['h-2 rounded-full transition-all duration-300', step === 1 ? 'w-8 bg-orange-600' : 'w-2 bg-neutral-300']"></span>
        <span :class="['h-2 rounded-full transition-all duration-300', step === 2 ? 'w-8 bg-orange-600' : 'w-2 bg-neutral-300']"></span>
      </div>

      <!-- STEP 1: Registration Form -->
      <form v-if="step === 1" class="mt-6 space-y-6" @submit.prevent="handleSendCode">
        
        <!-- Role Selector -->
        <div class="flex p-1 space-x-1 bg-neutral-100 rounded-xl">
          <button
            type="button"
            @click="role = 'diner'"
            :class="['w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all', role === 'diner' ? 'bg-white shadow text-orange-600 font-bold' : 'text-neutral-500 hover:bg-neutral-200']"
          >
            Diner
          </button>
          <button
            type="button"
            @click="role = 'chef'"
            :class="['w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all', role === 'chef' ? 'bg-white shadow text-orange-600 font-bold' : 'text-neutral-500 hover:bg-neutral-200']"
          >
            Chef
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label for="full-name" class="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
            <input
              id="full-name"
              name="name"
              type="text"
              autocomplete="name"
              required
              v-model="name"
              class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label for="email-address" class="block text-sm font-medium text-neutral-700 mb-1">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="phone-number" class="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
              <input
                id="phone-number"
                name="phone"
                type="tel"
                autocomplete="tel"
                v-model="phone"
                class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
                placeholder="+1 555-0199"
              />
            </div>
            <div>
              <label for="date-of-birth" class="block text-sm font-medium text-neutral-700 mb-1">Date of Birth</label>
              <input
                id="date-of-birth"
                name="dob"
                type="date"
                v-model="dob"
                class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
              />
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              v-model="password"
              class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
              placeholder="•••••••• (min 6 characters)"
            />
          </div>
        </div>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-red-700 text-sm">
          <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 shadow-md"
          >
            <span v-if="loading">Sending code...</span>
            <span v-else class="flex items-center gap-2">
              Sign Up &rarr;
            </span>
          </button>
        </div>
      </form>

      <!-- STEP 2: 6-Digit Verification Form -->
      <form v-else class="mt-6 space-y-6" @submit.prevent="handleVerifyAndSignup">
        
        <!-- Info Banner / Mock Code Notice -->
        <div v-if="infoMessage" class="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 text-xs font-medium flex items-center gap-2">
          <svg class="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span>{{ infoMessage }}</span>
            <span v-if="mockOtpCode" class="block font-bold mt-0.5">Test Verification Code: <code class="bg-orange-200 px-1.5 py-0.5 rounded text-orange-900 font-extrabold">{{ mockOtpCode }}</code></span>
          </div>
        </div>

        <!-- 6 Digit Input Grid -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 text-center mb-3">6-Digit Code</label>
          <div class="flex justify-between items-center gap-2" @paste="handleOtpPaste">
            <input
              v-for="(digit, idx) in otpDigits"
              :key="idx"
              :id="`signup-otp-digit-${idx}`"
              type="text"
              inputmode="numeric"
              maxlength="1"
              v-model="otpDigits[idx]"
              @input="e => handleOtpInput(idx, e)"
              @keydown="e => handleOtpKeydown(idx, e)"
              class="w-12 h-14 text-center text-xl font-extrabold text-neutral-900 border-2 border-neutral-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700 text-sm">
          <svg class="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Buttons: Verify & Resend -->
        <div class="space-y-3">
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 shadow-md"
          >
            <span v-if="loading">Verifying code...</span>
            <span v-else>Verify OTP</span>
          </button>


          <div class="flex items-center justify-between text-xs text-neutral-500 pt-2">
            <button
              type="button"
              @click="step = 1"
              class="text-neutral-600 hover:text-neutral-900 font-semibold transition-colors flex items-center gap-1"
            >
              &larr; Back to edit details
            </button>

            <button
              type="button"
              @click="handleResendOtp"
              :disabled="cooldownSeconds > 0 || loading"
              class="text-orange-600 hover:text-orange-700 font-bold disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="cooldownSeconds > 0">Resend code in {{ cooldownSeconds }}s</span>
              <span v-else>Resend OTP</span>
            </button>
          </div>
        </div>
      </form>

    </div>
  </div>
</template>
