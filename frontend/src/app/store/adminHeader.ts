// store/adminHeaderStore.ts
import { create } from 'zustand'

interface AdminHeaderStore {
    rightContent: React.ReactNode
    setRightContent: (content: React.ReactNode) => void
}

export const useAdminHeaderStore = create<AdminHeaderStore>((set) => ({
    rightContent: null,
    setRightContent: (content) => set({ rightContent: content }),
}))