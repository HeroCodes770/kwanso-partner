<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'

const route = useRoute()

const pageTitle = computed(() => (route.meta.title as string) ?? 'Overview')
</script>

<template>
  <div class="flex min-h-screen w-full bg-background">
    <AppSidebar />
    <div class="flex min-h-screen flex-1 flex-col">
      <header
        class="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 transition-[width,height] ease-linear"
      >
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <span class="hidden font-medium text-foreground md:inline">Dashboard</span>
          <span class="hidden md:inline">/</span>
          <span class="font-medium text-foreground">{{ pageTitle }}</span>
        </div>
      </header>
      <main class="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-4">
        <slot />
      </main>
    </div>
  </div>
</template>
