import { dehydrate } from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import { fetchNotes } from '@/lib/api'
import { getQueryClient } from '@/lib/getQueryClient'
import HydrateClient from '@/lib/hydration'
import type { NoteTag } from '@/types/note'
import NotesClient from './Notes.client'

const PER_PAGE = 12
const validTags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']

interface Props {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function NotesByCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const query = await searchParams

  const rawTag = slug[0]

  if (!rawTag) {
    notFound()
  }

  if (rawTag !== 'all' && !validTags.includes(rawTag as NoteTag)) {
    notFound()
  }

  const tag = rawTag === 'all' ? undefined : (rawTag as NoteTag)
  const page = Number(query.page ?? '1')
  const search = query.search ?? ''

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['notes', page, search, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag
      })
  })

  return (
    <HydrateClient state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        initialTag={tag}
        basePath={`/notes/filter/${rawTag}`}
      />
    </HydrateClient>
  )
}
