<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LayoutDashboard, UtensilsCrossed, Users, DollarSign, Plus, Trash2, Edit3, ExternalLink, X, Clock, Check, EyeOff, Utensils, Calendar } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({ middleware: ['auth', 'chef'] })

const authStore = useAuthStore()
const { fetchApi } = useApi()

const showAddModal = ref(false)
const editingItem = ref<any | null>(null)
const loading = ref(true)
const submitting = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const menusList = ref<any[]>([])
const menuItemsList = ref<any[]>([])
const tabs = ref<'all' | 'set_menu' | 'a_la_carte' | 'subscribers'>('all')

const defaultDishImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop'

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target && target.src !== defaultDishImage) {
    target.src = defaultDishImage
  }
}

// Item form state
const itemType = ref<'SET_MENU' | 'A_LA_CARTE'>('A_LA_CARTE')
const itemName = ref('')
const itemDescription = ref('')
const itemCategory = ref<'Starters' | 'Mains' | 'Desserts' | 'Beverages'>('Mains')
const itemPriceDollars = ref<number | null>(null)
const itemImageUrl = ref('')
const itemIsAvailable = ref(true)
const itemDayOfWeek = ref<string>('MONDAY')
const itemSubscriptionType = ref<'one_time' | 'weekly' | 'monthly'>('one_time')

const fetchAllData = async () => {
  loading.value = true

  // 1. Fetch menus
  const { data: menusRes } = await fetchApi<any>('/menus')
  const mItems = menusRes?.data || menusRes
  if (Array.isArray(mItems)) {
    menusList.value = mItems
  }

  // 2. Fetch menu items if current chef profile exists
  if (authStore.user) {
    const { data: chefRes } = await fetchApi<any>('/chefs')
    const chefs = chefRes?.data || chefRes
    const myProfile = Array.isArray(chefs) ? chefs.find((c: any) => c.user?.email === authStore.user?.email) : null
    
    if (myProfile?.id) {
      const { data: itemsRes } = await fetchApi<any>(`/menu-items?chefId=${myProfile.id}`)
      const items = itemsRes?.data || itemsRes
      if (Array.isArray(items)) {
        menuItemsList.value = items
      }
    }
  }

  loading.value = false
}

onMounted(() => {
  fetchAllData()
})

const resetForm = () => {
  editingItem.value = null
  itemType.value = 'A_LA_CARTE'
  itemName.value = ''
  itemDescription.value = ''
  itemCategory.value = 'Mains'
  itemPriceDollars.value = null
  itemImageUrl.value = ''
  itemIsAvailable.value = true
  itemDayOfWeek.value = 'MONDAY'
  itemSubscriptionType.value = 'one_time'
  errorMsg.value = ''
}

const openCreateModal = () => {
  resetForm()
  showAddModal.value = true
}

const openEditModal = (item: any) => {
  editingItem.value = item
  itemType.value = item.type || 'A_LA_CARTE'
  itemName.value = item.name || item.title || ''
  itemDescription.value = item.description || ''
  itemCategory.value = item.category || 'Mains'
  itemPriceDollars.value = item.price ? Number((item.price / 100).toFixed(2)) : null
  itemImageUrl.value = item.imageUrl || ''
  itemIsAvailable.value = item.isAvailable !== false
  itemDayOfWeek.value = item.dayOfWeek || 'MONDAY'
  showAddModal.value = true
}

const handleSaveItem = async () => {
  if (!itemName.value || !itemPriceDollars.value) {
    errorMsg.value = 'Name and price are required.'
    return
  }

  submitting.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const priceCents = Math.round(Number(itemPriceDollars.value) * 100)

    if (editingItem.value) {
      // Edit existing item
      const endpoint = editingItem.value.type ? `/menu-items/${editingItem.value.id}` : `/menus/${editingItem.value.id}`
      const payload = {
        name: itemName.value,
        title: itemName.value,
        description: itemDescription.value,
        category: itemCategory.value,
        price: priceCents,
        imageUrl: itemImageUrl.value,
        isAvailable: itemIsAvailable.value,
        type: itemType.value,
        dayOfWeek: itemType.value === 'SET_MENU' ? itemDayOfWeek.value : undefined,
      }

      const { error: apiError } = await fetchApi<any>(endpoint, {
        method: 'PUT',
        body: payload,
      })

      if (apiError) {
        errorMsg.value = typeof apiError === 'string' ? apiError : 'Failed to update item'
        submitting.value = false
        return
      }

      successMsg.value = 'Item updated successfully!'
    } else {
      // Create new item
      const endpoint = '/menu-items'
      const payload = {
        name: itemName.value,
        description: itemDescription.value,
        category: itemCategory.value,
        price: priceCents,
        imageUrl: itemImageUrl.value,
        isAvailable: itemIsAvailable.value,
        type: itemType.value,
        dayOfWeek: itemType.value === 'SET_MENU' ? itemDayOfWeek.value : undefined,
      }

      const { error: apiError } = await fetchApi<any>(endpoint, {
        method: 'POST',
        body: payload,
      })

      // Also create entry in /menus if type is SET_MENU
      if (itemType.value === 'SET_MENU') {
        await fetchApi<any>('/menus', {
          method: 'POST',
          body: {
            title: itemName.value,
            description: itemDescription.value,
            price: priceCents,
            subscriptionType: itemSubscriptionType.value,
          }
        })
      }

      if (apiError) {
        errorMsg.value = typeof apiError === 'string' ? apiError : 'Failed to create item'
        submitting.value = false
        return
      }

      successMsg.value = 'Item created successfully!'
    }

    submitting.value = false
    showAddModal.value = false
    resetForm()
    await fetchAllData()
  } catch (err: any) {
    submitting.value = false
    errorMsg.value = err?.message || 'An error occurred while saving item'
  }
}

