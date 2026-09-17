export type PartnerMe = {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  status: string
  owner_id?: string
  stats?: PartnerStats
  vehicle_count?: number
  total_km?: number
}

export type PartnerStats = {
  gross_revenue: number
  available_balance: number
  net_earnings?: number
  shuttle_count?: number
  total_bookings?: number
}

export type PartnerUser = {
  id: string
  email?: string
  first_name?: string
  last_name?: string
  role_id?: number
  role?: { id: number }
}

export type Shuttle = {
  id: string
  name: string
  model?: string
  plate_number: string
  capacity: number
  status: string
  application_status?: string
  partner_id?: string
  created_at?: string
}

export type Booking = {
  id: string
  status: string
  total_amount: number
  booking_reference?: string
  rider?: {
    first_name?: string
    last_name?: string
  }
  route?: {
    origin?: { name?: string }
    destination?: { name?: string }
  }
}

export type Schedule = {
  id: string
  departure_time?: string
  arrival_time?: string
  status?: string
  route?: { name?: string }
  shuttle?: { name?: string; plate_number?: string }
}

export type Withdrawal = {
  id: string
  amount: number
  currency?: string
  method: string
  status: string
  created_at?: string
  method_details?: Record<string, unknown>
}

export type EarningsSummary = {
  gross_revenue: number
  available_balance: number
  net_earnings?: number
  total_km?: number
}

export type UploadUrlResponse = {
  path: string
  token: string
  signedUrl: string
}
