import { Outlet, useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import Nav from '~/components/nav'
import { getCategories } from '~/models/category.server'

export async function loader() {
  let categories = await getCategories()

  if (!categories) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({ categories })
}

export default function TechniquesPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <Nav categories={data?.categories} />
      <div className="w-full">
        <Outlet />
      </div>
    </>
  )
}