const handleToggleAvailability = async (item: any) => {
  const newStatus = !(item.isAvailable !== false)
  const { error: apiError } = await fetchApi<any>(`/menu-items/${item.id}`, {
    method: 'PUT',
    body: { isAvailable: newStatus }
  })
  if (apiError) {
    alert(typeof apiError === 'string' ? apiError : 'Failed to update availability')
    return
  }
  item.isAvailable = newStatus
  successMsg.value = `Availability updated for ${item.name || item.title}`
  setTimeout(() => { successMsg.value = '' }, 3000)
}

const handleDeleteItem = async (item: any) => {
  if (!confirm(`Are you sure you want to delete "${item.name || item.title}"?`)) return
  
  const endpoint = item.type ? `/menu-items/${item.id}` : `/menus/${item.id}`
  const { error: apiError } = await fetchApi<any>(endpoint, { method: 'DELETE' })
  
  if (apiError) {
    alert(apiError)
    return
  }
  await fetchAllData()
}

const setMenusCount = computed(() => {
  const countFromMenus = menusList.value.length
  const countFromMenuItems = menuItemsList.value.filter(i => i.type === 'SET_MENU').length
  return Math.max(countFromMenus, countFromMenuItems)
})

const aLaCarteCount = computed(() => {
  return menuItemsList.value.filter(i => i.type === 'A_LA_CARTE').length
})

const displayedItems = computed(() => {
  let combined: any[] = []

  menusList.value.forEach(m => {
    combined.push({
      ...m,
      name: m.title,
      type: 'SET_MENU',
      category: 'Set Package',
      isAvailable: m.isAvailable !== false,
      dayOfWeek: m.dayOfWeek || 'MONDAY',
    })
  })

  menuItemsList.value.forEach(mi => {
    if (!combined.some(c => c.id === mi.id)) {
      combined.push(mi)
    }
  })

  if (tabs.value === 'set_menu') {
    return combined.filter(i => i.type === 'SET_MENU')
  }
  if (tabs.value === 'a_la_carte') {
    return combined.filter(i => i.type === 'A_LA_CARTE')
  }
  return combined
})

const stats = computed(() => [
  { label: 'Set Menus', value: setMenusCount.value.toString(), icon: UtensilsCrossed, color: 'orange' },
  { label: 'À La Carte Dishes', value: aLaCarteCount.value.toString(), icon: Utensils, color: 'emerald' },
  { label: 'Active Subscribers', value: '0', icon: Users, color: 'blue' },
  { label: 'Total Earnings', value: '$0.00', icon: DollarSign, color: 'purple' },
])
</script>

