export type Listing = {
    id: number
    title: string
    location: string
    price: number
    rating: number
    image_url: string
    category: string
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