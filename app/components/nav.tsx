import type { Category } from '@prisma/client'
import { Link } from '@remix-run/react'

type Cat = Pick<Category, 'name' | 'slug'>

interface Props {
  categories: Cat[]
  userId?: string
  onChange?: () => void
}

export default function Nav({ categories, userId, onChange }: Props) {
  const handleNavChange = () => {
    onChange && onChange()
  }

  return (
    <div className="h-full min-w-fit border-r bg-gray-100">
      {userId && (
        <Link
          to="/categories/new"
          className="block p-4 text-lg text-blue-800"
          onClick={handleNavChange}
        >
          + Add Category
        </Link>
      )}
      <hr />
      <ul>
        {categories.map((cat: Cat) => (
          <li key={cat.slug}>
            <Link
              to={`/categories/${cat.slug}`}
              className="block px-6 py-3 text-lg text-slate-500"
              onClick={handleNavChange}
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
