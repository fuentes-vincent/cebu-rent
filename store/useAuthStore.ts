import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    setUser: (user: User | null) => void
    signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null })
    },
}))

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
    useAuthStore.getState().setUser(session?.user ?? null)
})

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setUser(session?.user ?? null)
}) 