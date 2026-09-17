<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  Bus,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Receipt,
  Wallet,
  ChevronsUpDown,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()

const overviewItems = [{ title: 'Dashboard', to: '/', icon: LayoutDashboard }]

const operationsItems = [
  { title: 'Shuttles', to: '/shuttles', icon: Bus },
  { title: 'Schedules', to: '/schedules', icon: CalendarDays },
  { title: 'Transactions', to: '/transactions', icon: Receipt },
]

const managementItems = [{ title: 'Withdrawals', to: '/withdrawals', icon: Wallet }]

const activePath = computed(() => route.path)

function isActive(to: string) {
  return activePath.value === to || (to !== '/' && activePath.value.startsWith(to))
}

function initials() {
  const first = auth.user?.first_name?.[0] || ''
  const last = auth.user?.last_name?.[0] || ''
  return (first + last).toUpperCase() || 'P'
}

async function logout() {
  await auth.logout()
}
</script>

<template>
  <aside
    class="flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
  >
    <div class="border-b border-sidebar-border p-4">
      <RouterLink to="/" class="flex flex-col gap-1">
        <img src="/logo_b.png" alt="Kwanso" class="h-8 w-auto" />
        <span class="truncate text-xs text-muted-foreground">Partner</span>
      </RouterLink>
    </div>

    <nav class="flex-1 space-y-6 overflow-y-auto p-3">
      <div>
        <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Overview
        </p>
        <div class="space-y-1">
          <RouterLink
            v-for="item in overviewItems"
            :key="item.to"
            :to="item.to"
            :class="
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive(item.to)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80',
              )
            "
          >
            <component :is="item.icon" class="size-4 shrink-0" />
            {{ item.title }}
          </RouterLink>
        </div>
      </div>

      <div>
        <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Operations
        </p>
        <div class="space-y-1">
          <RouterLink
            v-for="item in operationsItems"
            :key="item.to"
            :to="item.to"
            :class="
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive(item.to)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80',
              )
            "
          >
            <component :is="item.icon" class="size-4 shrink-0" />
            {{ item.title }}
          </RouterLink>
        </div>
      </div>

      <div>
        <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Management
        </p>
        <div class="space-y-1">
          <RouterLink
            v-for="item in managementItems"
            :key="item.to"
            :to="item.to"
            :class="
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive(item.to)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80',
              )
            "
          >
            <component :is="item.icon" class="size-4 shrink-0" />
            {{ item.title }}
          </RouterLink>
        </div>
      </div>
    </nav>

    <div class="border-t border-sidebar-border p-3">
      <div
        class="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-sidebar-accent"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-foreground"
        >
          {{ initials() }}
        </div>
        <div class="min-w-0 flex-1 text-left leading-tight">
          <p class="truncate font-semibold">{{ auth.fullName || 'Partner' }}</p>
          <p class="truncate text-xs text-muted-foreground">{{ auth.user?.email }}</p>
        </div>
        <ChevronsUpDown class="size-4 text-muted-foreground" />
      </div>
      <button
        type="button"
        class="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        @click="logout"
      >
        <LogOut class="size-4" />
        Log out
      </button>
    </div>
  </aside>
</template>
