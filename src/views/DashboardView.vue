<script setup lang="ts">
import { onMounted } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import { formatGhs } from '@/lib/utils'
import { usePartnerStore } from '@/stores/partner'

const partner = usePartnerStore()

onMounted(() => {
  partner.fetchDashboard().catch(() => {})
})

function formatKm(km: number) {
  return new Intl.NumberFormat('en-GH').format(km)
}
</script>

<template>
  <DashboardLayout>
    <div v-if="partner.loading" class="flex items-center gap-2 text-muted-foreground">
      <Loader2 class="size-4 animate-spin" />
      Loading dashboard…
    </div>
    <p v-else-if="partner.error" class="text-sm text-destructive">{{ partner.error }}</p>

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold">{{ partner.vehicleCount }}</p>
          <p class="text-xs text-muted-foreground">{{ partner.profile?.name }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Total KM</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold">{{ formatKm(partner.totalKm) }}</p>
          <p class="text-xs text-muted-foreground">Fleet distance (when reported by API)</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Gross revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold">{{ formatGhs(partner.grossRevenue) }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Available balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold">{{ formatGhs(partner.availableBalance) }}</p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
</template>
