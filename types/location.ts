export interface Province {
  id: number
  name: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface City {
  id: number
  province_id: number
  name: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}
