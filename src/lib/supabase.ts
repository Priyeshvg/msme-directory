import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Enterprise = {
  id: number
  enterprise_name: string
  state_name: string
  district_name: string
  pincode: number | null
  registration_date: string | null
  communication_address: string | null
  slug: string | null
  created_at: string
}

export type EnterpriseActivity = {
  id: number
  enterprise_id: number
  nic_5digit_id: string | null
  description: string | null
}