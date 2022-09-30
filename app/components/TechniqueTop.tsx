import { Form, Link } from '@remix-run/react'

interface Props {
  technique: {
    name: string
    slug: string
    id: string
  }
  category: {
    name: string
    slug: string
  }
  userId?: string | null
}

export default function TechniqueTop({ category, technique, userId }: Props) {
  return (
    <div className="flex w-full flex-row justify-between border-b py-3 px-6">
      <div>
        <Link
          className="text-blue-800"
          to={`/categories/${category.slug}`}
        >
          {category.name}
        </Link>
        {technique.name && (
          <>
            {' > '}
            <h1 className="text-navy-600 inline">{technique.name}</h1>
          </>
        )}
      </div>
      <div className="flex flex-row gap-4">
        {userId && (
          <>
            <Link to={`/techniques/edit/${technique.slug}`}>
              <button className="rounded-md bg-blue-700 px-3 py-1 text-sm text-white">
                Edit
              </button>
            </Link>
            <Form method="post">
              <input
                type="hidden"
                name="id"
                value={technique.id}
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
