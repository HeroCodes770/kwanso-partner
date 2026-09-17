<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'radix-vue'

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <DialogRoot v-model:open="open">
    <slot name="trigger" />
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <DialogContent
        class="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-lg flex-col border-l bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out sm:max-w-xl"
      >
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
