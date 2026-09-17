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
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()

const items = [
  { title: 'Dashboard', to: '/', icon: LayoutDashboard },
  { title: 'Shuttles', to: '/shuttles', icon: Bus },
  { title: 'Transactions', to: '/transactions', icon: Receipt },
  { title: 'Schedules', to: '/schedules', icon: CalendarDays },
  { title: 'Withdrawals', to: '/withdrawals', icon: Wallet },
]

const activePath = computed(() => route.path)

async function logout() {
  await auth.logout()
}
</script>

<template>
  <aside
    class="flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
  >
    <div class="border-b border-sidebar-border p-4">
      <p class="text-lg font-semibold tracking-tight">Kwanso Partner</p>
      <p class="text-xs text-muted-foreground">Fleet & earnings portal</p>
    </div>

    <nav class="flex-1 space-y-1 p-3">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :class="
          cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            activePath === item.to || (item.to !== '/' && activePath.startsWith(item.to))
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/80',
          )
        "
      >
        <component :is="item.icon" class="size-4 shrink-0" />
        {{ item.title }}
      </RouterLink>
    </nav>

    <div class="border-t border-sidebar-border p-4">
      <p class="truncate text-sm font-medium">{{ auth.fullName }}</p>
      <p class="truncate text-xs text-muted-foreground">{{ auth.user?.email }}</p>
      <Button variant="outline" size="sm" class="mt-3 w-full" @click="logout">
        <LogOut class="size-4" />
        Log out
      </Button>
    </div>
  </aside>
</template>
