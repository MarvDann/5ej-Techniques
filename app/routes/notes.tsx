import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react"

import { requireUserId } from "~/session.server"
import { useUser } from "~/utils"
import { getNoteListItems } from "~/models/note.server"

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request)
  const noteListItems = await getNoteListItems({ userId })
  return json({ noteListItems })
}

export default function NotesPage() {
  const data = useLoaderData<typeof loader>()
  const user = useUser()

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between border-b-2 bg-white p-4 text-black">
        <h1 className="text-2xl font-bold">
          <Link to=".">
            <img
              src="images/5ej-logo.png"
              alt="5 Elements Jiu jitsu"
              className="inline h-14"
            />{" "}
            Techniques
          </Link>
        </h1>

        <Form action="/logout" method="post">
          <div className="flex items-center justify-between gap-2">
            <p>{user.email}</p>
            <button
              type="submit"
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Logout
            </button>
          </div>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Note
          </Link>

          <hr />

          {data.noteListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.noteListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
