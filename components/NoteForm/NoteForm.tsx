'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createNote } from '@/lib/api'
import { useNoteStore } from '@/lib/store/noteStore'
import { NoteTag } from '@/types/note'
import css from './NoteForm.module.css'

type NoteFormProps = {
  onClose?: () => void
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { draft, setDraft, clearDraft } = useNoteStore()

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft()
      await queryClient.invalidateQueries({ queryKey: ['notes'] })

      if (onClose) onClose()
      else router.back()
    }
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setDraft({ [name]: value })
  }

  const handleSubmit = async (formData: FormData) => {
    const data = {
      title: String(formData.get('title') ?? ''),
      content: String(formData.get('content') ?? ''),
      tag: String(formData.get('tag') ?? 'Todo') as NoteTag
    }

    await createNoteMutation.mutateAsync(data)
  }

  return (
    <form
      action={handleSubmit}
      className={`${css.form} space-y-4`}
    >
      <label className={`${css.label} flex flex-col gap-2`}>
        Title
        <input
          name="title"
          value={draft.title}
          onChange={handleChange}
          className={css.input}
        />
      </label>

      <label className={`${css.label} flex flex-col gap-2`}>
        Content
        <textarea
          name="content"
          value={draft.content}
          onChange={handleChange}
          className={css.textarea}
        />
      </label>

      <label className={`${css.label} flex flex-col gap-2`}>
        Tag
        <select
          name="tag"
          value={draft.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </label>

      <div className={`${css.actions} flex gap-3`}>
        <button
          type="submit"
          disabled={createNoteMutation.isPending}
          className="cursor-pointer rounded border border-blue-600 px-3 py-1.5 text-base text-blue-600 hover:bg-blue-700 hover:text-white disabled:opacity-50"
        >
          {createNoteMutation.isPending ? 'Creating...' : 'Create note'}
        </button>

        <button
          type="button"
          onClick={() => {
            if (onClose) onClose()
            else router.back()
          }}
          className="cursor-pointer rounded bg-[#dc3545] px-3 py-1.5 text-base text-white hover:bg-[#bb2d3b]"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
