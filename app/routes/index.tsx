import { json } from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'
import CategoryListing from '~/components/CategoryListing'
import { getCategories } from '~/models/category.server'

export async function loader() {
  const categories = await getCategories()

  if (!categories) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({ categories })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="flex flex-col gap-2 p-6">
      <div className="grid grid-cols-3 gap-6">
        {data &&
          data.categories?.length &&
          data.categories.map((cat) => (
            <CategoryListing
              key={cat.slug}
              slug={cat.slug}
              name={cat.name}
              imgUrl={cat.categoryImage}
            />
          ))}
      </div>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Categories not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
