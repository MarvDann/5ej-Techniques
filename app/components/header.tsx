import type { User } from '@prisma/client'
import { Form, Link } from '@remix-run/react'

interface Props {
  user?: Pick<User, 'email' | 'id'>
  currentUrl: string
}

export default function Header({ user, currentUrl }: Props) {
  return (
    <header className="flex items-center justify-between border-b-2 bg-white p-4 text-black">
      <h1 className="text-2xl font-bold">
        <Link to=".">
          <img
            src="/images/5ej-logo.png"
            alt="5 Elements Jiu jitsu"
            className="inline h-14"
          />{' '}
          Techniques
        </Link>
      </h1>
      {user ? (
        <Form
          action="/logout"
          method="post"
        >
          <div className="flex items-center justify-between gap-2">
            <p>{user?.email}</p>
            <button
              type="submit"
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Logout
            </button>
          </div>
        </Form>
      ) : (
        !/\/login$/.test(currentUrl) && (
          <Link to="/login">
            <button
              type="button"
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Login
            </button>
          </Link>
        )
      )}
    </header>
  )
}
