import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'

interface AuthState {
    user: User | null
    isLoading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    // ... other auth methods
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,

    signIn: async (email, password) => {
        try {
            set({ isLoading: true })
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            set({ user: data.user })
        } catch (error) {
            console.error('Error signing in:', error)
        } finally {
            set({ isLoading: false })
        }
    },

    signOut: async () => {
        try {
            set({ isLoading: true })
            await supabase.auth.signOut()
            set({ user: null })
        } catch (error) {
            console.error('Error signing out:', error)
        } finally {
            set({ isLoading: false })
        }
    },
})) 