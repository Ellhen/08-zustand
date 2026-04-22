import { dehydrate } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import { getQueryClient } from '@/lib/getQueryClient'
import HydrateClient from '@/lib/hydration'
import NotePreview from './NotePreview.client'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function NotePreviewPage({ params }: Props) {
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
      <NotePreview id={id} />
    </HydrateClient>
  )
}
