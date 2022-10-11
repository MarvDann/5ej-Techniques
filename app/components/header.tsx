import type { User } from '@prisma/client'
import { Form, Link } from '@remix-run/react'
import { useState } from 'react'
import Nav from './nav'

interface Props {
  user?: Pick<User, 'email' | 'id'>
  currentUrl: string
  categories: any
}

export default function Header({ user, currentUrl, categories }: Props) {
  const [showNav, setShowNav] = useState(false)

  const handleMenuClick = () => {
    setShowNav(!showNav)
  }

  const handleNavChange = () => {
    setShowNav(false)
  }

  return (
    <>
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
        <div className="flex flex-row justify-between gap-4">
          {user ? (
            <Form
              action="/logout"
              method="post"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="hidden md:block">{user?.email}</p>
                <button
                  type="submit"
                  className="rounded bg-slate-600 py-1.5 px-3 text-sm text-blue-100 hover:bg-blue-500 active:bg-blue-600"
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
                  className="rounded bg-slate-600 py-1.5 px-3  text-sm text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                >
                  Login
                </button>
              </Link>
            )
          )}
          <div className="block lg:hidden">
            <button
              onClick={handleMenuClick}
              className="flex items-center rounded border-2 border-slate-400 px-3 py-2 text-slate-400 hover:border-white hover:text-white"
            >
              <svg
                className="h-3 w-3 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {showNav && (
        <div className="w-full">
          <Nav
            categories={categories}
            userId={user?.id}
            onChange={handleNavChange}
          />
        </div>
      )}
    </>
  )
}
