import { Link, useCatch, useLoaderData } from '@remix-run/react'
import { ActionArgs, LoaderArgs, redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { deleteCategory, getCategory } from '../../models/category.server'
import CategoryTop from '~/components/CategoryTop'
import { getUserId } from '~/session.server'

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.slug, 'slug not found in params')

  const userId = await getUserId(request)

  const category = await getCategory(params.slug)

  if (!category) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({ category, userId })
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()

  const id = formData.get('id') as string

  try {
    await deleteCategory(id)
  } catch (err: any) {
    throw new Response(err.message, { status: 400 })
  }

  return redirect('/')
}

export default function CategoryPage() {
  const data = useLoaderData<typeof loader>()

  const imageUrl = data.category.categoryImage
    ? `/uploads/${data.category.categoryImage}`
    : 'https://placeholder.pics/svg/480x270/D5D5D5-F8F8F8/717171-858585/No%20image%20yet'

  return (
    <div className="flex flex-col">
      <CategoryTop
        category={data.category}
        userId={data.userId}
      />
      <div className="flex flex-row gap-2 p-6">
        <figure className="flex w-6/12 flex-col content-center border border-gray-200">
          <img
            src={imageUrl}
            alt={data.category.name}
          />
          <figcaption className="py-1 text-center">
            {data.category.name}
          </figcaption>
        </figure>
        <div className="px-6">
          <ul>
            {data.category.techniques.map((technique) => (
              <li key={technique.slug}>
                <Link to={`/techniques/${technique.slug}`}>
                  {technique.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
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
    return <div className="w-full p-6">Category not found</div>
  }

  if (caught.status === 400) {
    return (
      <div className="w-full p-6">
        Delete unsuccessful
        <br />
        {caught.data}
      </div>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
