import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"

import tailwindStylesheetUrl from "./styles/tailwind.css"
import { getUser } from "./session.server"
import { User } from "@prisma/client"
import Header from "./components/header"
import Nav from "./components/nav"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "5 Elements Jiu Jitsu Techniques",
  viewport: "width=device-width,initial-scale=1",
})

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  })
}

interface LoaderData {
  user: User | undefined
}

export default function App() {
  let { user } = useLoaderData<LoaderData>()
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="flex h-full min-h-screen flex-col">
          <Header user={user} />
          <main className="flex h-full bg-white">
            <Nav />
            <Outlet />
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
