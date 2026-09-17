<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const schema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
    first_name: z.string().min(1, 'Required'),
    last_name: z.string().min(1, 'Required'),
    phone_number: z.string().optional(),
    partner_name: z.string().min(2, 'Company name required'),
    partner_phone: z.string().optional(),
    partner_address: z.string().optional(),
  }),
)

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema,
})

const [email] = defineField('email')
const [password] = defineField('password')
const [first_name] = defineField('first_name')
const [last_name] = defineField('last_name')
const [phone_number] = defineField('phone_number')
const [partner_name] = defineField('partner_name')
const [partner_phone] = defineField('partner_phone')
const [partner_address] = defineField('partner_address')

const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    await auth.signup({
      email: values.email,
      password: values.password,
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number || undefined,
      partner: {
        name: values.partner_name,
        phone: values.partner_phone || undefined,
        address: values.partner_address || undefined,
      },
    })
    await router.push('/')
  } catch {
    formError.value = auth.signupError || 'Signup failed'
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-muted/40 p-4">
    <Card class="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Partner registration</CardTitle>
        <p class="text-sm text-muted-foreground">Create your fleet operator account.</p>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="onSubmit">
          <div class="space-y-2 sm:col-span-2">
            <Label>Company name</Label>
            <Input v-model="partner_name" />
            <p v-if="errors.partner_name" class="text-xs text-destructive">{{ errors.partner_name }}</p>
          </div>
          <div class="space-y-2">
            <Label>First name</Label>
            <Input v-model="first_name" />
            <p v-if="errors.first_name" class="text-xs text-destructive">{{ errors.first_name }}</p>
          </div>
          <div class="space-y-2">
            <Label>Last name</Label>
            <Input v-model="last_name" />
            <p v-if="errors.last_name" class="text-xs text-destructive">{{ errors.last_name }}</p>
          </div>
          <div class="space-y-2 sm:col-span-2">
            <Label>Email</Label>
            <Input v-model="email" type="email" />
            <p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
          </div>
          <div class="space-y-2 sm:col-span-2">
            <Label>Password</Label>
            <Input v-model="password" type="password" />
            <p v-if="errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
          </div>
          <div class="space-y-2">
            <Label>Your phone (optional)</Label>
            <Input v-model="phone_number" />
          </div>
          <div class="space-y-2">
            <Label>Company phone (optional)</Label>
            <Input v-model="partner_phone" />
          </div>
          <div class="space-y-2 sm:col-span-2">
            <Label>Address (optional)</Label>
            <Input v-model="partner_address" />
          </div>
          <p v-if="formError" class="text-sm text-destructive sm:col-span-2">{{ formError }}</p>
          <Button type="submit" class="sm:col-span-2" :disabled="auth.loading">
            <Loader2 v-if="auth.loading" class="size-4 animate-spin" />
            Create account
          </Button>
        </form>
        <p class="mt-4 text-center text-sm text-muted-foreground">
          Already registered?
          <RouterLink to="/login" class="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </RouterLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>
