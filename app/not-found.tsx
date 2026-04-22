import type { Metadata } from 'next'
import css from './Home.module.css'

export const metadata: Metadata = {
  title: '404 - Page Not Found | NoteHub',
   description: 'Page not found. This page does not exist in NoteHub.',
  openGraph: {
    title: '404 - Page Not Found | NoteHub',
     description: 'Page not found. This page does not exist in NoteHub.',
    url: '/not-found',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - 404 Page Not Found'
      }
    ]
  }
}

const NotFound = () => {
  return (
    <div className="flex flex-col w-full text-center items-center justify-center">
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </div>
  )
}

export default NotFound
