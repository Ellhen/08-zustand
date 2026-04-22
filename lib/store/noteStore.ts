import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const initialDraft = {
  title: '',
  content: '',
  tag: 'Todo'
}

type NoteDraft = typeof initialDraft

type NoteStore = {
  draft: NoteDraft
  setDraft: (note: Partial<NoteDraft>) => void
  clearDraft: () => void
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: { ...state.draft, ...note }
        })),
      clearDraft: () => set({ draft: initialDraft })
    }),
    {
      name: 'note-draft'
    }
  )
)