'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { createNote } from '@/lib/api'
import { useNoteStore, initialDraft } from '@/lib/store/noteStore'
import { NoteTag } from '@/types/note'
import css from './NoteForm.module.css'

type NoteFormProps = {
  onClose?: () => void
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { draft, setDraft, clearDraft } = useNoteStore()

  const currentDraft = draft ?? initialDraft

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    if (!target.name) return
    setDraft({ [target.name]: target.value })
  }

  const handleCreate = async (formData: FormData) => {
    const data = {
      title: String(formData.get('title') ?? ''),
      content: String(formData.get('content') ?? ''),
      tag: String(formData.get('tag') ?? 'Todo') as NoteTag
    }

    startTransition(async () => {
      await createNote(data)
      clearDraft()

      if (onClose) onClose()
      else router.back()
    })
  }

  return (
    <form
      onChange={handleFormChange}
      className={`${css.form} space-y-4`}
    >
      <label className={`${css.label} flex flex-col gap-2`}>
        Title
        <input
          name="title"
          value={currentDraft.title}
          onChange={() => {}}
          className={css.input}
        />
      </label>

      <label className={`${css.label} flex flex-col gap-2`}>
        Content
        <textarea
          name="content"
          value={currentDraft.content}
          onChange={() => {}}
          className={css.textarea}
        />
      </label>

      <label className={`${css.label} flex flex-col gap-2`}>
        Tag
        <select
          name="tag"
          value={currentDraft.tag}
          onChange={() => {}}
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
          formAction={handleCreate}
          disabled={isPending}
          className="cursor-pointer rounded border border-blue-600 px-3 py-1.5 text-base text-blue-600 hover:bg-blue-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Creating...' : 'Create note'}
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
