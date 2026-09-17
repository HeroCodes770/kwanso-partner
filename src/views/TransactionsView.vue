<script setup lang="ts">
import { onMounted } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Table from '@/components/ui/Table.vue'
import Badge from '@/components/ui/Badge.vue'
import { formatGhs } from '@/lib/utils'
import { useBookingStore } from '@/stores/booking'

const bookingStore = useBookingStore()

onMounted(() => {
  bookingStore.fetchBookings().catch(() => {})
})

function riderName(b: { rider?: { first_name?: string; last_name?: string } }) {
  const r = b.rider
  if (!r) return '—'
  return [r.first_name, r.last_name].filter(Boolean).join(' ') || '—'
}

function routeLabel(b: {
  route?: { origin?: { name?: string }; destination?: { name?: string } }
}) {
  const o = b.route?.origin?.name
  const d = b.route?.destination?.name
  if (o && d) return `${o} → ${d}`
  return '—'
}
</script>

<template>
  <DashboardLayout>
    <div v-if="bookingStore.loading" class="flex items-center gap-2 text-muted-foreground">
      <Loader2 class="size-4 animate-spin" />
      Loading transactions…
    </div>
    <p v-else-if="bookingStore.error" class="text-sm text-destructive">{{ bookingStore.error }}</p>

    <div v-else class="rounded-xl border bg-card">
      <Table>
        <thead>
          <tr class="border-b text-left text-muted-foreground">
            <th class="p-3 font-medium">Rider</th>
            <th class="p-3 font-medium">Route</th>
            <th class="p-3 font-medium">Amount</th>
            <th class="p-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in bookingStore.bookings" :key="b.id" class="border-b last:border-0">
            <td class="p-3">{{ riderName(b) }}</td>
            <td class="p-3">{{ routeLabel(b) }}</td>
            <td class="p-3">{{ formatGhs(b.total_amount) }}</td>
            <td class="p-3">
              <Badge variant="outline" class="capitalize">{{ b.status }}</Badge>
            </td>
          </tr>
          <tr v-if="!bookingStore.bookings.length">
            <td colspan="4" class="p-8 text-center text-muted-foreground">No bookings yet.</td>
          </tr>
        </tbody>
      </Table>
    </div>
  </DashboardLayout>
</template>