<template>
  <div class="bg-neutral-100 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header & Profile Card -->
      <div class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm font-medium text-neutral-500">Welcome back 👋</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 uppercase">Chef</span>
          </div>
          <h1 class="text-3xl font-extrabold text-neutral-900">{{ authStore.user?.name || authStore.user?.email }}</h1>
          <div class="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mt-2">
            <span><strong>Email:</strong> {{ authStore.user?.email }}</span>
            <span v-if="authStore.user?.phone"><strong>Phone:</strong> {{ authStore.user?.phone }}</span>
            <span v-if="authStore.user?.dob"><strong>DOB:</strong> {{ authStore.user?.dob }}</span>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            @click="openCreateModal"
            class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
          >
            <Plus class="w-5 h-5" />
            Add Menu / Dish
          </button>
          <NuxtLink
            to="/chefs"
            class="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
          >
            <ExternalLink class="w-4 h-4" />
            View Directory
          </NuxtLink>
        </div>
      </div>

      <!-- Success Notification Banner -->
      <div v-if="successMsg" class="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 font-medium animate-fade-in shadow-sm">
        <div class="flex items-center gap-2">
          <Check class="w-5 h-5 text-emerald-600" />
          <span>{{ successMsg }}</span>
        </div>
        <button @click="successMsg = ''" class="text-emerald-600 hover:text-emerald-800">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm"
        >
          <div :class="`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-${stat.color}-100 text-${stat.color}-600`">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
          <div class="text-2xl font-extrabold text-neutral-900 mb-1">{{ stat.value }}</div>
          <div class="text-sm text-neutral-500">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden mb-8">
        <div class="flex flex-wrap border-b border-neutral-100">
          <button
            @click="tabs = 'all'"
            :class="['px-6 py-4 text-sm font-semibold transition-colors', tabs === 'all' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-neutral-500 hover:text-neutral-700']"
          >
            All Items ({{ displayedItems.length }})
          </button>

          <button
            @click="tabs = 'set_menu'"
            :class="['px-6 py-4 text-sm font-semibold transition-colors', tabs === 'set_menu' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-neutral-500 hover:text-neutral-700']"
          >
            Weekly Schedule Menus ({{ setMenusCount }})
          </button>

          <button
            @click="tabs = 'a_la_carte'"
            :class="['px-6 py-4 text-sm font-semibold transition-colors', tabs === 'a_la_carte' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-neutral-500 hover:text-neutral-700']"
          >
            À La Carte Dishes ({{ aLaCarteCount }})
          </button>

          <button
            @click="tabs = 'subscribers'"
            :class="['px-6 py-4 text-sm font-semibold transition-colors', tabs === 'subscribers' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-neutral-500 hover:text-neutral-700']"
          >
            Subscribers (0)
          </button>
        </div>

        <div class="p-8">
          <!-- Items List (All / Set / À La Carte) -->
          <div v-if="tabs !== 'subscribers'">
            <div v-if="loading" class="py-12 text-center text-neutral-400">Loading your menu items...</div>
            
            <div v-else-if="displayedItems.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed class="w-8 h-8 text-orange-400" />
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 mb-2">No items published in this view</h3>
              <p class="text-neutral-500 mb-6 max-w-sm mx-auto">Add weekday schedule menus or individual à la carte dishes to present on your profile.</p>
              <button
                @click="openCreateModal"
                class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <Plus class="w-5 h-5" /> Add New Item
              </button>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="item in displayedItems"
                :key="item.id"
                class="p-6 rounded-2xl border border-neutral-200 bg-neutral-50 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div>
                  <div class="h-36 bg-neutral-100 relative overflow-hidden rounded-xl mb-4">
                    <img
                      :src="item.imageUrl || item.image_url || item.image || defaultDishImage"
                      @error="handleImageError"
                      class="w-full h-full object-cover"
                      :alt="item.name || item.title"
                    >
                  </div>

                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <span :class="['px-2.5 py-1 rounded-lg text-xs font-bold uppercase flex items-center gap-1', item.type === 'SET_MENU' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700']">
                        <Clock v-if="item.type === 'SET_MENU'" class="w-3 h-3" />
                        <Utensils v-else class="w-3 h-3" />
                        {{ item.type === 'SET_MENU' ? 'Weekly Menu' : 'À La Carte' }}
                      </span>
                      
                      <span v-if="item.type === 'SET_MENU' && item.dayOfWeek" class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-900 text-white flex items-center gap-1">
                        <Calendar class="w-3 h-3 text-orange-400" />
                        {{ item.dayOfWeek }}
                      </span>

                      <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-200 text-neutral-700">
                        {{ item.category || 'Mains' }}
                      </span>
                    </div>

                    <div class="flex items-center gap-1">
                      <button
                        @click="handleToggleAvailability(item)"
                        :class="['p-1.5 rounded-lg text-xs font-medium transition-colors', item.isAvailable !== false ? 'text-emerald-600 hover:bg-emerald-50' : 'text-neutral-400 hover:bg-neutral-200']"
                        :title="item.isAvailable !== false ? 'Mark Sold Out' : 'Mark Available'"
                      >
                        <Check v-if="item.isAvailable !== false" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                      </button>

                      <button
                        @click="openEditModal(item)"
                        class="text-neutral-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit Item"
                      >
                        <Edit3 class="w-4 h-4" />
                      </button>

                      <button
                        @click="handleDeleteItem(item)"
                        class="text-neutral-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 class="text-xl font-bold text-neutral-900 mb-1 flex items-center gap-2">
                    <span>{{ item.name || item.title }}</span>
                    <span v-if="item.isAvailable === false" class="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                      Sold Out
                    </span>
                  </h4>
                  <p class="text-neutral-500 text-sm mb-4 line-clamp-3">{{ item.description || 'No description provided.' }}</p>
                </div>

                <div class="pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <span class="text-2xl font-extrabold text-neutral-900">${{ (item.price / 100).toFixed(2) }}</span>
                  <span class="text-xs text-neutral-400 font-mono">ID: {{ item.id.slice(0, 8) }}...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Subscribers Tab -->
          <div v-if="tabs === 'subscribers'" class="text-center py-12">
            <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users class="w-8 h-8 text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 mb-2">No subscribers yet</h3>
            <p class="text-neutral-500 max-w-sm mx-auto">Once you publish your menus and connect Stripe, subscribers will appear here.</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Dialog: Create / Edit Menu or À La Carte Item -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white max-w-lg w-full rounded-3xl p-8 shadow-2xl border border-neutral-100 relative max-h-[90vh] overflow-y-auto">
        <button
          @click="showAddModal = false"
          class="absolute top-6 right-6 text-neutral-400 hover:text-neutral-700 p-2 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>

        <h3 class="text-2xl font-extrabold text-neutral-900 mb-1">
          {{ editingItem ? 'Edit Item' : 'Create New Menu or Item' }}
        </h3>
        <p class="text-neutral-500 text-sm mb-6">Add a weekday schedule menu or an independent à la carte dish.</p>

        <form @submit.prevent="handleSaveItem" class="space-y-4">

          <!-- Item Type Selector -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Feature Type</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="itemType = 'SET_MENU'"
                :class="['py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all', itemType === 'SET_MENU' ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100']"
              >
                <Clock class="w-4 h-4" /> Weekly Schedule Menu
              </button>
              <button
                type="button"
                @click="itemType = 'A_LA_CARTE'"
                :class="['py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all', itemType === 'A_LA_CARTE' ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100']"
              >
                <Utensils class="w-4 h-4" /> À La Carte Dish
              </button>
            </div>
          </div>

          <!-- Weekday Selector (Only for Weekly Schedule Menu) -->
          <div v-if="itemType === 'SET_MENU'">
            <label class="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
              <Calendar class="w-4 h-4 text-orange-500" />
              Assigned Day of Week
            </label>
            <select
              v-model="itemDayOfWeek"
              class="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-neutral-900 bg-white font-semibold"
            >
              <option value="MONDAY">Monday</option>
              <option value="TUESDAY">Tuesday</option>
              <option value="WEDNESDAY">Wednesday</option>
              <option value="THURSDAY">Thursday</option>
              <option value="FRIDAY">Friday</option>
              <option value="ALL_WEEK">All Weekdays (Mon-Fri)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Item Name / Title</label>
            <input
              v-model="itemName"
              type="text"
              required
              class="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-neutral-900"
              :placeholder="itemType === 'SET_MENU' ? 'e.g. Monday Special Carbonara' : 'e.g. Handmade Carbonara'"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              v-model="itemDescription"
              rows="3"
              class="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-neutral-900"
              placeholder="Describe dishes, ingredients, portion sizes..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Category</label>
              <select
                v-model="itemCategory"
                class="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-neutral-900 bg-white"
              >
                <option value="Starters">Starters</option>
                <option value="Mains">Mains</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Price (USD)</label>
              <div class="relative">
                <span class="absolute left-3.5 top-3 text-neutral-400 font-bold">$</span>
                <input
                  v-model.number="itemPriceDollars"
                  type="number"
                  step="0.01"
                  min="0.99"
                  required
                  class="w-full pl-8 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-neutral-900"
                  placeholder="24.99"
                >
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Image URL (Optional)</label>
            <input
              v-model="itemImageUrl"
              type="url"
              class="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-neutral-900"
              placeholder="https://images.unsplash.com/..."
            >
          </div>

          <div class="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <div>
              <div class="text-sm font-bold text-neutral-900">Available for Ordering</div>
              <div class="text-xs text-neutral-500">Toggle whether diners can order this item</div>
            </div>
            <input
              v-model="itemIsAvailable"
              type="checkbox"
              class="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 border-neutral-300 cursor-pointer"
            >
          </div>

          <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {{ errorMsg }}
          </div>

          <div class="pt-4 flex gap-3">
            <button
              type="button"
              @click="showAddModal = false"
              class="w-1/2 py-3 border border-neutral-300 text-neutral-700 rounded-xl font-bold hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="w-1/2 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors disabled:opacity-70"
            >
              <span v-if="submitting">Saving...</span>
              <span v-else>{{ editingItem ? 'Update Item' : 'Publish Item' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
