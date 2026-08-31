<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form States
const step = ref<1 | 2>(1)
const email = ref('')
const password = ref('')
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

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})

// Focus management for OTP inputs
const handleOtpInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const val = target.value.replace(/[^0-9]/g, '')
  otpDigits.value[index] = val.slice(-1)

  if (val && index < 5) {
    const nextInput = document.getElementById(`otp-digit-${index + 1}`) as HTMLInputElement
    if (nextInput) nextInput.focus()
  }
}

const handleOtpKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    const prevInput = document.getElementById(`otp-digit-${index - 1}`) as HTMLInputElement
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
  const targetInput = document.getElementById(`otp-digit-${targetIdx}`) as HTMLInputElement
  if (targetInput) targetInput.focus()
}

// Step 1: Send OTP Code
const handleSendCode = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter your email and password.'
    return
  }

  loading.value = true
  error.value = ''
  infoMessage.value = ''

  // Attempt sending OTP
  const result = await authStore.sendOtp(email.value)
  loading.value = false

  if (!result.success) {
    error.value = result.error || 'Failed to dispatch verification code.'
    return
  }

  infoMessage.value = result.message || `Verification code sent to ${email.value}`
  const otpCode = result.debugOtp || result.mockCode
  if (otpCode) {
    mockOtpCode.value = otpCode
  }

  otpDigits.value = ['', '', '', '', '', '']
  step.value = 2
  startCooldown(60)
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


// Step 2: Verify OTP Code & Sign In
const handleVerifyLogin = async () => {
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
      password: password.value,
    },
  })

  loading.value = false

  if (!result.success) {
    error.value = result.error || 'Invalid verification code.'
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
          {{ step === 1 ? 'Welcome back' : 'Email Verification' }}
        </h2>
        <p class="mt-2 text-center text-sm text-neutral-600">
          <template v-if="step === 1">
            Or
            <NuxtLink to="/auth/signup" class="font-medium text-orange-600 hover:text-orange-500 transition-colors">
              create a new account
            </NuxtLink>
          </template>
          <template v-else>
            Enter the 6-digit verification code sent to <br>
            <span class="font-bold text-neutral-900">{{ email }}</span>
          </template>
        </p>
      </div>
      
      <!-- Step Indicator Pill -->
      <div class="flex items-center justify-center gap-2">
        <span :class="['h-2 rounded-full transition-all duration-300', step === 1 ? 'w-8 bg-orange-600' : 'w-2 bg-neutral-300']"></span>
        <span :class="['h-2 rounded-full transition-all duration-300', step === 2 ? 'w-8 bg-orange-600' : 'w-2 bg-neutral-300']"></span>
      </div>

      <!-- STEP 1: Email & Password Form -->
      <form v-if="step === 1" class="mt-6 space-y-6" @submit.prevent="handleSendCode">
        <div class="space-y-4">
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
          <div>
            <label for="password" class="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-700 text-sm">
          <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <div class="font-semibold mb-1">{{ error }}</div>
            <div v-if="error.toLowerCase().includes('no account') || error.toLowerCase().includes('not found') || error.toLowerCase().includes('sign up')" class="mt-2 pt-2 border-t border-red-200">
              <NuxtLink :to="{ path: '/auth/signup', query: { email } }" class="inline-flex items-center gap-1 text-orange-600 font-bold hover:text-orange-700 transition-colors">
                Create account for {{ email }} &rarr;
              </NuxtLink>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 shadow-md"
          >
            <span v-if="loading">Sending code...</span>
            <span v-else class="flex items-center gap-2">
              Send Code &rarr;
            </span>
          </button>
        </div>
      </form>

      <!-- STEP 2: 6-Digit OTP Verification Form -->
      <form v-else class="mt-6 space-y-6" @submit.prevent="handleVerifyLogin">
        
        <!-- Info Banner / Mock Code Notice -->
        <div v-if="infoMessage" class="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 text-xs font-medium flex items-center gap-2">
          <svg class="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span>{{ infoMessage }}</span>
            <span v-if="mockOtpCode" class="block font-bold mt-0.5">Demo OTP Code: <code class="bg-orange-200 px-1.5 py-0.5 rounded text-orange-900">{{ mockOtpCode }}</code></span>
          </div>
        </div>

        <!-- 6 Digit Input Grid -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 text-center mb-3">6-Digit Code</label>
          <div class="flex justify-between items-center gap-2" @paste="handleOtpPaste">
            <input
              v-for="(digit, idx) in otpDigits"
              :key="idx"
              :id="`otp-digit-${idx}`"
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
            <span v-else>Verify & Proceed</span>
          </button>

          <div class="flex items-center justify-between text-xs text-neutral-500 pt-2">
            <button
              type="button"
              @click="step = 1"
              class="text-neutral-600 hover:text-neutral-900 font-semibold transition-colors flex items-center gap-1"
            >
              &larr; Back to login
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
