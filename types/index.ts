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
}

export type User = {
    id: string
    email?: string
    created_at: string
    user_metadata?: {
        avatar_url?: string
    }
} 