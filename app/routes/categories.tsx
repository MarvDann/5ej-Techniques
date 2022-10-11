import { Outlet, useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LoaderArgs } from '@remix-run/node'
import Nav from '~/components/nav'
import { getCategories } from '~/models/category.server'
import { getUserId } from '~/session.server'

export async function loader({ request }: LoaderArgs) {
  let categories = await getCategories()

  if (!categories) {
    throw new Response('Not Found', { status: 404 })
  }

  let userId = await getUserId(request)

  return json({ categories, userId })
}

export default function CategoriesPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <div className="hidden h-full min-w-fit md:block">
        <Nav
          categories={data?.categories}
          userId={data?.userId}
        />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </>
  )
}
