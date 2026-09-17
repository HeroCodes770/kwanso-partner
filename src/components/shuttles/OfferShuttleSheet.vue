<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import Sheet from '@/components/ui/Sheet.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { useShuttleStore } from '@/stores/shuttle'

const open = defineModel<boolean>('open', { default: false })
const shuttleStore = useShuttleStore()

const step = ref(1)
const shuttleId = ref('')
const paths = ref({
  ownership_doc_url: '',
  ghana_card_front_url: '',
  ghana_card_back_url: '',
  vehicle_image_urls: [] as string[],
})
const busy = ref(false)

const vehicleSchema = toTypedSchema(
  z.object({
    name: z.string().min(2, 'Name is required'),
    plate_number: z.string().min(3, 'Plate number is required'),
    capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
    model: z.string().min(1, 'Model is required'),
  }),
)

const { handleSubmit, defineField, errors, resetForm } = useForm({
  validationSchema: vehicleSchema,
  initialValues: { name: '', plate_number: '', capacity: 1, model: '' },
})

const [name] = defineField('name')
const [plate_number] = defineField('plate_number')
const [capacity] = defineField('capacity')
const [model] = defineField('model')

function resetFlow() {
  step.value = 1
  shuttleId.value = ''
  paths.value = {
    ownership_doc_url: '',
    ghana_card_front_url: '',
    ghana_card_back_url: '',
    vehicle_image_urls: [],
  }
  resetForm()
}

function closeSheet() {
  open.value = false
  resetFlow()
}

const onCreateShuttle = handleSubmit(async (values) => {
  busy.value = true
  try {
    const created = await shuttleStore.createShuttle(values)
    shuttleId.value = created.id
    step.value = 2
    toast.success('Shuttle created — upload documents next')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Could not create shuttle')
  } finally {
    busy.value = false
  }
})

async function uploadKind(
  kind: 'ownership_doc' | 'ghana_card_front' | 'ghana_card_back' | 'vehicle_image',
  file: File,
  multiple = false,
) {
  if (!shuttleId.value) return
  busy.value = true
  try {
    const path = await shuttleStore.uploadDocument(shuttleId.value, kind, file)
    if (kind === 'ownership_doc') paths.value.ownership_doc_url = path
    else if (kind === 'ghana_card_front') paths.value.ghana_card_front_url = path
    else if (kind === 'ghana_card_back') paths.value.ghana_card_back_url = path
    else if (multiple) paths.value.vehicle_image_urls.push(path)
    toast.success('Uploaded')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Upload failed')
  } finally {
    busy.value = false
  }
}

function onFileInput(
  e: Event,
  kind: 'ownership_doc' | 'ghana_card_front' | 'ghana_card_back' | 'vehicle_image',
  multiple = false,
) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return
  if (multiple) {
    Array.from(files).forEach((f) => uploadKind(kind, f, true))
  } else {
    uploadKind(kind, files[0], false)
  }
  input.value = ''
}

