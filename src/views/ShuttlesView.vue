<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PlusCircle, Loader2 } from 'lucide-vue-next'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Table from '@/components/ui/Table.vue'
import OfferShuttleSheet from '@/components/shuttles/OfferShuttleSheet.vue'
import { useShuttleStore } from '@/stores/shuttle'

const shuttleStore = useShuttleStore()
const offerOpen = ref(false)

onMounted(() => {
  shuttleStore.fetchShuttles().catch(() => {})
})

function statusVariant(status?: string) {
  switch (status) {
    case 'approved':
      return 'success'
    case 'rejected':
      return 'destructive'
    case 'pending_review':
      return 'default'
    default:
      return 'secondary'
  }
}

function labelStatus(status?: string) {
  return (status ?? 'unknown').replace(/_/g, ' ')
}
</script>

<template>
  <DashboardLayout>
    <div class="mb-4 flex items-center justify-between">
      <p class="text-sm text-muted-foreground">Your fleet and KYC application status.</p>
      <Button @click="offerOpen = true">
        <PlusCircle class="size-4" />
        Offer shuttle
      </Button>
      <OfferShuttleSheet v-model:open="offerOpen" />
    </div>

    <div v-if="shuttleStore.loading" class="flex items-center gap-2 text-muted-foreground">
      <Loader2 class="size-4 animate-spin" />
      Loading shuttles…
    </div>
    <p v-else-if="shuttleStore.error" class="text-sm text-destructive">{{ shuttleStore.error }}</p>

    <div v-else class="rounded-xl border bg-card">
      <Table>
        <thead>
          <tr class="border-b text-left text-muted-foreground">
            <th class="p-3 font-medium">Name</th>
            <th class="p-3 font-medium">Plate</th>
            <th class="p-3 font-medium">Capacity</th>
            <th class="p-3 font-medium">Status</th>
            <th class="p-3 font-medium">Application</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in shuttleStore.shuttles" :key="s.id" class="border-b last:border-0">
            <td class="p-3 font-medium">{{ s.name }}</td>
            <td class="p-3">{{ s.plate_number }}</td>
            <td class="p-3">{{ s.capacity }}</td>
            <td class="p-3 capitalize">{{ s.status }}</td>
            <td class="p-3">
              <Badge :variant="statusVariant(s.application_status)">
                {{ labelStatus(s.application_status) }}
              </Badge>
            </td>
          </tr>
          <tr v-if="!shuttleStore.shuttles.length">
            <td colspan="5" class="p-8 text-center text-muted-foreground">No shuttles yet. Offer your first shuttle.</td>
          </tr>
        </tbody>
      </Table>
    </div>
  </DashboardLayout>
</template>
