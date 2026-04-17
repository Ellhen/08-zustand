'use client'

export default function NotesError({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center px-4">
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600 shadow-sm">
        Could not fetch the list of notes. {error.message}
      </p>
    </div>
  )
}
