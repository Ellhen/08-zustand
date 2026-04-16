import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function NotesLayout({ children}: Props) {
  return (
    <>
      {children}
    </>
  )
}
