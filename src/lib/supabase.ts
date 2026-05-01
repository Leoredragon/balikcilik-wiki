import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Fish = {
    id: string
    slug: string
    name_tr: string
    name_en: string | null
    name_latin: string | null
    category_id: string | null
    habitat: string | null
    water_type: 'fresh' | 'salt' | 'both' | null
    min_size_cm: number | null
    max_size_cm: number | null
    avg_weight_kg: number | null
    description: string | null
    fishing_tips: string | null
    bait_info: string | null
    cover_image_url: string | null
    is_published: boolean
}

export type Category = {
    id: string
    name_tr: string
    slug: string
    icon_url: string | null
    description: string | null
}

export type MonthlyYield = {
    id: string
    fish_id: string
    month: number
    yield_score: number
    notes: string | null
}

export type BanPeriod = {
    id: string
    fish_id: string
    start_month: number
    end_month: number
    ban_type: string
    region: string | null
    description: string | null
}