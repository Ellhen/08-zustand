import type { Metadata } from 'next'
import { dehydrate } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import { getQueryClient } from '@/lib/getQueryClient'
import HydrateClient from '@/lib/hydration'
import NoteDetailsClient from './NoteDetails.client'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  try {
    const note = await fetchNoteById(id)
    const title = `${note.title} | NoteHub`
    const description = note.content?.slice(0, 160) || 'Note details page in NoteHub.'

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: `NoteHub - ${note.tag}: ${note.title}`
          }
        ]
      }
    }
  } catch {
    return {
      title: 'Note not found | NoteHub',
      description: 'This note does not exist.',
      openGraph: {
        title: 'Note not found | NoteHub',
        description: 'This note does not exist.',
        url: `/notes/${id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg']
      }
    }
  }
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params
  const queryClient = getQueryClient()

  await queryClient
    .prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id)
    })
    .catch(() => null)

  return (
    <HydrateClient state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrateClient>
  )
}
