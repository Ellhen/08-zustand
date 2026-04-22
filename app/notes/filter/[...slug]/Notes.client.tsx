'use client'

import { useEffect, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import { useRouter, useSearchParams } from 'next/navigation'

import { fetchNotes } from '@/lib/api'
import type { NoteTag } from '@/types/note'
import { SearchBox } from '@/components/SearchBox/SearchBox'
import Pagination from '@/components/Pagination/Pagination'
import { NoteList } from '@/components/NoteList/NoteList'
import Link from 'next/link'

import css from './NotesPage.module.css'

const PER_PAGE = 12

interface Props {
  initialPage: number
  initialSearch: string
  initialTag?: NoteTag
  basePath?: string
}

export default function NotesClient({
  initialPage,
  initialSearch,
  initialTag,
  basePath = '/notes'
}: Props) {
  const [page, setPage] = useState(initialPage)
  const [search, setSearch] = useState(initialSearch)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const params = new URLSearchParams()

    if (page > 1) {
      params.set('page', String(page))
    }

    if (search.trim()) {
      params.set('search', search)
    }

    const nextUrl = `${basePath}${params.toString() ? `?${params.toString()}` : ''}`
    const currentUrl = `${basePath}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl)
    }
  }, [page, search, router, searchParams, basePath])

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, 500)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search, initialTag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag: initialTag
      }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  })

  const notes = data?.notes ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={debouncedSetSearch} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <Link
          href="/notes/action/create"
          className={css.button}
        >
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Something went wrong.</p>}
      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      <Link
        href="/notes/action/create"
        className={css.button}
      >
        Create note +
      </Link>
    </main>
  )
}
