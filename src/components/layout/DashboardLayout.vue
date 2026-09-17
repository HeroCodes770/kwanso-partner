<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'

const route = useRoute()

const pageTitle = computed(() => (route.meta.title as string) ?? 'Dashboard')
</script>

<template>
  <div class="flex min-h-screen w-full bg-muted/30">
    <AppSidebar />
    <div class="flex min-h-screen flex-1 flex-col">
      <header class="flex h-14 shrink-0 items-center border-b bg-background px-6">
        <h1 class="text-lg font-semibold">{{ pageTitle }}</h1>
      </header>
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
