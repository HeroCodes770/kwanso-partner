<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Select from '@/components/ui/Select.vue'
import Table from '@/components/ui/Table.vue'
import Badge from '@/components/ui/Badge.vue'
import { formatGhs } from '@/lib/utils'
import { usePartnerStore } from '@/stores/partner'
import { useWithdrawalStore, type WithdrawalMethod } from '@/stores/withdrawal'

const partner = usePartnerStore()
const withdrawalStore = useWithdrawalStore()

const method = ref<WithdrawalMethod>('mobile_money')

const schema = computed(() =>
  toTypedSchema(
    z.object({
      amount: z.coerce
        .number()
        .int('Whole GHS only')
        .min(1)
        .max(partner.availableBalance || 999999999, 'Exceeds available balance'),
      account_name: z.string().optional(),
      account_number: z.string().min(1, 'Account details required'),
      provider: z.string().optional(),
    }),
  ),
)

const { handleSubmit, defineField, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { amount: 0, account_name: '', account_number: '', provider: '' },
})

const [amount] = defineField('amount')
const [account_name] = defineField('account_name')
const [account_number] = defineField('account_number')
const [provider] = defineField('provider')

onMounted(async () => {
  await partner.fetchDashboard().catch(() => {})
  await withdrawalStore.fetchMyWithdrawals().catch(() => {})
})

const onSubmit = handleSubmit(async (values) => {
  const method_details: Record<string, string> = {
    account_number: values.account_number,
  }
  if (values.account_name) method_details.account_name = values.account_name
  if (values.provider) method_details.provider = values.provider

  try {
    await withdrawalStore.requestWithdrawal({
      amount: values.amount,
      method: method.value,
      method_details,
    })
    await partner.fetchDashboard()
    toast.success('Withdrawal requested')
    resetForm()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Request failed')
  }
})
</script>

<template>
  <DashboardLayout>
    <div class="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Request withdrawal</CardTitle>
          <p class="text-sm text-muted-foreground">
            Available: {{ formatGhs(partner.availableBalance) }}
          </p>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="onSubmit">
            <div class="space-y-2">
              <Label>Method</Label>
              <Select v-model="method">
                <option value="mobile_money">Mobile money</option>
                <option value="bank">Bank transfer</option>
                <option value="cash">Cash</option>
              </Select>
            </div>
            <div class="space-y-2">
              <Label>Amount (GHS)</Label>
              <Input v-model="amount" type="number" min="1" step="1" />
              <p v-if="errors.amount" class="text-xs text-destructive">{{ errors.amount }}</p>
            </div>
            <div class="space-y-2">
              <Label>{{ method === 'mobile_money' ? 'MoMo number' : 'Account number' }}</Label>
              <Input v-model="account_number" />
              <p v-if="errors.account_number" class="text-xs text-destructive">{{ errors.account_number }}</p>
            </div>
            <div v-if="method === 'mobile_money'" class="space-y-2">
              <Label>Network (optional)</Label>
              <Input v-model="provider" placeholder="MTN / Telecel / AT" />
            </div>
            <div v-if="method === 'bank'" class="space-y-2">
              <Label>Account name</Label>
              <Input v-model="account_name" />
            </div>
            <Button type="submit" :disabled="withdrawalStore.submitting">
              <Loader2 v-if="withdrawalStore.submitting" class="size-4 animate-spin" />
              Submit request
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent class="p-0">
          <div v-if="withdrawalStore.loading" class="flex items-center gap-2 p-6 text-muted-foreground">
            <Loader2 class="size-4 animate-spin" />
            Loading…
          </div>
          <Table v-else>
            <thead>
              <tr class="border-b text-left text-muted-foreground">
                <th class="p-3 font-medium">Date</th>
                <th class="p-3 font-medium">Amount</th>
                <th class="p-3 font-medium">Method</th>
                <th class="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="w in withdrawalStore.history" :key="w.id" class="border-b last:border-0">
                <td class="p-3 text-sm">{{ w.created_at ? new Date(w.created_at).toLocaleDateString() : '—' }}</td>
                <td class="p-3">{{ formatGhs(w.amount) }}</td>
                <td class="p-3 capitalize">{{ w.method.replace('_', ' ') }}</td>
                <td class="p-3">
                  <Badge variant="outline" class="capitalize">{{ w.status }}</Badge>
                </td>
              </tr>
              <tr v-if="!withdrawalStore.history.length">
                <td colspan="4" class="p-6 text-center text-muted-foreground">No withdrawals yet.</td>
              </tr>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
</template>
