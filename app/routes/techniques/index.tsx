import { Link } from '@remix-run/react'

export default function TechniquesIndexPage() {
  return (
    <p>
      No technique selected. Select a technique on the left, or{' '}
      <Link
        to="new"
        className="text-blue-500 underline"
      >
        create a new technique.
      </Link>
    </p>
  )
}
