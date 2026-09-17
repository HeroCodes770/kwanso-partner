<script setup lang="ts">
import { onMounted } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Table from '@/components/ui/Table.vue'
import Badge from '@/components/ui/Badge.vue'
import { useScheduleStore } from '@/stores/schedule'

const scheduleStore = useScheduleStore()

onMounted(() => {
  scheduleStore.fetchSchedules().catch(() => {})
})

function fmt(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GH', { dateStyle: 'medium', timeStyle: 'short' })
}
</script>

<template>
  <DashboardLayout>
    <p class="mb-4 text-sm text-muted-foreground">Read-only view of upcoming and past schedules.</p>

    <div v-if="scheduleStore.loading" class="flex items-center gap-2 text-muted-foreground">
      <Loader2 class="size-4 animate-spin" />
      Loading schedules…
    </div>
    <p v-else-if="scheduleStore.error" class="text-sm text-destructive">{{ scheduleStore.error }}</p>

    <div v-else class="rounded-xl border bg-card">
      <Table>
        <thead>
          <tr class="border-b text-left text-muted-foreground">
            <th class="p-3 font-medium">Route</th>
            <th class="p-3 font-medium">Shuttle</th>
            <th class="p-3 font-medium">Departure</th>
            <th class="p-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in scheduleStore.schedules" :key="s.id" class="border-b last:border-0">
            <td class="p-3">{{ s.route?.name ?? '—' }}</td>
            <td class="p-3">
              {{ s.shuttle?.name ?? '—' }}
              <span v-if="s.shuttle?.plate_number" class="text-muted-foreground">
                ({{ s.shuttle.plate_number }})
              </span>
            </td>
            <td class="p-3">{{ fmt(s.departure_time) }}</td>
            <td class="p-3">
              <Badge variant="outline" class="capitalize">{{ s.status ?? '—' }}</Badge>
            </td>
          </tr>
          <tr v-if="!scheduleStore.schedules.length">
            <td colspan="4" class="p-8 text-center text-muted-foreground">No schedules found.</td>
          </tr>
        </tbody>
      </Table>
    </div>
  </DashboardLayout>
</template>
