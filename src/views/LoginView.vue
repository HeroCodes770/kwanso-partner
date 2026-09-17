<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const showPassword = ref(false)
const formError = ref('')

const schema = toTypedSchema(
  z.object({
    email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional(),
  }),
)

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema,
  initialValues: { email: '', password: '', rememberMe: false },
})

const [email] = defineField('email')
const [password] = defineField('password')
const [rememberMe] = defineField('rememberMe')

const inputClass =
  'border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600'

const onSubmit = handleSubmit(async (values) => {
  formError.value = ''
  try {
    await auth.login(values.email, values.password)
    if (values.rememberMe) {
      localStorage.setItem('remember_user', 'true')
    }
    const redirect = (route.query.redirect as string) || '/'
    await router.push(redirect)
  } catch {
    formError.value = auth.loginError || 'Login failed'
  }
})

if (route.query.reason === 'forbidden') {
  formError.value = 'This portal is for partners only.'
}
</script>

<template>
  <section class="bg-white py-12 sm:py-16 lg:py-20 min-h-screen">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-sm">
        <div class="text-center">
          <img class="mx-auto w-36" src="/logo_b.png" alt="Kwanso" />
          <h1 class="mt-12 text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p class="mt-4 text-sm font-medium text-gray-500">
            Manage your fleet, bookings, and payouts.
          </p>
        </div>

        <form class="mt-12 space-y-4" @submit.prevent="onSubmit">
          <div class="space-y-1.5">
            <label for="email" class="text-sm font-bold text-gray-900">Email</label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="Email address"
              autocomplete="email"
              :class="[inputClass, errors.email ? 'border-red-500' : '']"
            />
            <p v-if="errors.email" class="text-xs text-red-600">{{ errors.email }}</p>
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="password" class="text-sm font-bold text-gray-900">Password</label>
            </div>
            <div class="relative">
              <Input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password (min. 8 character)"
                autocomplete="current-password"
                :class="[inputClass, 'pr-12', errors.password ? 'border-red-500' : '']"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="errors.password" class="text-xs text-red-600">{{ errors.password }}</p>
          </div>

          <div class="relative flex items-center">
            <input
              id="remember-password"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label for="remember-password" class="ml-3 text-sm font-medium text-gray-900">
              Remember Me
            </label>
          </div>

          <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

          <Button
            type="submit"
            :disabled="auth.loading"
            class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            <Loader2 v-if="auth.loading" class="mr-2 h-4 w-4 animate-spin" />
            <span v-else>Sign In</span>
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm font-medium text-gray-900">
            Don't have an account?
            <RouterLink to="/signup" class="font-bold text-indigo-600 hover:underline">
              Sign up now
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
