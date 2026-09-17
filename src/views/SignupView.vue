<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const showPassword = ref(false)
const formError = ref('')

const schema = toTypedSchema(
  z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    phone_number: z.string().optional(),
    partner_name: z.string().min(2, 'Company name is required'),
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

const inputClass =
  'border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600'

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
  <section class="min-h-screen bg-white py-12 sm:py-16 lg:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-md">
        <div class="text-center">
          <img class="mx-auto w-36" src="/logo_b.png" alt="Kwanso" />
          <h1 class="mt-8 text-3xl font-bold text-gray-900">Create partner account</h1>
          <p class="mt-4 text-sm font-medium text-gray-500">
            Register your fleet to offer shuttles and earn revenue.
          </p>
        </div>

        <form class="mt-8 space-y-5" @submit.prevent="onSubmit">
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-gray-900">Company name</label>
            <Input v-model="partner_name" placeholder="Your company name" :class="inputClass" />
            <p v-if="errors.partner_name" class="text-xs text-red-600">{{ errors.partner_name }}</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-bold text-gray-900">First name</label>
              <Input v-model="first_name" placeholder="First name" :class="inputClass" />
              <p v-if="errors.first_name" class="text-xs text-red-600">{{ errors.first_name }}</p>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-bold text-gray-900">Last name</label>
              <Input v-model="last_name" placeholder="Last name" :class="inputClass" />
              <p v-if="errors.last_name" class="text-xs text-red-600">{{ errors.last_name }}</p>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-bold text-gray-900">Email</label>
            <Input
              v-model="email"
              type="email"
              placeholder="Enter your email address"
              :class="inputClass"
            />
            <p v-if="errors.email" class="text-xs text-red-600">{{ errors.email }}</p>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-bold text-gray-900">Password</label>
            <div class="relative">
              <Input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create a strong password"
                :class="[inputClass, 'pr-10']"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="errors.password" class="text-xs text-red-600">{{ errors.password }}</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-bold text-gray-900">Your phone</label>
              <Input v-model="phone_number" placeholder="Optional" :class="inputClass" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-bold text-gray-900">Company phone</label>
              <Input v-model="partner_phone" placeholder="Optional" :class="inputClass" />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-bold text-gray-900">Address</label>
            <Input v-model="partner_address" placeholder="Optional" :class="inputClass" />
          </div>

          <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

          <Button
            type="submit"
            :disabled="auth.loading"
            class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            <Loader2 v-if="auth.loading" class="mr-2 h-4 w-4 animate-spin" />
            <span v-else>Create account</span>
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm font-medium text-gray-900">
            Already have an account?
            <RouterLink to="/login" class="font-bold text-indigo-600 hover:underline">
              Sign in
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
