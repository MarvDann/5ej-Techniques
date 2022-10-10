import { Form, Link } from '@remix-run/react'

interface Props {
  category: {
    id: string
    name: string
    slug: string
  }
  userId?: string | null
}

export default function CategoryTop({ category, userId }: Props) {
  return (
    <div className="flex w-full flex-row justify-between border-b py-3 px-6">
      <div>
        {category.name && (
          <h1 className="text-navy-600 inline">{category.name}</h1>
        )}
      </div>
      <div className="flex flex-row gap-4">
        {userId && (
          <>
            <Link to={`/categories/edit/${category.slug}`}>
              <button className="rounded-md bg-blue-700 px-3 py-1 text-sm text-white">
                Edit
              </button>
            </Link>
            <Form method="post">
              <input
                type="hidden"
                name="id"
                value={category.id}
              />
              <button
                type="submit"
                className="rounded-md bg-red-700 px-3 py-1 text-sm text-white"
              >
                Delete
              </button>
            </Form>
          </>
        )}
      </div>
    </div>
  )
}
