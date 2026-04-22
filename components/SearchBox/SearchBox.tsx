'use client'

import type { ChangeEvent } from 'react'
import css from './SearchBox.module.css'

interface SearchBoxProps {
  onSearch: (value: string) => void
  value?: string
}

export function SearchBox({ onSearch, value = '' }: SearchBoxProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value)
  }

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={handleChange}
    />
  )
}
