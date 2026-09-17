<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
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
const route = useRoute()

const schema = toTypedSchema(
  z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
)

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema,
  initialValues: { email: '', password: '' },
})

const [email] = defineField('email')
const [password] = defineField('password')
const formError = ref('')

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    await auth.login(values.email, values.password)
    const redirect = (route.query.redirect as string) || '/'
    await router.push(redirect)
  } catch {
    formError.value = auth.loginError || 'Login failed'
  }
})

if (route.query.reason === 'forbidden') {
  formError.value = 'Your account is not authorized for the partner portal.'
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-muted/40 p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Partner sign in</CardTitle>
        <p class="text-sm text-muted-foreground">Manage shuttles, bookings, and payouts.</p>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" autocomplete="email" />
            <p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input id="password" v-model="password" type="password" autocomplete="current-password" />
            <p v-if="errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
          </div>
          <p v-if="formError" class="text-sm text-destructive">{{ formError }}</p>
          <Button type="submit" class="w-full" :disabled="auth.loading">
            <Loader2 v-if="auth.loading" class="size-4 animate-spin" />
            Sign in
          </Button>
        </form>
        <p class="mt-4 text-center text-sm text-muted-foreground">
          New partner?
          <RouterLink to="/signup" class="font-medium text-primary underline-offset-4 hover:underline">
            Create account
          </RouterLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>