async function submitApplication() {
  if (!shuttleId.value) return
  busy.value = true
  try {
    await shuttleStore.submitApplication(shuttleId.value, paths.value)
    await shuttleStore.fetchShuttles()
    toast.success('Shuttle submitted for review')
    closeSheet()
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Submit failed')
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <Sheet v-model:open="open">
    <div class="flex h-full flex-col">
      <div class="mb-6 space-y-1">
        <h2 class="text-lg font-semibold">Offer shuttle</h2>
        <p class="text-sm text-muted-foreground">Step {{ step }} of 5 — KYC and vehicle listing</p>
      </div>

      <form v-if="step === 1" class="flex flex-1 flex-col gap-4" @submit.prevent="onCreateShuttle">
        <div class="space-y-2">
          <Label for="name">Shuttle name</Label>
          <Input id="name" v-model="name" placeholder="Shuttle Alpha" />
          <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
        </div>
        <div class="space-y-2">
          <Label for="plate">Plate number</Label>
          <Input id="plate" v-model="plate_number" placeholder="GR-1234-21" />
          <p v-if="errors.plate_number" class="text-xs text-destructive">{{ errors.plate_number }}</p>
        </div>
        <div class="space-y-2">
          <Label for="capacity">Capacity</Label>
          <Input id="capacity" v-model="capacity" type="number" min="1" />
          <p v-if="errors.capacity" class="text-xs text-destructive">{{ errors.capacity }}</p>
        </div>
        <div class="space-y-2">
          <Label for="model">Model</Label>
          <Input id="model" v-model="model" placeholder="Toyota Hiace" />
          <p v-if="errors.model" class="text-xs text-destructive">{{ errors.model }}</p>
        </div>
        <div class="mt-auto flex gap-2 pt-4">
          <Button type="button" variant="outline" class="flex-1" @click="closeSheet">Cancel</Button>
          <Button type="submit" class="flex-1" :disabled="busy">
            <Loader2 v-if="busy" class="size-4 animate-spin" />
            Continue
          </Button>
        </div>
      </form>

      <div v-else-if="step === 2" class="flex flex-1 flex-col gap-4">
        <p class="text-sm text-muted-foreground">Upload ownership document (PDF or image).</p>
        <input type="file" accept="image/*,application/pdf" @change="onFileInput($event, 'ownership_doc')" />
        <p v-if="paths.ownership_doc_url" class="text-xs text-emerald-600">Uploaded ✓</p>
        <div class="mt-auto flex gap-2">
          <Button variant="outline" class="flex-1" :disabled="!paths.ownership_doc_url" @click="step = 1">Back</Button>
          <Button class="flex-1" :disabled="!paths.ownership_doc_url" @click="step = 3">Next</Button>
        </div>
      </div>

      <div v-else-if="step === 3" class="flex flex-1 flex-col gap-4">
        <Label>Ghana Card — front</Label>
        <input type="file" accept="image/*" @change="onFileInput($event, 'ghana_card_front')" />
        <Label>Ghana Card — back</Label>
        <input type="file" accept="image/*" @change="onFileInput($event, 'ghana_card_back')" />
        <div class="mt-auto flex gap-2">
          <Button variant="outline" class="flex-1" @click="step = 2">Back</Button>
          <Button
            class="flex-1"
            :disabled="!paths.ghana_card_front_url || !paths.ghana_card_back_url"
            @click="step = 4"
          >
            Next
          </Button>
        </div>
      </div>

      <div v-else-if="step === 4" class="flex flex-1 flex-col gap-4">
        <p class="text-sm text-muted-foreground">Upload one or more vehicle photos.</p>
        <input type="file" accept="image/*" multiple @change="onFileInput($event, 'vehicle_image', true)" />
        <p class="text-xs text-muted-foreground">{{ paths.vehicle_image_urls.length }} photo(s) uploaded</p>
        <div class="mt-auto flex gap-2">
          <Button variant="outline" class="flex-1" @click="step = 3">Back</Button>
          <Button class="flex-1" :disabled="paths.vehicle_image_urls.length < 1" @click="step = 5">Next</Button>
        </div>
      </div>

      <div v-else class="flex flex-1 flex-col gap-4">
        <p class="text-sm">Review and submit your shuttle for admin review.</p>
        <ul class="space-y-1 text-sm text-muted-foreground">
          <li>Ownership: {{ paths.ownership_doc_url ? 'Ready' : 'Missing' }}</li>
          <li>Ghana Card: {{ paths.ghana_card_front_url && paths.ghana_card_back_url ? 'Ready' : 'Missing' }}</li>
          <li>Photos: {{ paths.vehicle_image_urls.length }}</li>
        </ul>
        <div class="mt-auto flex gap-2">
          <Button variant="outline" class="flex-1" @click="step = 4">Back</Button>
          <Button class="flex-1" :disabled="busy" @click="submitApplication">
            <Loader2 v-if="busy" class="size-4 animate-spin" />
            Submit application
          </Button>
        </div>
      </div>
    </div>
  </Sheet>
</template>
