export type Listing = {
    id: number
    title: string | null
    location: string | null
    price: number | null
    rating: number | null
    image_url: string | null
    category: string | null
    user_id: string
    created_at: string
    description?: string
    max_guests?: number
    bedrooms?: number
    bathrooms?: number
    cleaning_fee?: number
    service_fee?: number
}

export type User = {
    id: string
    email?: string
    created_at: string
    user_metadata?: {
        avatar_url?: string
    }
}